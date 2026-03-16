/**
 * tRPC Router - Push Notifications
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { pushNotificationManager, NotificationTemplates, eventToNotification } from "../_core/pushNotifications";

export const pushNotificationsRouter = router({
  /**
   * Inscrever para notificações push
   */
  subscribe: protectedProcedure
    .input(
      z.object({
        endpoint: z.string(),
        p256dh: z.string(),
        auth: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        pushNotificationManager.subscribe(ctx.user.id, {
          endpoint: input.endpoint,
          p256dh: input.p256dh,
          auth: input.auth,
        });

        return {
          success: true,
          message: "Inscrito para notificações push",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao inscrever",
        };
      }
    }),

  /**
   * Desinscrever de notificações push
   */
  unsubscribe: protectedProcedure
    .input(z.object({ endpoint: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        pushNotificationManager.unsubscribe(ctx.user.id, input.endpoint);

        return {
          success: true,
          message: "Desinscrito de notificações push",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao desinscrever",
        };
      }
    }),

  /**
   * Obter inscrições do usuário
   */
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const subscriptions = pushNotificationManager.getSubscriptions(ctx.user.id);

      return {
        success: true,
        data: subscriptions.map((s) => ({
          endpoint: s.endpoint,
          createdAt: s.createdAt,
        })),
        count: subscriptions.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter inscrições",
      };
    }
  }),

  /**
   * Enviar notificação de teste
   */
  sendTestNotification: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const notification = eventToNotification(
        NotificationTemplates.recommendation(
          "Teste de Notificação",
          "Esta é uma notificação de teste do sistema"
        )
      );

      await pushNotificationManager.sendToUser(ctx.user.id, notification);

      return {
        success: true,
        message: "Notificação de teste enviada",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao enviar notificação",
      };
    }
  }),

  /**
   * Enviar notificação de novo pedido
   */
  sendNewOrderNotification: protectedProcedure
    .input(
      z.object({
        orderNumber: z.string(),
        amount: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const notification = eventToNotification(
          NotificationTemplates.newOrder(input.orderNumber, input.amount)
        );

        await pushNotificationManager.sendToUser(ctx.user.id, notification);

        return {
          success: true,
          message: "Notificação de novo pedido enviada",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao enviar notificação",
        };
      }
    }),

  /**
   * Enviar notificação de publicação concluída
   */
  sendPublicationNotification: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        productName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const notification = eventToNotification(
          NotificationTemplates.publicationCompleted(input.platform, input.productName)
        );

        await pushNotificationManager.sendToUser(ctx.user.id, notification);

        return {
          success: true,
          message: "Notificação de publicação enviada",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao enviar notificação",
        };
      }
    }),

  /**
   * Enviar notificação de estoque baixo
   */
  sendLowInventoryNotification: protectedProcedure
    .input(
      z.object({
        productName: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const notification = eventToNotification(
          NotificationTemplates.lowInventory(input.productName, input.quantity)
        );

        await pushNotificationManager.sendToUser(ctx.user.id, notification);

        return {
          success: true,
          message: "Notificação de estoque baixo enviada",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao enviar notificação",
        };
      }
    }),

  /**
   * Obter estatísticas de push
   */
  getStats: protectedProcedure.query(async () => {
    try {
      const stats = pushNotificationManager.getStats();

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
   * Limpar inscrições expiradas
   */
  cleanupExpired: protectedProcedure.mutation(async () => {
    try {
      pushNotificationManager.cleanupExpiredSubscriptions();

      return {
        success: true,
        message: "Inscrições expiradas removidas",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao limpar inscrições",
      };
    }
  }),
});
