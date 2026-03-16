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

describe("push notifications router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("subscribe", () => {
    it("should subscribe to push notifications", async () => {
      const result = await caller.pushNotifications.subscribe({
        endpoint: "https://example.com/push",
        p256dh: "test-p256dh",
        auth: "test-auth",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Inscrito");
    });
  });

  describe("getSubscriptions", () => {
    it("should get user subscriptions", async () => {
      const result = await caller.pushNotifications.getSubscriptions();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(typeof result.count).toBe("number");
    });
  });

  describe("sendTestNotification", () => {
    it("should send test notification", async () => {
      const result = await caller.pushNotifications.sendTestNotification();

      expect(result.success).toBe(true);
      expect(result.message).toContain("enviada");
    });
  });

  describe("sendNewOrderNotification", () => {
    it("should send new order notification", async () => {
      const result = await caller.pushNotifications.sendNewOrderNotification({
        orderNumber: "ORD-12345",
        amount: 299.90,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("enviada");
    });
  });

  describe("sendPublicationNotification", () => {
    it("should send publication notification", async () => {
      const result = await caller.pushNotifications.sendPublicationNotification({
        platform: "Shopee",
        productName: "Produto Teste",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("enviada");
    });
  });

  describe("sendLowInventoryNotification", () => {
    it("should send low inventory notification", async () => {
      const result = await caller.pushNotifications.sendLowInventoryNotification({
        productName: "Produto Teste",
        quantity: 5,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("enviada");
    });
  });

  describe("getStats", () => {
    it("should get push notification statistics", async () => {
      const result = await caller.pushNotifications.getStats();

      expect(result.success).toBe(true);
      expect(result.data?.totalUsers).toBeGreaterThanOrEqual(0);
      expect(result.data?.totalSubscriptions).toBeGreaterThanOrEqual(0);
    });
  });

  describe("cleanupExpired", () => {
    it("should cleanup expired subscriptions", async () => {
      const result = await caller.pushNotifications.cleanupExpired();

      expect(result.success).toBe(true);
      expect(result.message).toContain("removidas");
    });
  });

  describe("unsubscribe", () => {
    it("should unsubscribe from push notifications", async () => {
      const result = await caller.pushNotifications.unsubscribe({
        endpoint: "https://example.com/push",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Desinscrito");
    });
  });
});
