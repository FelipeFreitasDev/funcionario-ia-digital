/**
 * Push Notifications Service
 * Gerencia notificações push para desktop e mobile
 */

export interface PushSubscription {
  userId: number;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt: Date;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

export interface PushNotificationEvent {
  type: "new_order" | "publication_completed" | "low_inventory" | "sync_error" | "recommendation" | "task_completed";
  title: string;
  body: string;
  data?: Record<string, any>;
}

/**
 * Converter evento para notificação push
 */
export function eventToNotification(event: PushNotificationEvent): PushNotification {
  const icons: Record<string, string> = {
    new_order: "🛒",
    publication_completed: "✅",
    low_inventory: "⚠️",
    sync_error: "❌",
    recommendation: "💡",
    task_completed: "🎉",
  };

  return {
    title: event.title,
    body: event.body,
    icon: icons[event.type],
    tag: event.type,
    data: {
      type: event.type,
      ...event.data,
    },
  };
}

/**
 * Criar notificações padrão
 */
export const NotificationTemplates = {
  newOrder: (orderNumber: string, amount: number): PushNotificationEvent => ({
    type: "new_order",
    title: "Novo Pedido Recebido",
    body: `Pedido #${orderNumber} - R$ ${amount.toLocaleString("pt-BR")}`,
    data: { orderNumber, amount },
  }),

  publicationCompleted: (platform: string, productName: string): PushNotificationEvent => ({
    type: "publication_completed",
    title: "Publicação Concluída",
    body: `${productName} foi publicado em ${platform}`,
    data: { platform, productName },
  }),

  lowInventory: (productName: string, quantity: number): PushNotificationEvent => ({
    type: "low_inventory",
    title: "Estoque Baixo",
    body: `${productName} tem apenas ${quantity} unidades`,
    data: { productName, quantity },
  }),

  syncError: (platform: string, error: string): PushNotificationEvent => ({
    type: "sync_error",
    title: "Erro de Sincronização",
    body: `Falha ao sincronizar com ${platform}: ${error}`,
    data: { platform, error },
  }),

  recommendation: (title: string, description: string): PushNotificationEvent => ({
    type: "recommendation",
    title,
    body: description,
  }),

  taskCompleted: (taskName: string): PushNotificationEvent => ({
    type: "task_completed",
    title: "Tarefa Concluída",
    body: `${taskName} foi executada com sucesso`,
    data: { taskName },
  }),
};

/**
 * Gerenciador de inscrições de push
 */
export class PushNotificationManager {
  private subscriptions: Map<number, PushSubscription[]> = new Map();

  /**
   * Adicionar inscrição
   */
  subscribe(userId: number, subscription: Omit<PushSubscription, "userId" | "createdAt">) {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, []);
    }

    const newSubscription: PushSubscription = {
      userId,
      ...subscription,
      createdAt: new Date(),
    };

    this.subscriptions.get(userId)!.push(newSubscription);
    console.log(`[Push] Usuário ${userId} inscrito para notificações`);
  }

  /**
   * Remover inscrição
   */
  unsubscribe(userId: number, endpoint: string) {
    const subs = this.subscriptions.get(userId);
    if (subs) {
      const index = subs.findIndex((s) => s.endpoint === endpoint);
      if (index > -1) {
        subs.splice(index, 1);
        console.log(`[Push] Usuário ${userId} desinscritos`);
      }
    }
  }

  /**
   * Obter inscrições de um usuário
   */
  getSubscriptions(userId: number): PushSubscription[] {
    return this.subscriptions.get(userId) || [];
  }

  /**
   * Enviar notificação para um usuário
   */
  async sendToUser(userId: number, notification: PushNotification) {
    const subscriptions = this.getSubscriptions(userId);

    if (subscriptions.length === 0) {
      console.log(`[Push] Nenhuma inscrição encontrada para usuário ${userId}`);
      return;
    }

    const promises = subscriptions.map((sub) =>
      this.sendToSubscription(sub, notification)
    );

    const results = await Promise.allSettled(promises);
    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      console.warn(`[Push] ${failed.length} notificações falharam`);
    }

    return results;
  }

  /**
   * Enviar notificação para uma inscrição específica
   */
  private async sendToSubscription(
    subscription: PushSubscription,
    notification: PushNotification
  ): Promise<void> {
    try {
      // Aqui você usaria web-push para enviar a notificação
      // const webpush = require("web-push");
      // await webpush.sendNotification(
      //   {
      //     endpoint: subscription.endpoint,
      //     keys: {
      //       p256dh: subscription.p256dh,
      //       auth: subscription.auth,
      //     },
      //   },
      //   JSON.stringify(notification)
      // );

      console.log(`[Push] Notificação enviada para ${subscription.endpoint}`);
    } catch (error) {
      console.error("[Push] Erro ao enviar notificação:", error);
      throw error;
    }
  }

  /**
   * Enviar notificação para todos os usuários
   */
  async broadcastNotification(notification: PushNotification) {
    const allSubscriptions = Array.from(this.subscriptions.values()).flat();

    const promises = allSubscriptions.map((sub) =>
      this.sendToSubscription(sub, notification)
    );

    return Promise.allSettled(promises);
  }

  /**
   * Limpar inscrições expiradas
   */
  cleanupExpiredSubscriptions() {
    let removed = 0;
    this.subscriptions.forEach((subs: PushSubscription[], userId: number) => {
      const before = subs.length;
      // Remover inscrições com mais de 90 dias
      this.subscriptions.set(
        userId,
        subs.filter((s: PushSubscription) => {
          const age = Date.now() - s.createdAt.getTime();
          return age < 90 * 24 * 60 * 60 * 1000;
        })
      );
      removed += before - (this.subscriptions.get(userId)?.length || 0);
    });
    console.log(`[Push] ${removed} inscrições expiradas removidas`);
  }

  /**
   * Obter estatísticas
   */
  getStats() {
    let totalSubscriptions = 0;
    let totalUsers = 0;

    this.subscriptions.forEach((subs: PushSubscription[]) => {
      totalUsers++;
      totalSubscriptions += subs.length;
    });

    return {
      totalUsers,
      totalSubscriptions,
      averagePerUser: totalUsers > 0 ? totalSubscriptions / totalUsers : 0,
    };
  }
}

// Instância global
export const pushNotificationManager = new PushNotificationManager();
