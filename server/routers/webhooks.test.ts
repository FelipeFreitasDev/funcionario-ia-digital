import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { headers: {} } as any,
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as any,
  };

  return { ctx, clearedCookies };
}

describe("webhooks router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("shopee", () => {
    it("should receive Shopee webhook", async () => {
      const result = await caller.webhooks.shopee({
        event: "order_create",
        data: { order_id: "123456", amount: 100 },
      });

      expect(result.success).toBe(true);
      expect(result.webhookId).toBeDefined();
    });

    it("should handle invalid Shopee webhook", async () => {
      const result = await caller.webhooks.shopee({
        event: "",
        data: {},
      });

      expect(result.success).toBe(false);
    });
  });

  describe("mercadolivre", () => {
    it("should receive Mercado Livre webhook", async () => {
      const result = await caller.webhooks.mercadolivre({
        resource: "orders/123",
        action: "created",
      });

      expect(result.success).toBe(true);
      expect(result.webhookId).toBeDefined();
    });

    it("should handle order update webhook", async () => {
      const result = await caller.webhooks.mercadolivre({
        resource: "orders/456",
        action: "updated",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("amazon", () => {
    it("should receive Amazon webhook", async () => {
      const result = await caller.webhooks.amazon({
        notificationType: "ORDER_CHANGE",
        payload: { orderId: "789", status: "shipped" },
      });

      expect(result.success).toBe(true);
      expect(result.webhookId).toBeDefined();
    });

    it("should handle inventory update webhook", async () => {
      const result = await caller.webhooks.amazon({
        notificationType: "INVENTORY_CHANGE",
        payload: { sku: "ABC123", quantity: 50 },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("getStatus", () => {
    it("should get webhook status", async () => {
      const result = await caller.webhooks.getStatus({
        webhookId: "WH-123456",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.status).toBe("completed");
    });
  });

  describe("list", () => {
    it("should list webhooks", async () => {
      const result = await caller.webhooks.list({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should filter by platform", async () => {
      const result = await caller.webhooks.list({
        platform: "shopee",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.every((w) => w.platform === "shopee")).toBe(true);
    });

    it("should filter by status", async () => {
      const result = await caller.webhooks.list({
        status: "completed",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.every((w) => w.status === "completed")).toBe(true);
    });
  });

  describe("getStats", () => {
    it("should get webhook statistics", async () => {
      const result = await caller.webhooks.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.totalReceived).toBeGreaterThan(0);
      expect(result.data?.successRate).toBeGreaterThan(0);
    });
  });

  describe("retry", () => {
    it("should retry failed webhook", async () => {
      const result = await caller.webhooks.retry({
        webhookId: "WH-failed-123",
      });

      expect(result.success).toBe(true);
      expect(result.nextRetryAt).toBeDefined();
    });
  });
});
