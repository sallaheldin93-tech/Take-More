import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { availability, bookings, InsertUser, services, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

const defaultServices = [
  { name: "ERP Solutions", description: "Finance, inventory and operations in one connected system.", durationMinutes: 60, priceLabel: "Discovery call" },
  { name: "POS Systems", description: "Fast and reliable point-of-sale solutions for every transaction.", durationMinutes: 45, priceLabel: "Product demo" },
  { name: "Websites", description: "High-performance websites designed to build trust and convert.", durationMinutes: 60, priceLabel: "Project consultation" },
  { name: "CRM Automation", description: "Smarter customer relationships, follow-ups and internal workflows.", durationMinutes: 45, priceLabel: "Strategy session" },
];

const defaultAvailability = [
  { weekday: 0, startTime: "10:00", endTime: "17:00", slotIntervalMinutes: 30 },
  { weekday: 1, startTime: "10:00", endTime: "17:00", slotIntervalMinutes: 30 },
  { weekday: 2, startTime: "10:00", endTime: "17:00", slotIntervalMinutes: 30 },
  { weekday: 3, startTime: "10:00", endTime: "17:00", slotIntervalMinutes: 30 },
  { weekday: 4, startTime: "10:00", endTime: "17:00", slotIntervalMinutes: 30 },
];

export async function ensureBookingSeed() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: services.id }).from(services).limit(1);
  if (existing.length === 0) await db.insert(services).values(defaultServices);
  const existingHours = await db.select({ id: availability.id }).from(availability).limit(1);
  if (existingHours.length === 0) await db.insert(availability).values(defaultAvailability);
}

export async function listServices() {
  const db = await getDb();
  if (!db) return defaultServices.map((service, index) => ({ ...service, id: index + 1, isActive: true }));
  await ensureBookingSeed();
  return db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.id));
}

export async function listAvailability() {
  const db = await getDb();
  if (!db) return defaultAvailability.map((hour, index) => ({ ...hour, id: index + 1, isActive: true }));
  await ensureBookingSeed();
  return db.select().from(availability).where(eq(availability.isActive, true)).orderBy(asc(availability.weekday));
}

export async function listBookings() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ booking: bookings, service: services }).from(bookings).leftJoin(services, eq(bookings.serviceId, services.id)).orderBy(desc(bookings.startAt));
}

export async function listTakenSlots(dayStart: Date, dayEnd: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ startAt: bookings.startAt }).from(bookings).where(and(gte(bookings.startAt, dayStart), lt(bookings.startAt, dayEnd), eq(bookings.status, "confirmed")));
}

export { bookings, services, availability };
