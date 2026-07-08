import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

// Apps & Games catalog for TK Store
export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  developer: varchar("developer", { length: 200 }).notNull().default("TK Studio"),
  // "app" or "game" — decided by #App / #game tag in admin panel
  type: varchar("type", { length: 20 }).notNull().default("app"),
  category: varchar("category", { length: 100 }).notNull().default("General"),
  description: text("description").notNull().default(""),
  iconUrl: text("icon_url").notNull().default(""),
  bannerUrl: text("banner_url").notNull().default(""),
  screenshots: jsonb("screenshots").$type<string[]>().notNull().default([]),
  downloadUrl: text("download_url").notNull().default(""),
  version: varchar("version", { length: 40 }).notNull().default("1.0.0"),
  size: varchar("size", { length: 40 }).notNull().default("24 MB"),
  rating: real("rating").notNull().default(4.5),
  downloads: varchar("downloads", { length: 40 }).notNull().default("1K+"),
  ageRating: varchar("age_rating", { length: 20 }).notNull().default("3+"),
  featured: boolean("featured").notNull().default(false),
  accentColor: varchar("accent_color", { length: 20 }).notNull().default("#7c3aed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;
