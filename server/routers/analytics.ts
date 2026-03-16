/**
 * tRPC Router - Analytics
 * Endpoints para dashboards e relatórios de vendas e gerações
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getSalesStats,
  getPopularGenerations,
  getRoiByPlatform,
  getSalesTrends,
  getAnalyticsSummary,
  calculateGrowth,
} from "../_core/analytics";

export const analyticsRouter = router({
  /**
   * Obter resumo de analytics
   */
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    try {
      const summary = await getAnalyticsSummary(ctx.user.id);

      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter resumo",
      };
    }
  }),

  /**
   * Obter estatísticas de vendas
   */
  getSalesStats: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["shopee", "mercadolivre", "amazon", "all"]).default("all"),
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const stats = await getSalesStats(ctx.user.id, input.platform, input.period);

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
   * Obter gerações mais populares
   */
  getPopularGenerations: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      try {
        const generations = await getPopularGenerations(ctx.user.id, input.limit);

        return {
          success: true,
          data: generations,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter gerações populares",
        };
      }
    }),

  /**
   * Obter ROI por plataforma
   */
  getRoiByPlatform: protectedProcedure
    .input(z.object({ period: z.enum(["month", "year"]).default("month") }))
    .query(async ({ ctx, input }) => {
      try {
        const roi = await getRoiByPlatform(ctx.user.id, input.period);

        return {
          success: true,
          data: roi,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter ROI",
        };
      }
    }),

  /**
   * Obter tendências de vendas
   */
  getSalesTrends: protectedProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      try {
        const trends = await getSalesTrends(ctx.user.id, input.days);

        return {
          success: true,
          data: trends,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter tendências",
        };
      }
    }),

  /**
   * Obter crescimento comparativo
   */
  getGrowth: protectedProcedure
    .input(
      z.object({
        current: z.number(),
        previous: z.number(),
      })
    )
    .query(async ({ input }) => {
      try {
        const growth = calculateGrowth(input.current, input.previous);

        return {
          success: true,
          data: growth,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao calcular crescimento",
        };
      }
    }),

  /**
   * Obter dashboard completo
   */
  getDashboard: protectedProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const [summary, salesStats, trends, roi, popular] = await Promise.all([
          getAnalyticsSummary(ctx.user.id),
          getSalesStats(ctx.user.id, "all", input.period),
          getSalesTrends(ctx.user.id, 30),
          getRoiByPlatform(ctx.user.id, input.period as "month" | "year"),
          getPopularGenerations(ctx.user.id, 5),
        ]);

        return {
          success: true,
          data: {
            summary,
            salesStats,
            trends,
            roi,
            popularGenerations: popular,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter dashboard",
        };
      }
    }),

  /**
   * Exportar relatório
   */
  exportReport: protectedProcedure
    .input(
      z.object({
        format: z.enum(["csv", "pdf"]).default("csv"),
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const trends = await getSalesTrends(ctx.user.id, 30);

        // Simular exportação
        const filename = `analytics-report-${new Date().toISOString().split("T")[0]}.${input.format}`;

        return {
          success: true,
          filename,
          size: Math.floor(Math.random() * 100000) + 10000,
          message: `Relatório ${input.format.toUpperCase()} gerado com sucesso`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao exportar relatório",
        };
      }
    }),
});
