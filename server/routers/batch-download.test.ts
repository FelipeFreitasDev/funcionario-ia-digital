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
    req: {
      headers: {},
    } as any,
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as any,
  };

  return { ctx, clearedCookies };
}

/**
 * Tests para Batch Download Router
 */

describe("batch download router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("getInfo", () => {
    it("should get download info", async () => {
      const result = await caller.batchDownload.getInfo({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.generationCount).toBeGreaterThanOrEqual(0);
      expect(result.data.estimatedSize).toBeGreaterThanOrEqual(0);
      expect(result.data.estimatedSizeFormatted).toBeDefined();
    });

    it("should get info with type filter", async () => {
      const result = await caller.batchDownload.getInfo({
        type: "image",
      });

      expect(result.success).toBe(true);
      expect(result.data.filters.type).toBe("image");
    });

    it("should get info with style filter", async () => {
      const result = await caller.batchDownload.getInfo({
        style: "moderno",
      });

      expect(result.success).toBe(true);
      expect(result.data.filters.style).toBe("moderno");
    });

    it("should get info with date range", async () => {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const result = await caller.batchDownload.getInfo({
        startDate,
        endDate,
      });

      expect(result.success).toBe(true);
      expect(result.data.filters.startDate).toBe(startDate);
      expect(result.data.filters.endDate).toBe(endDate);
    });
  });

  describe("listForDownload", () => {
    it("should list generations for download", async () => {
      const result = await caller.batchDownload.listForDownload({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(typeof result.hasMore).toBe("boolean");
    });

    it("should respect limit", async () => {
      const result = await caller.batchDownload.listForDownload({
        limit: 5,
      });

      expect(result.success).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(5);
    });

    it("should respect offset", async () => {
      const result1 = await caller.batchDownload.listForDownload({
        limit: 10,
        offset: 0,
      });

      const result2 = await caller.batchDownload.listForDownload({
        limit: 10,
        offset: 10,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it("should filter by type", async () => {
      const result = await caller.batchDownload.listForDownload({
        type: "image",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should filter by style", async () => {
      const result = await caller.batchDownload.listForDownload({
        style: "moderno",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe("generateZip", () => {
    it("should generate ZIP with all generations", async () => {
      const result = await caller.batchDownload.generateZip({});

      expect(result.success).toBe(true);
      expect(result.filename).toBeDefined();
      expect(result.size).toBeGreaterThanOrEqual(0);
      expect(result.data).toBeDefined();
    });

    it("should generate ZIP with type filter", async () => {
      const result = await caller.batchDownload.generateZip({
        type: "image",
      });

      expect(result.success).toBe(true);
      expect(result.filename).toContain("image");
    });

    it("should generate ZIP with style filter", async () => {
      const result = await caller.batchDownload.generateZip({
        style: "moderno",
      });

      expect(result.success).toBe(true);
      expect(result.filename).toContain("moderno");
    });

    it("should generate ZIP with limit", async () => {
      const result = await caller.batchDownload.generateZip({
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.size).toBeGreaterThanOrEqual(0);
    });

    it("should generate ZIP with date range", async () => {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      const result = await caller.batchDownload.generateZip({
        startDate,
        endDate,
      });

      expect(result.success).toBe(true);
      expect(result.filename).toBeDefined();
    });

    it("should fail with invalid limit", async () => {
      const result = await caller.batchDownload.generateZip({
        limit: 2000,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("downloadSelected", () => {
    it("should prepare download for selected generations", async () => {
      const result = await caller.batchDownload.downloadSelected({
        generationIds: ["GEN-1", "GEN-2", "GEN-3"],
      });

      expect(result.success).toBe(true);
      expect(result.filename).toBeDefined();
      expect(result.size).toBeGreaterThanOrEqual(0);
      expect(result.message).toContain("3");
    });

    it("should fail with empty selection", async () => {
      const result = await caller.batchDownload.downloadSelected({
        generationIds: [],
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle multiple selections", async () => {
      const ids = Array.from({ length: 50 }, (_, i) => `GEN-${i}`);

      const result = await caller.batchDownload.downloadSelected({
        generationIds: ids,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("50");
    });

    it("should respect max limit", async () => {
      const ids = Array.from({ length: 1001 }, (_, i) => `GEN-${i}`);

      const result = await caller.batchDownload.downloadSelected({
        generationIds: ids,
      });

      expect(result.success).toBe(false);
    });
  });
});
