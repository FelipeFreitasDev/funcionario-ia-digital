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
 * Tests para Favorites Router
 */

describe("favorites router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("add", () => {
    it("should add generation to favorites", async () => {
      const result = await caller.favorites.add({
        generationId: "GEN-123",
        collectionName: "My Collection",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.message).toContain("favoritos");
    });

    it("should add without collection name", async () => {
      const result = await caller.favorites.add({
        generationId: "GEN-456",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });
  });

  describe("isFavorite", () => {
    it("should check if generation is favorite", async () => {
      const result = await caller.favorites.isFavorite({
        generationId: "GEN-123",
      });

      expect(result.success).toBe(true);
      expect(result.isFavorite).toBeDefined();
      expect(typeof result.isFavorite).toBe("boolean");
    });
  });

  describe("list", () => {
    it("should list user favorites", async () => {
      const result = await caller.favorites.list({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(0);
    });

    it("should filter by collection", async () => {
      const result = await caller.favorites.list({
        collectionName: "My Collection",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should respect limit and offset", async () => {
      const result = await caller.favorites.list({
        limit: 5,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(result.data.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getCollections", () => {
    it("should get user collections", async () => {
      const result = await caller.favorites.getCollections();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe("getStats", () => {
    it("should get favorites statistics", async () => {
      const result = await caller.favorites.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data.total).toBeGreaterThanOrEqual(0);
      expect(result.data.collections).toBeGreaterThanOrEqual(0);
      expect(result.data.public_shares).toBeGreaterThanOrEqual(0);
    });
  });

  describe("share", () => {
    it("should generate public share link", async () => {
      const addResult = await caller.favorites.add({
        generationId: "GEN-789",
      });

      if (addResult.success && addResult.id) {
        const shareResult = await caller.favorites.share({
          id: addResult.id,
          expiresInDays: 7,
        });

        expect(shareResult.success).toBe(true);
        expect(shareResult.publicToken).toBeDefined();
        expect(shareResult.shareUrl).toBeDefined();
        expect(shareResult.expiresInDays).toBe(7);
      }
    });

    it("should share without expiration", async () => {
      const addResult = await caller.favorites.add({
        generationId: "GEN-999",
      });

      if (addResult.success && addResult.id) {
        const shareResult = await caller.favorites.share({
          id: addResult.id,
        });

        expect(shareResult.success).toBe(true);
        expect(shareResult.publicToken).toBeDefined();
      }
    });
  });

  describe("remove", () => {
    it("should remove favorite", async () => {
      const addResult = await caller.favorites.add({
        generationId: "GEN-remove-test",
      });

      if (addResult.success && addResult.id) {
        const removeResult = await caller.favorites.remove({
          id: addResult.id,
        });

        expect(removeResult.success).toBe(true);
        expect(removeResult.message).toContain("favoritos");
      }
    });

    it("should fail removing non-existent favorite", async () => {
      const result = await caller.favorites.remove({
        id: "FAV-nonexistent",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
