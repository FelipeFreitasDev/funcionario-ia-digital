import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createGeneration,
  getGenerationById,
  getUserGenerations,
  updateGenerationStatus,
  deleteGeneration,
  getUserGenerationStats,
  getPopularStyles,
} from "../db-generations";

/**
 * Generations Router - Gerenciar histórico de gerações de IA
 */
export const generationsRouter = router({
  /**
   * Criar nova geração
   */
  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["image", "video"]),
        prompt: z.string().min(10),
        style: z.string(),
        provider: z.string(),
        quality: z.string().optional(),
        duration: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        url: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        fromCache: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const id = await createGeneration({
          userId: ctx.user.id,
          type: input.type,
          prompt: input.prompt,
          style: input.style,
          provider: input.provider,
          quality: input.quality,
          duration: input.duration,
          width: input.width,
          height: input.height,
          url: input.url,
          thumbnailUrl: input.thumbnailUrl,
          fromCache: input.fromCache,
        });

        return {
          success: true,
          id,
        };
      } catch (error) {
        console.error("Error creating generation:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao criar geração",
        };
      }
    }),

  /**
   * Obter geração por ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const generation = await getGenerationById(input.id);
        return {
          success: !!generation,
          data: generation,
        };
      } catch (error) {
        console.error("Error getting generation:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter geração",
        };
      }
    }),

  /**
   * Listar gerações do usuário
   */
  list: protectedProcedure
    .input(
      z.object({
        type: z.enum(["image", "video"]).optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const generations = await getUserGenerations(ctx.user.id, {
          type: input.type,
          limit: input.limit,
          offset: input.offset,
        });

        return {
          success: true,
          data: generations,
          count: generations.length,
        };
      } catch (error) {
        console.error("Error listing generations:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao listar gerações",
          data: [],
          count: 0,
        };
      }
    }),

  /**
   * Atualizar status de geração
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["pending", "processing", "completed", "failed"]),
        url: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        error: z.string().optional(),
        processingTime: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await updateGenerationStatus(input.id, input.status, {
          url: input.url,
          thumbnailUrl: input.thumbnailUrl,
          error: input.error,
          processingTime: input.processingTime,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error updating generation status:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao atualizar status",
        };
      }
    }),

  /**
   * Deletar geração
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await deleteGeneration(input.id);
        return {
          success: true,
        };
      } catch (error) {
        console.error("Error deleting generation:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao deletar geração",
        };
      }
    }),

  /**
   * Obter estatísticas do usuário
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getUserGenerationStats(ctx.user.id);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("Error getting generation stats:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter estatísticas",
        data: null,
      };
    }
  }),

  /**
   * Obter estilos populares
   */
  getPopularStyles: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      try {
        const styles = await getPopularStyles(ctx.user.id, input.limit);
        return {
          success: true,
          data: styles,
        };
      } catch (error) {
        console.error("Error getting popular styles:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter estilos",
          data: [],
        };
      }
    }),
});
