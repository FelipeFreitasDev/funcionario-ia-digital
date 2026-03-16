import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  generateImageWithAI,
  getAvailableProviders,
  type AIProvider,
  type ImageGenerationOptions,
} from "../_core/aiImageGeneration";
import {
  getCachedImage,
  cacheImageResult,
  imageCache,
} from "../_core/cache";
import {
  generateVideoWithAI,
  getAvailableVideoProviders,
  type VideoProvider,
  type VideoGenerationOptions,
} from "../_core/aiVideoGeneration";

/**
 * Creative Router - Geração de conteúdo com múltiplas AIs gratuitas
 */
export const creativeRouter = router({
  /**
   * Gerar imagem com IA (com cache integrado)
   */
  generateImage: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(10),
        style: z
          .enum([
            "moderno",
            "minimalista",
            "fotografico",
            "ilustracao",
            "3d",
            "anime",
          ])
          .default("moderno"),
        provider: z
          .enum(["stability", "leonardo", "replicate", "huggingface", "auto"])
          .default("auto"),
        width: z.number().default(1024),
        height: z.number().default(768),
        quality: z.enum(["standard", "high", "ultra"]).default("high"),
        negativePrompt: z.string().optional(),
        useCache: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verificar cache se habilitado
        if (input.useCache) {
          const cached = getCachedImage(
            input.prompt,
            input.style,
            input.width,
            input.height,
            input.provider
          );
          if (cached) {
            return {
              success: true,
              ...cached,
              fromCache: true,
            };
          }
        }

        const options: ImageGenerationOptions = {
          prompt: input.prompt,
          style: input.style,
          provider: input.provider as AIProvider,
          width: input.width,
          height: input.height,
          quality: input.quality,
          negativePrompt: input.negativePrompt,
        };

        const result = await generateImageWithAI(options);

        // Armazenar em cache se sucesso
        if (result && input.useCache) {
          cacheImageResult(
            input.prompt,
            input.style,
            input.width,
            input.height,
            input.provider,
            result,
            3600 // 1 hora de TTL
          );
        }

        return {
          success: true,
          ...result,
          fromCache: false,
        };
      } catch (error) {
        console.error("Image generation error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao gerar imagem",
        };
      }
    }),

  /**
   * Gerar vídeo com IA
   */
  generateVideo: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(10),
        duration: z.enum(["15", "30", "60"]).default("15"),
        style: z
          .enum([
            "moderno",
            "minimalista",
            "cinematico",
            "animado",
            "corporativo",
          ])
          .default("moderno"),
        provider: z
          .enum(["replicate", "huggingface", "did", "runway", "auto"])
          .default("auto"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const options: VideoGenerationOptions = {
          prompt: input.prompt,
          duration: parseInt(input.duration),
          style: input.style,
          provider: input.provider as VideoProvider,
        };

        const result = await generateVideoWithAI(options);

        return {
          success: true,
          ...result,
        };
      } catch (error) {
        console.error("Video generation error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao gerar vídeo",
          status: "failed",
        };
      }
    }),

  /**
   * Obter provedores de imagem disponíveis
   */
  getAvailableImageProviders: publicProcedure.query(() => {
    return getAvailableProviders();
  }),

  /**
   * Obter provedores de vídeo disponíveis
   */
  getAvailableVideoProviders: publicProcedure.query(() => {
    return getAvailableVideoProviders();
  }),

  /**
   * Obter estatísticas do cache
   */
  getCacheStats: publicProcedure.query(() => {
    return imageCache.getStats();
  }),

  /**
   * Limpar cache
   */
  clearCache: publicProcedure.mutation(() => {
    imageCache.clear();
    return { success: true, message: "Cache limpo com sucesso" };
  }),

  /**
   * Gerar múltiplas variações de imagem
   */
  generateImageVariations: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(10),
        count: z.number().min(1).max(5).default(3),
        style: z.string().default("moderno"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const results = await Promise.allSettled(
          Array.from({ length: input.count }).map(() =>
            generateImageWithAI({
              prompt: input.prompt,
              style: input.style,
              provider: "auto",
            })
          )
        );

        const images = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => (r as PromiseFulfilledResult<any>).value);

        return {
          success: images.length > 0,
          images,
          count: images.length,
          failed: input.count - images.length,
        };
      } catch (error) {
        console.error("Image variations error:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Erro ao gerar variações",
          images: [],
          count: 0,
          failed: input.count,
        };
      }
    }),

  /**
   * Gerar post para redes sociais
   */
  generateSocialPost: publicProcedure
    .input(
      z.object({
        topic: z.string().min(5),
        platform: z.enum([
          "instagram",
          "facebook",
          "twitter",
          "linkedin",
          "tiktok",
        ]),
        style: z.string().default("moderno"),
        includeImage: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const imagePrompt = `${input.topic}, estilo ${input.style}, alta qualidade, profissional, para ${input.platform}`;

        let imageResult = null;
        if (input.includeImage) {
          imageResult = await generateImageWithAI({
            prompt: imagePrompt,
            style: input.style,
            provider: "auto",
          });
        }

        const copy = `Confira nosso novo conteúdo sobre ${input.topic}! 🚀 #${input.topic.replace(/\s+/g, "")}`;

        return {
          success: true,
          image: imageResult,
          copy,
          platform: input.platform,
          topic: input.topic,
        };
      } catch (error) {
        console.error("Social post generation error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao gerar post",
        };
      }
    }),

  /**
   * Gerar mockup de produto
   */
  generateProductMockup: publicProcedure
    .input(
      z.object({
        productName: z.string().min(3),
        productDescription: z.string().min(10),
        style: z.string().default("moderno"),
        background: z
          .enum(["branco", "preto", "gradiente", "natural"])
          .default("branco"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `Mockup profissional do produto "${input.productName}": ${input.productDescription}. Estilo ${input.style}, fundo ${input.background}, iluminação profissional, alta qualidade, 4K.`;

        const result = await generateImageWithAI({
          prompt,
          style: input.style,
          provider: "auto",
          width: 1024,
          height: 1024,
          quality: "ultra",
        });

        return {
          success: true,
          ...result,
          productName: input.productName,
        };
      } catch (error) {
        console.error("Product mockup error:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Erro ao gerar mockup",
        };
      }
    }),

  /**
   * Gerar thumbnail para vídeo
   */
  generateVideoThumbnail: publicProcedure
    .input(
      z.object({
        videoTitle: z.string().min(5),
        style: z.string().default("moderno"),
        mainColor: z.string().default("#FF0000"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const prompt = `Thumbnail profissional para vídeo: "${input.videoTitle}". Estilo ${input.style}, cor principal ${input.mainColor}, texto legível, alta qualidade, 1280x720px.`;

        const result = await generateImageWithAI({
          prompt,
          style: input.style,
          provider: "auto",
          width: 1280,
          height: 720,
          quality: "high",
        });

        return {
          success: true,
          ...result,
          videoTitle: input.videoTitle,
        };
      } catch (error) {
        console.error("Thumbnail generation error:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Erro ao gerar thumbnail",
        };
      }
    }),
});
