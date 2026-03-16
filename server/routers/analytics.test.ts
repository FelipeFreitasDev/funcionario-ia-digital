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

describe("analytics router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("getSummary", () => {
    it("should get analytics summary", async () => {
      const result = await caller.analytics.getSummary();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.totalSales).toBeGreaterThan(0);
      expect(result.data?.totalOrders).toBeGreaterThan(0);
    });
  });

  describe("getSalesStats", () => {
    it("should get sales stats for all platforms", async () => {
      const result = await caller.analytics.getSalesStats({
        platform: "all",
        period: "month",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.total).toBeGreaterThan(0);
    });

    it("should get sales stats for Shopee", async () => {
      const result = await caller.analytics.getSalesStats({
        platform: "shopee",
        period: "week",
      });

      expect(result.success).toBe(true);
      expect(result.data?.byPlatform?.shopee).toBeDefined();
    });

    it("should support different periods", async () => {
      const periods = ["day", "week", "month", "year"] as const;

      for (const period of periods) {
        const result = await caller.analytics.getSalesStats({
          platform: "all",
          period,
        });

        expect(result.success).toBe(true);
      }
    });
  });

  describe("getPopularGenerations", () => {
    it("should get popular generations", async () => {
      const result = await caller.analytics.getPopularGenerations({
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeLessThanOrEqual(10);
    });

    it("should return sorted by count", async () => {
      const result = await caller.analytics.getPopularGenerations({
        limit: 5,
      });

      expect(result.success).toBe(true);
      const data = result.data || [];
      for (let i = 1; i < data.length; i++) {
        expect(data[i - 1].count).toBeGreaterThanOrEqual(data[i].count);
      }
    });
  });

  describe("getRoiByPlatform", () => {
    it("should get ROI by platform", async () => {
      const result = await caller.analytics.getRoiByPlatform({
        period: "month",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.shopee).toBeDefined();
      expect(result.data?.mercadolivre).toBeDefined();
      expect(result.data?.amazon).toBeDefined();
    });

    it("should calculate ROI correctly", async () => {
      const result = await caller.analytics.getRoiByPlatform({
        period: "year",
      });

      expect(result.success).toBe(true);
      const shopee = result.data?.shopee;
      expect(shopee?.roi).toBe((shopee!.revenue - shopee!.cost) / shopee!.cost * 100);
    });
  });

  describe("getSalesTrends", () => {
    it("should get sales trends", async () => {
      const result = await caller.analytics.getSalesTrends({
        days: 30,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBe(30);
    });

    it("should have correct date format", async () => {
      const result = await caller.analytics.getSalesTrends({
        days: 7,
      });

      expect(result.success).toBe(true);
      result.data?.forEach((item) => {
        expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe("getGrowth", () => {
    it("should calculate positive growth", async () => {
      const result = await caller.analytics.getGrowth({
        current: 150,
        previous: 100,
      });

      expect(result.success).toBe(true);
      expect(result.data?.percentage).toBe(50);
      expect(result.data?.trend).toBe("up");
    });

    it("should calculate negative growth", async () => {
      const result = await caller.analytics.getGrowth({
        current: 50,
        previous: 100,
      });

      expect(result.success).toBe(true);
      expect(result.data?.percentage).toBe(-50);
      expect(result.data?.trend).toBe("down");
    });

    it("should detect stable growth", async () => {
      const result = await caller.analytics.getGrowth({
        current: 105,
        previous: 100,
      });

      expect(result.success).toBe(true);
      expect(result.data?.trend).toBe("stable");
    });
  });

  describe("getDashboard", () => {
    it("should get complete dashboard", async () => {
      const result = await caller.analytics.getDashboard({
        period: "month",
      });

      expect(result.success).toBe(true);
      expect(result.data?.summary).toBeDefined();
      expect(result.data?.salesStats).toBeDefined();
      expect(result.data?.trends).toBeDefined();
      expect(result.data?.roi).toBeDefined();
      expect(result.data?.popularGenerations).toBeDefined();
    });
  });

  describe("exportReport", () => {
    it("should export CSV report", async () => {
      const result = await caller.analytics.exportReport({
        format: "csv",
        period: "month",
      });

      expect(result.success).toBe(true);
      expect(result.filename).toContain(".csv");
      expect(result.size).toBeGreaterThan(0);
    });

    it("should export PDF report", async () => {
      const result = await caller.analytics.exportReport({
        format: "pdf",
        period: "year",
      });

      expect(result.success).toBe(true);
      expect(result.filename).toContain(".pdf");
      expect(result.size).toBeGreaterThan(0);
    });
  });
});
