import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { availability, bookings, getDb, listAvailability, listBookings, listServices, services } from "./db";
import { notifyBooking } from "./whatsapp";

const defaultSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

function cairoDate(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`);
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", dateStyle: "medium", timeStyle: "short" }).format(value);
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
      customerPhone: z.string().trim().min(7, "Please enter a valid WhatsApp number with at least 7 digits.").max(40),
      customerEmail: z.string().email().optional().or(z.literal("")),
      notes: z.string().max(1000).optional(),
      startAt: z.string().datetime(),
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
      const notification = await notifyBooking({ bookingCode, customerName: input.customerName, customerPhone: input.customerPhone, serviceName: service[0].name, dateLabel: formatDateTime(startAt).split(",")[0] || formatDateTime(startAt), timeLabel: formatDateTime(startAt).split(",")[1]?.trim() || "" });
      await db.update(bookings).set({ whatsappCustomerSent: notification.customerSent, whatsappOwnerSent: notification.ownerSent }).where(eq(bookings.bookingCode, bookingCode));
      return { bookingCode, startAt: startAt.toISOString(), serviceName: service[0].name, whatsapp: notification };
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
