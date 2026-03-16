/**
 * tRPC Router - Scheduler
 * Endpoints para agendar publicações em múltiplas plataformas
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createScheduledPost,
  publishToMultiplePlatforms,
  getScheduledPosts,
  getUpcomingPosts,
  cancelScheduledPost,
  editScheduledPost,
  getScheduledPostsStats,
  validateScheduleTime,
} from "../_core/scheduler";

export const schedulerRouter = router({
  /**
   * Criar post agendado
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        platforms: z.array(
          z.enum(["shopee", "mercadolivre", "amazon", "instagram", "facebook", "tiktok"])
        ),
        scheduledAt: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const scheduledAt = new Date(input.scheduledAt);

        // Validar horário
        const validation = validateScheduleTime(scheduledAt);
        if (!validation.valid) {
          return {
            success: false,
            error: validation.error,
          };
        }

        // Criar post agendado
        const post = await createScheduledPost(
          ctx.user.id,
          input.title,
          input.content,
          input.platforms,
          scheduledAt
        );

        return {
          success: true,
          data: post,
          message: `Post agendado para ${scheduledAt.toLocaleString()}`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao criar post agendado",
        };
      }
    }),

  /**
   * Listar posts agendados
   */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "scheduled", "publishing", "published", "failed"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const posts = await getScheduledPosts(ctx.user.id, input.status);

        return {
          success: true,
          data: posts.slice(input.offset, input.offset + input.limit),
          total: posts.length,
          hasMore: input.offset + input.limit < posts.length,
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          total: 0,
          hasMore: false,
          error: error instanceof Error ? error.message : "Erro ao listar posts",
        };
      }
    }),

  /**
   * Obter próximos posts a publicar
   */
  getUpcoming: protectedProcedure
    .input(z.object({ hoursAhead: z.number().default(24) }))
    .query(async ({ ctx, input }) => {
      try {
        const posts = await getUpcomingPosts(ctx.user.id, input.hoursAhead);

        return {
          success: true,
          data: posts,
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          error: error instanceof Error ? error.message : "Erro ao obter próximos posts",
        };
      }
    }),

  /**
   * Cancelar post agendado
   */
  cancel: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const cancelled = await cancelScheduledPost(input.postId);

        return {
          success: cancelled,
          message: cancelled ? "Post cancelado com sucesso" : "Erro ao cancelar post",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao cancelar post",
        };
      }
    }),

  /**
   * Editar post agendado
   */
  edit: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        platforms: z.array(z.string()).optional(),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const updates: any = {};

        if (input.title) updates.title = input.title;
        if (input.content) updates.content = input.content;
        if (input.platforms) updates.platforms = input.platforms;
        if (input.scheduledAt) {
          const newDate = new Date(input.scheduledAt);
          const validation = validateScheduleTime(newDate);
          if (!validation.valid) {
            return {
              success: false,
              error: validation.error,
            };
          }
          updates.scheduledAt = newDate;
        }

        const post = await editScheduledPost(input.postId, updates);

        return {
          success: post !== null,
          data: post,
          message: post ? "Post atualizado com sucesso" : "Post não encontrado",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao editar post",
        };
      }
    }),

  /**
   * Publicar post imediatamente
   */
  publishNow: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        platforms: z.array(
          z.enum(["shopee", "mercadolivre", "amazon", "instagram", "facebook", "tiktok"])
        ),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const result = await publishToMultiplePlatforms(input.title, input.content, input.platforms);

        return {
          success: result.success,
          data: result.results,
          message: result.success ? "Post publicado em todas as plataformas" : "Alguns erros ocorreram",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao publicar",
        };
      }
    }),

  /**
   * Obter estatísticas de posts agendados
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getScheduledPostsStats(ctx.user.id);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter estatísticas",
      };
    }
  }),

  /**
   * Obter preview de post
   */
  getPreview: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        platform: z.enum(["shopee", "mercadolivre", "amazon", "instagram", "facebook", "tiktok"]),
      })
    )
    .query(async ({ input }) => {
      try {
        // Simular preview
        const previews: Record<string, any> = {
          shopee: {
            title: input.title,
            description: input.content.substring(0, 100),
            characterCount: input.content.length,
          },
          mercadolivre: {
            title: input.title,
            description: input.content.substring(0, 150),
            characterCount: input.content.length,
          },
          instagram: {
            caption: input.content.substring(0, 2200),
            characterCount: input.content.length,
            hashtags: input.content.match(/#\w+/g) || [],
          },
          facebook: {
            title: input.title,
            description: input.content.substring(0, 500),
            characterCount: input.content.length,
          },
          tiktok: {
            description: input.content.substring(0, 2200),
            characterCount: input.content.length,
            hashtags: input.content.match(/#\w+/g) || [],
          },
          amazon: {
            title: input.title,
            description: input.content.substring(0, 2000),
            characterCount: input.content.length,
          },
        };

        return {
          success: true,
          data: previews[input.platform] || {},
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter preview",
        };
      }
    }),
});
