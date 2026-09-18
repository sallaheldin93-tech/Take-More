import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { sendBookingEmail } from "./email";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { availability, bookings, getDb, listAvailability, listBookings, listServices, services } from "./db";
import { notifyBooking } from "./whatsapp";
import { notifyOwner } from "./_core/notification";

const defaultSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function cairoDate(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", dateStyle: "medium", timeStyle: "short" }).format(value);
}

function normalizePhoneInput(value: unknown) {
  if (typeof value !== "string") return value;
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return value
    .replace(/[٠-٩]/g, digit => String(arabicDigits.indexOf(digit)))
    .replace(/[^0-9+]/g, "")
    .trim();
}

function makeCode() {
  return `TM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  booking: router({
    config: publicProcedure.query(async () => ({ services: await listServices(), availability: await listAvailability() })),
    availableSlots: publicProcedure.input(z.object({ serviceId: z.number().int().positive(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })).query(async ({ input }) => {
      const config = await listAvailability();
      const selectedDate = new Date(`${input.date}T12:00:00+03:00`);
      const hours = config.find(item => item.weekday === selectedDate.getDay());
      if (!hours) return [];
      const slots: string[] = [];
      const cursor = new Date(cairoDate(input.date, hours.startTime));
      const end = new Date(cairoDate(input.date, hours.endTime));
      const interval = hours.slotIntervalMinutes || 30;
      while (cursor < end) {
        slots.push(cursor.toISOString());
        cursor.setMinutes(cursor.getMinutes() + interval);
      }
      const dayStart = new Date(`${input.date}T00:00:00+03:00`);
      const dayEnd = new Date(`${input.date}T23:59:59+03:00`);
      const db = await getDb();
      const taken = db ? await db.select({ startAt: bookings.startAt }).from(bookings).where(and(gte(bookings.startAt, dayStart), lt(bookings.startAt, dayEnd), eq(bookings.status, "confirmed"))) : [];
      const takenSet = new Set(taken.map(item => new Date(item.startAt).getTime()));
      return slots.filter(slot => !takenSet.has(new Date(slot).getTime()));
    }),
    create: publicProcedure.input(z.object({
      serviceId: z.number().int().positive(),
      customerName: z.string().min(2).max(160),
      customerPhone: z.preprocess(normalizePhoneInput, z.string().min(7, "Please enter a valid WhatsApp number with at least 7 digits.").max(40)),
      customerEmail: z.string().email().optional().or(z.literal("")),
      notes: z.string().max(1000).optional(),
      startAt: z.string().datetime(),
      language: z.enum(["ar", "en"]).default("en"),
    })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Booking database is not connected yet." });
      const service = await db.select().from(services).where(and(eq(services.id, input.serviceId), eq(services.isActive, true))).limit(1);
      if (!service[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Selected service is no longer available." });
      const startAt = new Date(input.startAt);
      if (startAt.getTime() < Date.now()) throw new TRPCError({ code: "BAD_REQUEST", message: "Please choose a future slot." });
      const endAt = new Date(startAt.getTime() + service[0].durationMinutes * 60_000);
      const existing = await db.select({ id: bookings.id }).from(bookings).where(and(eq(bookings.startAt, startAt), eq(bookings.status, "confirmed"))).limit(1);
      if (existing[0]) throw new TRPCError({ code: "CONFLICT", message: "This time was just booked. Please choose another slot." });
      const bookingCode = makeCode();
      try {
        await db.insert(bookings).values({ bookingCode, serviceId: input.serviceId, customerName: input.customerName, customerPhone: input.customerPhone, customerEmail: input.customerEmail || null, notes: input.notes || null, startAt, endAt, status: "confirmed" });
      } catch (error) {
        throw new TRPCError({ code: "CONFLICT", message: "This time was just booked. Please choose another slot." });
      }
      const dateLabel = formatDateTime(startAt).split(",")[0] || formatDateTime(startAt);
      const timeLabel = formatDateTime(startAt).split(",")[1]?.trim() || "";
      const notification = await notifyBooking({ bookingCode, customerName: input.customerName, customerPhone: input.customerPhone, serviceName: service[0].name, dateLabel, timeLabel, language: input.language });
      const email = await sendBookingEmail({ bookingCode, customerName: input.customerName, customerPhone: input.customerPhone, customerEmail: input.customerEmail || undefined, serviceName: service[0].name, dateLabel, timeLabel, notes: input.notes });
      let ownerNotified = false;
      try {
        ownerNotified = await notifyOwner({
          title: `New Take More booking — ${bookingCode}`,
          content: `New booking email sent to info@take-more.com: ${email.sent ? "Yes" : "No"}\n\nCustomer: ${input.customerName}\nPhone: ${input.customerPhone}\nEmail: ${input.customerEmail || "Not provided"}\nService: ${service[0].name}\nDate: ${dateLabel}\nTime: ${timeLabel}\nBooking code: ${bookingCode}\nWhatsApp notification sent: ${notification.ownerSent ? "Yes" : "Not configured"}`,
        });
      } catch (error) {
        console.warn("[Booking] Owner notification failed", error);
      }
      await db.update(bookings).set({ whatsappCustomerSent: notification.customerSent, whatsappOwnerSent: notification.ownerSent || ownerNotified }).where(eq(bookings.bookingCode, bookingCode));
      return { bookingCode, startAt: startAt.toISOString(), serviceName: service[0].name, whatsapp: notification, email: { sent: email.sent, reason: email.reason } };
    }),
    adminList: adminProcedure.query(async () => listBookings()),
    adminUpdateStatus: adminProcedure.input(z.object({ id: z.number().int(), status: z.enum(["confirmed", "cancelled"]) })).mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Database is not connected." });
      await db.update(bookings).set({ status: input.status }).where(eq(bookings.id, input.id));
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
