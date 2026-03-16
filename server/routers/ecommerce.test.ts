import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("ecommerce router", () => {
  describe("searchChampionProducts", () => {
    it("should return products for a valid keyword and platform", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.searchChampionProducts({
        keyword: "fone bluetooth",
        platform: "shopee",
        limit: 10,
      });

      expect(result).toBeDefined();
      expect(result.platform).toBe("shopee");
      expect(result.keyword).toBe("fone bluetooth");
      expect(Array.isArray(result.products)).toBe(true);
      expect(result.products.length).toBeLessThanOrEqual(10);
    });

    it("should return products from mercadolivre", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.searchChampionProducts({
        keyword: "suporte celular",
        platform: "mercadolivre",
      });

      expect(result.platform).toBe("mercadolivre");
      expect(result.products.length).toBeGreaterThan(0);
    });

    it("should return products from amazon", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.searchChampionProducts({
        keyword: "webcam",
        platform: "amazon",
      });

      expect(result.platform).toBe("amazon");
      expect(result.products.length).toBeGreaterThan(0);
    });

    it("should respect the limit parameter", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.searchChampionProducts({
        keyword: "fone",
        platform: "shopee",
        limit: 5,
      });

      expect(result.products.length).toBeLessThanOrEqual(5);
    });
  });

  describe("publishProduct", () => {
    it("should publish a product successfully", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.publishProduct({
        productId: "test_123",
        name: "Fone Bluetooth Teste",
        description: "Um fone bluetooth de teste",
        price: 99.9,
        image: "https://example.com/image.jpg",
        platform: "shopee",
        stock: 50,
        category: "Eletrônicos",
      });

      expect(result.success).toBe(true);
      expect(result.productId).toBe("test_123");
      expect(result.platform).toBe("shopee");
      expect(result.publishedUrl).toBeDefined();
    });

    it("should publish to loja_propria", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.publishProduct({
        productId: "own_store_1",
        name: "eBook Digital",
        description: "Um eBook digital",
        price: 49.9,
        image: "https://example.com/ebook.jpg",
        platform: "loja_propria",
        stock: 999,
        category: "Educação",
      });

      expect(result.success).toBe(true);
      expect(result.platform).toBe("loja_propria");
    });
  });

  describe("syncInventory", () => {
    it("should sync inventory across platforms", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.syncInventory({
        productId: "sync_test_1",
        platforms: ["shopee", "mercadolivre"],
        quantity: 100,
      });

      expect(result.success).toBe(true);
      expect(result.productId).toBe("sync_test_1");
      expect(result.synced).toContain("shopee");
      expect(result.synced).toContain("mercadolivre");
      expect(result.quantity).toBe(100);
    });

    it("should sync to all three platforms", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.syncInventory({
        productId: "sync_all",
        platforms: ["shopee", "mercadolivre", "amazon"],
        quantity: 50,
      });

      expect(result.synced.length).toBe(3);
      expect(result.synced).toContain("amazon");
    });
  });

  describe("getCompetitorAnalysis", () => {
    it("should return competitor analysis", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.getCompetitorAnalysis({
        productId: "comp_test",
        platform: "shopee",
      });

      expect(result.productId).toBe("comp_test");
      expect(result.platform).toBe("shopee");
      expect(Array.isArray(result.competitors)).toBe(true);
      expect(result.competitors.length).toBeGreaterThan(0);
      expect(result.recommendation).toBeDefined();
      expect(result.priceOptimal).toBeDefined();
    });
  });

  describe("processOrder", () => {
    it("should process an order successfully", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.processOrder({
        orderId: "order_123",
        platform: "shopee",
        buyerEmail: "buyer@example.com",
        items: [
          { productId: "prod_1", quantity: 2, price: 49.9 },
          { productId: "prod_2", quantity: 1, price: 99.9 },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.orderId).toBe("order_123");
      expect(result.total).toBe(199.7); // 2*49.9 + 1*99.9
      expect(result.status).toBe("Processando");
      expect(result.shippingLabel).toBeDefined();
      expect(result.estimatedDelivery).toBeDefined();
    });

    it("should calculate correct total for multiple items", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.processOrder({
        orderId: "order_456",
        platform: "mercadolivre",
        buyerEmail: "test@example.com",
        items: [
          { productId: "p1", quantity: 1, price: 100 },
          { productId: "p2", quantity: 3, price: 50 },
        ],
      });

      expect(result.total).toBe(250); // 1*100 + 3*50
    });
  });

  describe("getSalesStats", () => {
    it("should return sales stats for a platform", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.getSalesStats({
        platform: "shopee",
        period: "month",
      });

      expect(result.platform).toBe("shopee");
      expect(result.period).toBe("month");
      expect(result.totalSales).toBeGreaterThan(0);
      expect(result.totalRevenue).toBeGreaterThan(0);
      expect(result.totalOrders).toBeGreaterThan(0);
      expect(result.averageOrderValue).toBeGreaterThan(0);
      expect(result.topProduct).toBeDefined();
      expect(result.topPlatform).toBeDefined();
    });

    it("should return stats for all platforms", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.ecommerce.getSalesStats({
        platform: "all",
        period: "week",
      });

      expect(result.platform).toBe("all");
      expect(result.period).toBe("week");
      expect(result.totalSales).toBeGreaterThan(0);
    });

    it("should support different time periods", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const dayStats = await caller.ecommerce.getSalesStats({
        platform: "amazon",
        period: "day",
      });

      const yearStats = await caller.ecommerce.getSalesStats({
        platform: "amazon",
        period: "year",
      });

      expect(dayStats.period).toBe("day");
      expect(yearStats.period).toBe("year");
    });
  });
});
