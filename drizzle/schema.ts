import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, longtext, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Support Tickets Table
 * Armazena tickets de suporte criados pelos usuários
 */
export const supportTickets = mysqlTable("support_tickets", {
  id: varchar("id", { length: 100 }).primaryKey(), // SUPP-{timestamp}-{random}
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  category: mysqlEnum("category", [
    "installation",
    "performance",
    "compatibility",
    "features",
    "offline",
    "other",
  ]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: longtext("description").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "resolved", "closed"]).default("open").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("low").notNull(),
  attachments: json("attachments").$type<Array<{
    filename: string;
    size: number;
    url: string;
  }>>().default([]),
  responses: json("responses").$type<Array<{
    author: string;
    message: string;
    timestamp: string; // ISO 8601 string
  }>>().default([]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = typeof supportTickets.$inferInsert;

/**
 * Purchases Table
 * Armazena informações de compras dos usuários
 */
export const purchases = mysqlTable("purchases", {
  id: varchar("id", { length: 100 }).primaryKey(), // PURCHASE-{timestamp}-{random}
  transactionId: varchar("transactionId", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  amount: int("amount").notNull(), // em centavos (29990 = R$ 299,90)
  currency: varchar("currency", { length: 3 }).default("BRL").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  kiwifyOrderId: varchar("kiwifyOrderId", { length: 255 }),
  downloadToken: varchar("downloadToken", { length: 255 }).unique(), // Token para download
  downloadCount: int("downloadCount").default(0).notNull(),
  lastDownloadAt: timestamp("lastDownloadAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Data de expiração do token de download
});

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

/**
 * Image/Video Generations Table
 * Armazena histórico de imagens e vídeos gerados pelos usuários
 */
export const generations = mysqlTable("generations", {
  id: varchar("id", { length: 100 }).primaryKey(), // GEN-{timestamp}-{random}
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["image", "video"]).notNull(),
  prompt: longtext("prompt").notNull(),
  style: varchar("style", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  quality: varchar("quality", { length: 20 }),
  duration: int("duration"), // em segundos, para vídeos
  width: int("width").default(1024),
  height: int("height").default(768),
  url: text("url"), // URL da imagem/vídeo gerado
  thumbnailUrl: text("thumbnailUrl"), // URL do thumbnail
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  error: text("error"), // Mensagem de erro se falhar
  processingTime: int("processingTime"), // em milissegundos
  fromCache: boolean("fromCache").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  expiresAt: timestamp("expiresAt"), // Data de expiração (para limpeza automática)
});

export type Generation = typeof generations.$inferSelect;
export type InsertGeneration = typeof generations.$inferInsert;
