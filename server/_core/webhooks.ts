/**
 * Webhook Service - Handle platform webhooks (Shopee, Mercado Livre, Amazon)
 */

import { randomBytes } from "crypto";
import crypto from "crypto";

export interface WebhookEvent {
  id: string;
  userId: number;
  platform: "shopee" | "mercadolivre" | "amazon";
  eventType: string;
  payload: Record<string, any>;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
  processedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Gerar ID único para webhook
 */
export function generateWebhookId(): string {
  return `WH-${Date.now()}-${randomBytes(4).toString("hex")}`;
}

/**
 * Verificar assinatura de webhook (HMAC-SHA256)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return hash === signature;
  } catch (error) {
    console.error("[Webhook] Signature verification failed:", error);
    return false;
  }
}

/**
 * Processar webhook de Shopee
 */
export async function processShopeeWebhook(
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  try {
    const { event, data } = payload;

    switch (event) {
      case "order_create":
        // Novo pedido criado
        return {
          success: true,
          message: `Novo pedido Shopee: ${data.order_id}`,
        };

      case "order_status_update":
        // Status do pedido alterado
        return {
          success: true,
          message: `Pedido Shopee ${data.order_id} atualizado para ${data.status}`,
        };

      case "inventory_update":
        // Estoque atualizado
        return {
          success: true,
          message: `Estoque Shopee atualizado: ${data.item_id}`,
        };

      default:
        return {
          success: false,
          message: `Evento Shopee desconhecido: ${event}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar webhook Shopee",
    };
  }
}

/**
 * Processar webhook de Mercado Livre
 */
export async function processMercadoLivreWebhook(
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  try {
    const { resource, action } = payload;

    if (resource.startsWith("orders")) {
      switch (action) {
        case "created":
          return {
            success: true,
            message: `Novo pedido Mercado Livre: ${resource}`,
          };

        case "updated":
          return {
            success: true,
            message: `Pedido Mercado Livre atualizado: ${resource}`,
          };

        default:
          return {
            success: true,
            message: `Ação Mercado Livre: ${action}`,
          };
      }
    }

    if (resource.startsWith("items")) {
      return {
        success: true,
        message: `Item Mercado Livre atualizado: ${resource}`,
      };
    }

    return {
      success: false,
      message: `Recurso desconhecido: ${resource}`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar webhook Mercado Livre",
    };
  }
}

/**
 * Processar webhook de Amazon
 */
export async function processAmazonWebhook(
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  try {
    const { notificationType, payload: amazonPayload } = payload;

    switch (notificationType) {
      case "ORDER_CHANGE":
        return {
          success: true,
          message: `Pedido Amazon alterado: ${amazonPayload.orderId}`,
        };

      case "INVENTORY_CHANGE":
        return {
          success: true,
          message: `Estoque Amazon atualizado: ${amazonPayload.sku}`,
        };

      case "FULFILLMENT_DATA_UPDATE":
        return {
          success: true,
          message: `Dados de fulfillment Amazon atualizados`,
        };

      default:
        return {
          success: false,
          message: `Notificação Amazon desconhecida: ${notificationType}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao processar webhook Amazon",
    };
  }
}

/**
 * Processar webhook baseado na plataforma
 */
export async function processWebhook(
  platform: "shopee" | "mercadolivre" | "amazon",
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  switch (platform) {
    case "shopee":
      return processShopeeWebhook(payload);
    case "mercadolivre":
      return processMercadoLivreWebhook(payload);
    case "amazon":
      return processAmazonWebhook(payload);
    default:
      return {
        success: false,
        message: `Plataforma desconhecida: ${platform}`,
      };
  }
}

/**
 * Calcular próximo tempo de retry (exponential backoff)
 */
export function getNextRetryTime(retryCount: number): Date {
  const baseDelay = 5 * 60 * 1000; // 5 minutos
  const delayMs = baseDelay * Math.pow(2, retryCount); // exponential backoff

  return new Date(Date.now() + delayMs);
}

/**
 * Validar payload de webhook
 */
export function validateWebhookPayload(
  platform: string,
  payload: any
): { valid: boolean; error?: string } {
  if (!payload) {
    return { valid: false, error: "Payload vazio" };
  }

  if (typeof payload !== "object") {
    return { valid: false, error: "Payload deve ser um objeto" };
  }

  switch (platform) {
    case "shopee":
      if (!payload.event || !payload.data) {
        return { valid: false, error: "Webhook Shopee deve ter 'event' e 'data'" };
      }
      break;

    case "mercadolivre":
      if (!payload.resource || !payload.action) {
        return { valid: false, error: "Webhook Mercado Livre deve ter 'resource' e 'action'" };
      }
      break;

    case "amazon":
      if (!payload.notificationType || !payload.payload) {
        return {
          valid: false,
          error: "Webhook Amazon deve ter 'notificationType' e 'payload'",
        };
      }
      break;

    default:
      return { valid: false, error: `Plataforma desconhecida: ${platform}` };
  }

  return { valid: true };
}
