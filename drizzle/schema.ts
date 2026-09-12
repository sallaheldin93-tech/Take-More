import { boolean, datetime, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  durationMinutes: int("durationMinutes").notNull().default(60),
  priceLabel: varchar("priceLabel", { length: 64 }),
  isActive: boolean("isActive").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ activeIdx: index("services_active_idx").on(table.isActive) }));

export const availability = mysqlTable("availability", {
  id: int("id").autoincrement().primaryKey(),
  weekday: int("weekday").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  slotIntervalMinutes: int("slotIntervalMinutes").notNull().default(30),
  isActive: boolean("isActive").notNull().default(true),
}, table => ({ weekdayIdx: index("availability_weekday_idx").on(table.weekday) }));

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingCode: varchar("bookingCode", { length: 24 }).notNull().unique(),
  serviceId: int("serviceId").notNull(),
  customerName: varchar("customerName", { length: 160 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 40 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  notes: text("notes"),
  startAt: datetime("startAt").notNull(),
  endAt: datetime("endAt").notNull(),
  status: mysqlEnum("status", ["confirmed", "cancelled"]).notNull().default("confirmed"),
  whatsappCustomerSent: boolean("whatsappCustomerSent").notNull().default(false),
  whatsappOwnerSent: boolean("whatsappOwnerSent").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({
  slotIdx: uniqueIndex("bookings_start_at_unique").on(table.startAt),
  dateIdx: index("bookings_start_at_idx").on(table.startAt),
  statusIdx: index("bookings_status_idx").on(table.status),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type Availability = typeof availability.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
