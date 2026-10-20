import { boolean, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["user", "admin"]);
export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "cancelled"]);

const updatedAt = () => timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date());

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  durationMinutes: integer("durationMinutes").notNull().default(60),
  priceLabel: varchar("priceLabel", { length: 64 }),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, table => [index("services_active_idx").on(table.isActive)]);

export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  weekday: integer("weekday").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  slotIntervalMinutes: integer("slotIntervalMinutes").notNull().default(30),
  isActive: boolean("isActive").notNull().default(true),
}, table => [index("availability_weekday_idx").on(table.weekday)]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingCode: varchar("bookingCode", { length: 24 }).notNull().unique(),
  serviceId: integer("serviceId").notNull(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 40 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  notes: text("notes"),
  startAt: timestamp("startAt", { withTimezone: true }).notNull(),
  endAt: timestamp("endAt", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").notNull().default("confirmed"),
  whatsappCustomerSent: boolean("whatsappCustomerSent").notNull().default(false),
  whatsappOwnerSent: boolean("whatsappOwnerSent").notNull().default(false),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: updatedAt(),
}, table => [
  uniqueIndex("bookings_start_at_unique").on(table.startAt),
  index("bookings_status_idx").on(table.status),
]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
