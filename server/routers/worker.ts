/**
 * tRPC Router - Worker Management
 * Endpoints para gerenciar o worker autônomo 24h
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { autonomousWorker } from "../_core/worker";

export const workerRouter = router({
  /**
   * Iniciar worker
   */
  start: protectedProcedure.mutation(async () => {
    try {
      autonomousWorker.start();
      return {
        success: true,
        message: "Worker iniciado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao iniciar worker",
      };
    }
  }),

  /**
   * Parar worker
   */
  stop: protectedProcedure.mutation(async () => {
    try {
      autonomousWorker.stop();
      return {
        success: true,
        message: "Worker parado com sucesso",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao parar worker",
      };
    }
  }),

  /**
   * Obter status do worker
   */
  getStatus: protectedProcedure.query(async () => {
    try {
      const status = autonomousWorker.getStatus();
      return {
        success: true,
        data: status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter status",
      };
    }
  }),

  /**
   * Executar tarefa manualmente
   */
  executeTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await autonomousWorker.executeTaskNow(input.taskId);
        return {
          success: true,
          message: "Tarefa executada com sucesso",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao executar tarefa",
        };
      }
    }),

  /**
   * Obter recomendações não lidas
   */
  getRecommendations: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      try {
        const recommendations = autonomousWorker.getRecommendations(input.limit);
        return {
          success: true,
          data: recommendations,
          count: recommendations.length,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter recomendações",
        };
      }
    }),

  /**
   * Descartar recomendação
   */
  dismissRecommendation: protectedProcedure
    .input(z.object({ recommendationId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        autonomousWorker.dismissRecommendation(input.recommendationId);
        return {
          success: true,
          message: "Recomendação descartada",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao descartar recomendação",
        };
      }
    }),

  /**
   * Obter histórico de recomendações
   */
  getRecommendationHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ input }) => {
      try {
        const history = autonomousWorker.getRecommendationHistory(input.limit);
        return {
          success: true,
          data: history,
          count: history.length,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter histórico",
        };
      }
    }),

  /**
   * Limpar recomendações antigas
   */
  clearOldRecommendations: protectedProcedure
    .input(z.object({ hoursOld: z.number().default(24) }))
    .mutation(async ({ input }) => {
      try {
        autonomousWorker.clearOldRecommendations(input.hoursOld);
        return {
          success: true,
          message: `Recomendações com mais de ${input.hoursOld} horas removidas`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao limpar recomendações",
        };
      }
    }),

  /**
   * Obter estatísticas do worker
   */
  getStats: protectedProcedure.query(async () => {
    try {
      const status = autonomousWorker.getStatus();
      const recommendations = autonomousWorker.getRecommendations(100);

      return {
        success: true,
        data: {
          isRunning: status.isRunning,
          taskCount: status.taskCount,
          totalRecommendations: status.recommendationCount,
          unreadRecommendations: recommendations.length,
          highPriorityRecommendations: recommendations.filter((r) => r.priority === "high").length,
          uptime: status.isRunning ? "24h" : "parado",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter estatísticas",
      };
    }
  }),

  /**
   * Obter detalhes de uma tarefa
   */
  getTaskDetails: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ input }) => {
      try {
        const status = autonomousWorker.getStatus();
        const task = status.tasks.find((t) => t.id === input.taskId);

        if (!task) {
          return {
            success: false,
            error: "Tarefa não encontrada",
          };
        }

        return {
          success: true,
          data: task,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao obter detalhes da tarefa",
        };
      }
    }),
});
