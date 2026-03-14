import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, supportTickets, InsertSupportTicket, SupportTicket, purchases, InsertPurchase, Purchase } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

/**
 * Support Ticket Functions
 */
export async function createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create ticket: database not available");
    return null;
  }

  try {
    await db.insert(supportTickets).values(ticket);
    const result = await db.select().from(supportTickets).where(eq(supportTickets.id, ticket.id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create support ticket:", error);
    throw error;
  }
}

export async function getSupportTicketById(id: string): Promise<SupportTicket | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get ticket: database not available");
    return null;
  }

  const result = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getSupportTicketsByEmail(email: string): Promise<SupportTicket[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get tickets: database not available");
    return [];
  }

  return await db.select().from(supportTickets).where(eq(supportTickets.email, email)).orderBy(desc(supportTickets.createdAt));
}

export async function addResponseToTicket(ticketId: string, author: string, message: string): Promise<SupportTicket | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update ticket: database not available");
    return null;
  }

  try {
    const ticket = await getSupportTicketById(ticketId);
    if (!ticket) return null;

    const currentResponses = ticket.responses || [];
    const updatedResponses = [
      ...currentResponses,
      {
        author,
        message,
        timestamp: new Date().toISOString(),
      },
    ];

    await db.update(supportTickets).set({ responses: updatedResponses }).where(eq(supportTickets.id, ticketId));
    return await getSupportTicketById(ticketId);
  } catch (error) {
    console.error("[Database] Failed to add response:", error);
    throw error;
  }
}

/**
 * Purchase Functions
 */
export async function createPurchase(purchase: InsertPurchase): Promise<Purchase | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create purchase: database not available");
    return null;
  }

  try {
    await db.insert(purchases).values(purchase);
    const result = await db.select().from(purchases).where(eq(purchases.id, purchase.id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create purchase:", error);
    throw error;
  }
}

export async function getPurchaseByTransactionId(transactionId: string): Promise<Purchase | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get purchase: database not available");
    return null;
  }

  const result = await db.select().from(purchases).where(eq(purchases.transactionId, transactionId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPurchaseByDownloadToken(downloadToken: string): Promise<Purchase | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get purchase: database not available");
    return null;
  }

  const result = await db.select().from(purchases).where(eq(purchases.downloadToken, downloadToken)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePurchaseStatus(id: string, status: "pending" | "approved" | "failed" | "refunded"): Promise<Purchase | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update purchase: database not available");
    return null;
  }

  try {
    await db.update(purchases).set({ status }).where(eq(purchases.id, id));
    const result = await db.select().from(purchases).where(eq(purchases.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update purchase:", error);
    throw error;
  }
}

export async function incrementDownloadCount(id: string): Promise<Purchase | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update purchase: database not available");
    return null;
  }

  try {
    const purchase = await db.select().from(purchases).where(eq(purchases.id, id)).limit(1);
    if (purchase.length === 0) return null;

    const updated = purchase[0];
    await db.update(purchases).set({
      downloadCount: (updated.downloadCount || 0) + 1,
      lastDownloadAt: new Date(),
    }).where(eq(purchases.id, id));

    return await db.select().from(purchases).where(eq(purchases.id, id)).limit(1).then(r => r[0] || null);
  } catch (error) {
    console.error("[Database] Failed to increment download count:", error);
    throw error;
  }
}
