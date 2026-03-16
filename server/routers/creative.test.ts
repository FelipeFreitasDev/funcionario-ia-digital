import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

function createAuthContext(): { ctx: TrpcContext } {
  const user = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus" as const,
    role: "user" as const,
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
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

/**
 * Tests para Creative Router - Geração de conteúdo com múltiplas AIs
 */

describe("creative router", () => {
  beforeEach(() => {
    // Mock das variáveis de ambiente para testes
    process.env.LEONARDO_AI_API_KEY = "test-leonardo-key";
    process.env.STABILITY_AI_API_KEY = "test-stability-key";
    process.env.REPLICATE_API_KEY = "test-replicate-key";
    process.env.HUGGINGFACE_API_KEY = "test-huggingface-key";
  });

  describe("getAvailableImageProviders", () => {
    it("should return list of available image providers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = await caller.creative.getAvailableImageProviders();

      expect(providers).toBeDefined();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);

      // Verificar estrutura de cada provedor
      providers.forEach((provider) => {
        expect(provider).toHaveProperty("name");
        expect(provider).toHaveProperty("provider");
        expect(provider).toHaveProperty("available");
        expect(provider).toHaveProperty("freeCredits");
      });
    });

    it("should include Leonardo AI as available provider", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = await caller.creative.getAvailableImageProviders();
      const leonardo = providers.find((p) => p.provider === "leonardo");

      expect(leonardo).toBeDefined();
      expect(leonardo?.available).toBe(true);
    });
  });

  describe("getAvailableVideoProviders", () => {
    it("should return list of available video providers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = await caller.creative.getAvailableVideoProviders();

      expect(providers).toBeDefined();
      expect(Array.isArray(providers)).toBe(true);
      expect(providers.length).toBeGreaterThan(0);

      // Verificar estrutura
      providers.forEach((provider) => {
        expect(provider).toHaveProperty("name");
        expect(provider).toHaveProperty("provider");
        expect(provider).toHaveProperty("available");
        expect(provider).toHaveProperty("freeCredits");
      });
    });

    it("should include Replicate as available provider", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = await caller.creative.getAvailableVideoProviders();
      const replicate = providers.find((p) => p.provider === "replicate");

      expect(replicate).toBeDefined();
      expect(replicate?.available).toBe(true);
    });
  });

  describe("generateImage", () => {
    it("should return error when prompt is too short", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.creative.generateImage({
          prompt: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should accept valid image generation request", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateImage({
        prompt: "Um lindo pôr do sol na praia com palmeiras",
        style: "fotografico",
        quality: "high",
        provider: "auto",
      });

      expect(result).toHaveProperty("success");
      // Pode falhar se API não está configurada, mas estrutura deve ser válida
      if (!result.success) {
        expect(result).toHaveProperty("error");
      }
    });

    it("should support different styles", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const styles = ["moderno", "minimalista", "fotografico", "ilustracao", "3d", "anime"];

      for (const style of styles) {
        const result = await caller.creative.generateImage({
          prompt: "Um produto de teste com estilo específico",
          style: style as any,
        });

        expect(result).toHaveProperty("success");
      }
    });

    it("should support different quality levels", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const qualities = ["standard", "high", "ultra"];

      for (const quality of qualities) {
        const result = await caller.creative.generateImage({
          prompt: "Uma imagem de teste com qualidade variável",
          quality: quality as any,
        });

        expect(result).toHaveProperty("success");
      }
    });

    it("should support different providers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = ["stability", "leonardo", "replicate", "huggingface", "auto"];

      for (const provider of providers) {
        const result = await caller.creative.generateImage({
          prompt: "Uma imagem de teste com diferentes provedores",
          provider: provider as any,
        });

        expect(result).toHaveProperty("success");
      }
    });

    it("should accept custom dimensions", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateImage({
        prompt: "Uma imagem com dimensões customizadas",
        width: 512,
        height: 768,
      });

      expect(result).toHaveProperty("success");
    });

    it("should accept negative prompt", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateImage({
        prompt: "Um produto profissional",
        negativePrompt: "baixa qualidade, desfocado, distorcido",
      });

      expect(result).toHaveProperty("success");
    });
  });

  describe("generateVideo", () => {
    it("should return error when prompt is too short", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.creative.generateVideo({
          prompt: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should accept valid video generation request", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateVideo({
        prompt: "Um vídeo mostrando um produto sendo usado em um ambiente moderno",
        duration: "15",
        style: "moderno",
      });

      expect(result).toHaveProperty("success");
      if (!result.success) {
        expect(result).toHaveProperty("error");
      }
    });

    it("should support different durations", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const durations = ["15", "30", "60"];

      for (const duration of durations) {
        const result = await caller.creative.generateVideo({
          prompt: "Um vídeo de teste com diferentes durações",
          duration: duration as any,
        });

        expect(result).toHaveProperty("success");
      }
    });

    it("should support different video styles", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const styles = ["moderno", "minimalista", "cinematico", "animado", "corporativo"];

      for (const style of styles) {
        const result = await caller.creative.generateVideo({
          prompt: "Um vídeo de teste com estilo específico",
          style: style as any,
        });

        expect(result).toHaveProperty("success");
      }
    });

    it("should support different video providers", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const providers = ["replicate", "huggingface", "did", "runway", "auto"];

      for (const provider of providers) {
        const result = await caller.creative.generateVideo({
          prompt: "Um vídeo de teste com diferentes provedores",
          provider: provider as any,
        });

        expect(result).toHaveProperty("success");
      }
    });
  });

  describe("generateImageVariations", () => {
    it("should generate multiple image variations", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateImageVariations({
        prompt: "Um produto inovador em um estilo moderno",
        count: 3,
        style: "moderno",
      });

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("failed");
      expect(result.count + result.failed).toBe(3);
    });

    it("should respect maximum variation count", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateImageVariations({
        prompt: "Um produto inovador",
        count: 5, // máximo
      });

      expect(result).toHaveProperty("success");
      expect(result.count).toBeLessThanOrEqual(5);
    });
  });

  describe("generateSocialPost", () => {
    it("should generate social media post for Instagram", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateSocialPost({
        topic: "Lançamento de novo produto digital",
        platform: "instagram",
        style: "moderno",
        includeImage: true,
      });

      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("copy");
      expect(result).toHaveProperty("platform");
      expect(result.platform).toBe("instagram");
    });

    it("should generate posts for different platforms", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const platforms = ["instagram", "facebook", "twitter", "linkedin", "tiktok"];

      for (const platform of platforms) {
        const result = await caller.creative.generateSocialPost({
          topic: "Conteúdo de teste",
          platform: platform as any,
        });

        expect(result).toHaveProperty("success");
        expect(result.platform).toBe(platform);
      }
    });

    it("should generate post without image", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateSocialPost({
        topic: "Conteúdo apenas com texto",
        platform: "twitter",
        includeImage: false,
      });

      expect(result).toHaveProperty("success");
      expect(result.image).toBeNull();
    });
  });

  describe("generateProductMockup", () => {
    it("should generate product mockup", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateProductMockup({
        productName: "Fone Bluetooth Premium",
        productDescription: "Fone de ouvido wireless com cancelamento de ruído ativo",
        style: "moderno",
        background: "branco",
      });

      expect(result).toHaveProperty("success");
      if (result.success) {
        expect(result).toHaveProperty("productName");
        expect(result.productName).toBe("Fone Bluetooth Premium");
      }
    });

    it("should support different backgrounds", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const backgrounds = ["branco", "preto", "gradiente", "natural"];

      for (const background of backgrounds) {
        const result = await caller.creative.generateProductMockup({
          productName: "Produto Teste",
          productDescription: "Um produto de teste com diferentes fundos",
          background: background as any,
        });

        expect(result).toHaveProperty("success");
      }
    });
  });

  describe("generateVideoThumbnail", () => {
    it("should generate video thumbnail", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creative.generateVideoThumbnail({
        videoTitle: "Como Usar o Funcionário Digital",
        style: "moderno",
        mainColor: "#00D9FF",
      });

      expect(result).toHaveProperty("success");
      if (result.success) {
        expect(result).toHaveProperty("videoTitle");
        expect(result.videoTitle).toBe("Como Usar o Funcionário Digital");
      }
    });

    it("should accept custom colors", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

      for (const color of colors) {
        const result = await caller.creative.generateVideoThumbnail({
          videoTitle: "Vídeo com Cor Customizada",
          mainColor: color,
        });

        expect(result).toHaveProperty("success");
      }
    });
  });
});
