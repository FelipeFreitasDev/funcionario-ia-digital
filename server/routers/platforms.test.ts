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

describe("platforms router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("getAuthorizationUrl", () => {
    it("should get authorization URL for Shopee", async () => {
      const result = await caller.platforms.getAuthorizationUrl({
        platform: "shopee",
      });

      expect(result.success).toBe(true);
      expect(result.data?.authUrl).toBeDefined();
      expect(result.data?.state).toBeDefined();
    });

    it("should get authorization URL for Mercado Livre", async () => {
      const result = await caller.platforms.getAuthorizationUrl({
        platform: "mercadolivre",
      });

      expect(result.success).toBe(true);
      expect(result.data?.authUrl).toBeDefined();
    });

    it("should get authorization URL for Amazon", async () => {
      const result = await caller.platforms.getAuthorizationUrl({
        platform: "amazon",
      });

      expect(result.success).toBe(true);
      expect(result.data?.authUrl).toBeDefined();
    });
  });

  describe("getConnectedPlatforms", () => {
    it("should get list of connected platforms", async () => {
      const result = await caller.platforms.getConnectedPlatforms();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe("getSyncStatus", () => {
    it("should get sync status for all platforms", async () => {
      const result = await caller.platforms.getSyncStatus();

      expect(result.success).toBe(true);
      expect(result.data?.shopee).toBeDefined();
      expect(result.data?.mercadolivre).toBeDefined();
      expect(result.data?.amazon).toBeDefined();
    });
  });

  describe("testConnection", () => {
    it("should test connection to Shopee", async () => {
      const result = await caller.platforms.testConnection({
        platform: "shopee",
      });

      expect(result.success).toBe(true);
      expect(result.message).toBeDefined();
    });

    it("should test connection to Mercado Livre", async () => {
      const result = await caller.platforms.testConnection({
        platform: "mercadolivre",
      });

      expect(result.success).toBe(true);
    });

    it("should test connection to Amazon", async () => {
      const result = await caller.platforms.testConnection({
        platform: "amazon",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("syncPlatformData", () => {
    it("should sync data from Shopee", async () => {
      const result = await caller.platforms.syncPlatformData({
        platform: "shopee",
      });

      expect(result.success).toBe(true);
      expect(result.data?.platform).toBe("shopee");
      expect(result.data?.syncedAt).toBeDefined();
    });

    it("should sync data from Mercado Livre", async () => {
      const result = await caller.platforms.syncPlatformData({
        platform: "mercadolivre",
      });

      expect(result.success).toBe(true);
      expect(result.data?.platform).toBe("mercadolivre");
    });
  });

  describe("disconnectPlatform", () => {
    it("should disconnect from Shopee", async () => {
      const result = await caller.platforms.disconnectPlatform({
        platform: "shopee",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("desconectado");
    });

    it("should disconnect from Mercado Livre", async () => {
      const result = await caller.platforms.disconnectPlatform({
        platform: "mercadolivre",
      });

      expect(result.success).toBe(true);
    });
  });
});
