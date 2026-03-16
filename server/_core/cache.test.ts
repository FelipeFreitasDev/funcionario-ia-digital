import { describe, it, expect, beforeEach } from "vitest";
import { imageCache, getCachedImage, cacheImageResult } from "./cache";

/**
 * Tests para Cache Helper - Armazenamento de imagens geradas
 */

describe("image cache", () => {
  beforeEach(() => {
    imageCache.clear();
  });

  describe("set and get", () => {
    it("should store and retrieve cached image", () => {
      const testData = { url: "https://example.com/image.jpg", prompt: "test" };

      cacheImageResult("test prompt", "moderno", 1024, 768, "huggingface", testData);

      const cached = getCachedImage("test prompt", "moderno", 1024, 768, "huggingface");

      expect(cached).toEqual(testData);
    });

    it("should return null for non-existent cache entry", () => {
      const cached = getCachedImage("nonexistent", "moderno", 1024, 768, "huggingface");
      expect(cached).toBeNull();
    });

    it("should differentiate cache by style", () => {
      const data1 = { url: "image1.jpg" };
      const data2 = { url: "image2.jpg" };

      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", data1);
      cacheImageResult("prompt", "minimalista", 1024, 768, "huggingface", data2);

      const cached1 = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      const cached2 = getCachedImage("prompt", "minimalista", 1024, 768, "huggingface");

      expect(cached1).toEqual(data1);
      expect(cached2).toEqual(data2);
    });

    it("should differentiate cache by dimensions", () => {
      const data1 = { url: "image1.jpg" };
      const data2 = { url: "image2.jpg" };

      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", data1);
      cacheImageResult("prompt", "moderno", 512, 512, "huggingface", data2);

      const cached1 = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      const cached2 = getCachedImage("prompt", "moderno", 512, 512, "huggingface");

      expect(cached1).toEqual(data1);
      expect(cached2).toEqual(data2);
    });

    it("should differentiate cache by provider", () => {
      const data1 = { url: "image1.jpg" };
      const data2 = { url: "image2.jpg" };

      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", data1);
      cacheImageResult("prompt", "moderno", 1024, 768, "replicate", data2);

      const cached1 = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      const cached2 = getCachedImage("prompt", "moderno", 1024, 768, "replicate");

      expect(cached1).toEqual(data1);
      expect(cached2).toEqual(data2);
    });
  });

  describe("expiration", () => {
    it("should return null for expired cache entry", async () => {
      const testData = { url: "https://example.com/image.jpg" };

      // Store with 1 second TTL
      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", testData, 1);

      // Should be available immediately
      let cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toEqual(testData);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should be expired now
      cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toBeNull();
    });

    it("should use custom TTL", async () => {
      const testData = { url: "https://example.com/image.jpg" };

      // Store with 2 second TTL
      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", testData, 2);

      // Should be available after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toEqual(testData);

      // Should be expired after 2.5 seconds total
      await new Promise((resolve) => setTimeout(resolve, 1500));
      cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toBeNull();
    });
  });

  describe("cache statistics", () => {
    it("should return correct cache stats", () => {
      cacheImageResult("prompt1", "moderno", 1024, 768, "huggingface", { url: "1.jpg" });
      cacheImageResult("prompt2", "minimalista", 1024, 768, "huggingface", { url: "2.jpg" });

      const stats = imageCache.getStats();

      expect(stats.entries).toBe(2);
      expect(stats.maxSize).toBe(100); // default
      expect(stats.ttl).toBe(3600); // default
    });

    it("should cleanup expired entries in stats", async () => {
      cacheImageResult("prompt1", "moderno", 1024, 768, "huggingface", { url: "1.jpg" }, 1);
      cacheImageResult("prompt2", "minimalista", 1024, 768, "huggingface", { url: "2.jpg" });

      await new Promise((resolve) => setTimeout(resolve, 1100));

      const stats = imageCache.getStats();

      // Should only have 1 entry after cleanup
      expect(stats.entries).toBe(1);
    });
  });

  describe("cache limits", () => {
    it("should respect max size limit", () => {
      imageCache.setMaxSize(3);

      cacheImageResult("prompt1", "moderno", 1024, 768, "huggingface", { url: "1.jpg" });
      cacheImageResult("prompt2", "minimalista", 1024, 768, "huggingface", { url: "2.jpg" });
      cacheImageResult("prompt3", "fotografico", 1024, 768, "huggingface", { url: "3.jpg" });

      const stats1 = imageCache.getStats();
      expect(stats1.entries).toBe(3);

      // Adding 4th should remove oldest
      cacheImageResult("prompt4", "ilustracao", 1024, 768, "huggingface", { url: "4.jpg" });

      const stats2 = imageCache.getStats();
      expect(stats2.entries).toBeLessThanOrEqual(3);
    });
  });

  describe("clear cache", () => {
    it("should clear all cache entries", () => {
      cacheImageResult("prompt1", "moderno", 1024, 768, "huggingface", { url: "1.jpg" });
      cacheImageResult("prompt2", "minimalista", 1024, 768, "huggingface", { url: "2.jpg" });

      let stats = imageCache.getStats();
      expect(stats.entries).toBe(2);

      imageCache.clear();

      stats = imageCache.getStats();
      expect(stats.entries).toBe(0);
    });
  });

  describe("TTL configuration", () => {
    it("should use custom default TTL", async () => {
      imageCache.setTTL(1); // 1 second

      const testData = { url: "https://example.com/image.jpg" };
      cacheImageResult("prompt", "moderno", 1024, 768, "huggingface", testData);

      // Should be available immediately
      let cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toEqual(testData);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should be expired
      cached = getCachedImage("prompt", "moderno", 1024, 768, "huggingface");
      expect(cached).toBeNull();

      // Reset to default
      imageCache.setTTL(3600);
    });
  });
});
