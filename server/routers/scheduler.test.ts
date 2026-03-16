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

describe("scheduler router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("create", () => {
    it("should create scheduled post", async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const result = await caller.scheduler.create({
        title: "Test Post",
        content: "This is a test post content",
        platforms: ["shopee", "instagram"],
        scheduledAt: futureDate.toISOString(),
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe("Test Post");
    });

    it("should reject past dates", async () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000);

      const result = await caller.scheduler.create({
        title: "Past Post",
        content: "Content",
        platforms: ["shopee"],
        scheduledAt: pastDate.toISOString(),
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject dates too far in future", async () => {
      const farFutureDate = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000);

      const result = await caller.scheduler.create({
        title: "Far Future Post",
        content: "Content",
        platforms: ["shopee"],
        scheduledAt: farFutureDate.toISOString(),
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("list", () => {
    it("should list scheduled posts", async () => {
      const result = await caller.scheduler.list({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThan(0);
    });

    it("should filter by status", async () => {
      const result = await caller.scheduler.list({
        status: "scheduled",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.every((p) => p.status === "scheduled")).toBe(true);
    });

    it("should support pagination", async () => {
      const result1 = await caller.scheduler.list({
        limit: 2,
        offset: 0,
      });

      const result2 = await caller.scheduler.list({
        limit: 2,
        offset: 2,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.data?.length).toBeLessThanOrEqual(2);
      expect(result2.data?.length).toBeLessThanOrEqual(2);
    });
  });

  describe("getUpcoming", () => {
    it("should get upcoming posts", async () => {
      const result = await caller.scheduler.getUpcoming({
        hoursAhead: 24,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should get posts within specified hours", async () => {
      const result = await caller.scheduler.getUpcoming({
        hoursAhead: 48,
      });

      expect(result.success).toBe(true);
      const now = new Date();
      result.data?.forEach((post) => {
        const hoursUntil = (post.scheduledAt.getTime() - now.getTime()) / (60 * 60 * 1000);
        expect(hoursUntil).toBeLessThanOrEqual(48);
      });
    });
  });

  describe("cancel", () => {
    it("should cancel scheduled post", async () => {
      const result = await caller.scheduler.cancel({
        postId: "SCHED-123",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("edit", () => {
    it("should edit scheduled post", async () => {
      const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

      const result = await caller.scheduler.edit({
        postId: "SCHED-123",
        title: "Updated Title",
        content: "Updated content",
        scheduledAt: futureDate.toISOString(),
      });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated Title");
    });

    it("should reject invalid schedule time on edit", async () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000);

      const result = await caller.scheduler.edit({
        postId: "SCHED-123",
        scheduledAt: pastDate.toISOString(),
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("publishNow", () => {
    it("should publish post immediately", async () => {
      const result = await caller.scheduler.publishNow({
        title: "Immediate Post",
        content: "This is published now",
        platforms: ["shopee", "instagram"],
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.shopee).toBeDefined();
      expect(result.data?.instagram).toBeDefined();
    });

    it("should handle multiple platforms", async () => {
      const result = await caller.scheduler.publishNow({
        title: "Multi Platform Post",
        content: "Content for all platforms",
        platforms: ["shopee", "mercadolivre", "amazon", "instagram", "facebook", "tiktok"],
      });

      expect(result.success).toBe(true);
      expect(Object.keys(result.data || {}).length).toBe(6);
    });
  });

  describe("getStats", () => {
    it("should get scheduler statistics", async () => {
      const result = await caller.scheduler.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.totalScheduled).toBeGreaterThan(0);
      expect(result.data?.publishedToday).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getPreview", () => {
    it("should get Instagram preview", async () => {
      const result = await caller.scheduler.getPreview({
        title: "Test Title",
        content: "Test content with #hashtag",
        platform: "instagram",
      });

      expect(result.success).toBe(true);
      expect(result.data?.caption).toBeDefined();
      expect(result.data?.hashtags).toBeDefined();
    });

    it("should get Shopee preview", async () => {
      const result = await caller.scheduler.getPreview({
        title: "Product Title",
        content: "Product description",
        platform: "shopee",
      });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Product Title");
      expect(result.data?.characterCount).toBeGreaterThan(0);
    });

    it("should get preview for all platforms", async () => {
      const platforms = ["shopee", "mercadolivre", "amazon", "instagram", "facebook", "tiktok"] as const;

      for (const platform of platforms) {
        const result = await caller.scheduler.getPreview({
          title: "Test",
          content: "Test content",
          platform,
        });

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
      }
    });
  });
});
