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
 * Tests para Generations Router - Persistência de histórico de gerações
 */

describe("generations router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("create", () => {
    it("should create a new image generation", async () => {
      const result = await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        quality: "high",
        width: 1024,
        height: 768,
        url: "https://example.com/image.jpg",
        fromCache: false,
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
      expect(result.id).toMatch(/^GEN-/);
    });

    it("should create a new video generation", async () => {
      const result = await caller.generations.create({
        type: "video",
        prompt: "A robot walking through a futuristic city",
        style: "3d",
        provider: "replicate",
        duration: 30,
        url: "https://example.com/video.mp4",
      });

      expect(result.success).toBe(true);
      expect(result.id).toBeDefined();
    });

    it("should reject invalid prompt", async () => {
      const result = await caller.generations.create({
        type: "image",
        prompt: "short",
        style: "moderno",
        provider: "huggingface",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("list", () => {
    it("should list user generations", async () => {
      // Create some generations first
      await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image1.jpg",
      });

      await caller.generations.create({
        type: "image",
        prompt: "A futuristic city skyline at night",
        style: "moderno",
        provider: "huggingface",
        url: "https://example.com/image2.jpg",
      });

      const result = await caller.generations.list({
        limit: 10,
        offset: 0,
      });

      expect(result.success).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(2);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should filter by type", async () => {
      // Create image and video
      await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image.jpg",
      });

      await caller.generations.create({
        type: "video",
        prompt: "A robot walking through a city",
        style: "3d",
        provider: "replicate",
        duration: 30,
        url: "https://example.com/video.mp4",
      });

      const result = await caller.generations.list({
        type: "image",
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should respect limit and offset", async () => {
      // Create multiple generations
      for (let i = 0; i < 5; i++) {
        await caller.generations.create({
          type: "image",
          prompt: `A beautiful image number ${i}`,
          style: "moderno",
          provider: "huggingface",
          url: `https://example.com/image${i}.jpg`,
        });
      }

      const result1 = await caller.generations.list({
        limit: 2,
        offset: 0,
      });

      const result2 = await caller.generations.list({
        limit: 2,
        offset: 2,
      });

      expect(result1.data.length).toBeLessThanOrEqual(2);
      expect(result2.data.length).toBeLessThanOrEqual(2);
    });
  });

  describe("getById", () => {
    it("should get generation by id", async () => {
      const createResult = await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image.jpg",
      });

      const getResult = await caller.generations.getById({
        id: createResult.id,
      });

      expect(getResult.success).toBe(true);
      expect(getResult.data).toBeDefined();
      expect((getResult.data as any).id).toBe(createResult.id);
    });

    it("should return null for non-existent id", async () => {
      const result = await caller.generations.getById({
        id: "GEN-nonexistent-id",
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe("updateStatus", () => {
    it("should update generation status", async () => {
      const createResult = await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
      });

      const updateResult = await caller.generations.updateStatus({
        id: createResult.id,
        status: "completed",
        url: "https://example.com/image.jpg",
        processingTime: 5000,
      });

      expect(updateResult.success).toBe(true);

      // Verify update
      const getResult = await caller.generations.getById({
        id: createResult.id,
      });

      expect((getResult.data as any).status).toBe("completed");
      expect((getResult.data as any).url).toBe("https://example.com/image.jpg");
    });

    it("should handle error status", async () => {
      const createResult = await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
      });

      const updateResult = await caller.generations.updateStatus({
        id: createResult.id,
        status: "failed",
        error: "API rate limit exceeded",
      });

      expect(updateResult.success).toBe(true);

      // Verify error was saved
      const getResult = await caller.generations.getById({
        id: createResult.id,
      });

      expect((getResult.data as any).status).toBe("failed");
      expect((getResult.data as any).error).toBe("API rate limit exceeded");
    });
  });

  describe("delete", () => {
    it("should delete generation", async () => {
      const createResult = await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image.jpg",
      });

      const deleteResult = await caller.generations.delete({
        id: createResult.id,
      });

      expect(deleteResult.success).toBe(true);

      // Verify deletion
      const getResult = await caller.generations.getById({
        id: createResult.id,
      });

      expect(getResult.data).toBeNull();
    });
  });

  describe("getStats", () => {
    it("should return generation statistics", async () => {
      // Create some generations
      await caller.generations.create({
        type: "image",
        prompt: "A beautiful sunset over the ocean",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image1.jpg",
      });

      await caller.generations.create({
        type: "image",
        prompt: "A futuristic city skyline",
        style: "moderno",
        provider: "huggingface",
        url: "https://example.com/image2.jpg",
      });

      await caller.generations.create({
        type: "video",
        prompt: "A robot walking",
        style: "3d",
        provider: "replicate",
        duration: 30,
        url: "https://example.com/video.mp4",
      });

      const result = await caller.generations.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect((result.data as any).total).toBeGreaterThanOrEqual(3);
      expect((result.data as any).images).toBeGreaterThanOrEqual(2);
      expect((result.data as any).videos).toBeGreaterThanOrEqual(1);
      expect((result.data as any).completed).toBeGreaterThanOrEqual(3);
    });
  });

  describe("getPopularStyles", () => {
    it("should return popular styles", async () => {
      // Create generations with different styles
      await caller.generations.create({
        type: "image",
        prompt: "Image 1",
        style: "moderno",
        provider: "huggingface",
        url: "https://example.com/image1.jpg",
      });

      await caller.generations.create({
        type: "image",
        prompt: "Image 2",
        style: "moderno",
        provider: "huggingface",
        url: "https://example.com/image2.jpg",
      });

      await caller.generations.create({
        type: "image",
        prompt: "Image 3",
        style: "fotografico",
        provider: "huggingface",
        url: "https://example.com/image3.jpg",
      });

      const result = await caller.generations.getPopularStyles({
        limit: 5,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      // First style should be "moderno" with count 2
      if (result.data.length > 0) {
        expect((result.data[0] as any).style).toBe("moderno");
        expect((result.data[0] as any).count).toBe(2);
      }
    });
  });
});
