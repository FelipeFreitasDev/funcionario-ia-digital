import crypto from "crypto";

/**
 * Validador de Webhook Kiwify
 * Verifica autenticidade da requisição usando HMAC-SHA256
 */

interface KiwifyWebhookPayload {
  id: string;
  status: "approved" | "pending" | "failed" | "refunded" | "chargeback";
  customer: {
    email: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  order: {
    id: string;
    total: number;
    currency: string;
  };
  payment: {
    method: string;
    transaction_id?: string;
  };
  [key: string]: unknown;
}

/**
 * Validar assinatura do webhook Kiwify
 * @param payload - Corpo da requisição
 * @param signature - Header X-Kiwify-Signature
 * @param secret - Secret da Kiwify (obtido no dashboard)
 * @returns true se a assinatura é válida
 */
export function validateKiwifyWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Gerar HMAC-SHA256 do payload com o secret
    const hash = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // Comparar com a assinatura fornecida
    // Usar comparação constante para evitar timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    );
  } catch (error) {
    console.error("[Kiwify] Erro ao validar webhook:", error);
    return false;
  }
}

/**
 * Processar evento de webhook Kiwify
 * @param payload - Dados do webhook
 * @returns Dados normalizados para processamento
 */
export function processKiwifyWebhook(
  payload: KiwifyWebhookPayload
): {
  transactionId: string;
  orderId: string;
  email: string;
  name: string;
  amount: number;
  currency: string;
  status: "approved" | "pending" | "failed" | "refunded";
  paymentMethod: string;
} {
  // Mapear status da Kiwify para nossos status
  const statusMap: Record<string, "approved" | "pending" | "failed" | "refunded"> = {
    approved: "approved",
    pending: "pending",
    failed: "failed",
    refunded: "refunded",
    chargeback: "failed",
  };

  return {
    transactionId: payload.payment.transaction_id || payload.id,
    orderId: payload.order.id,
    email: payload.customer.email,
    name: payload.customer.name,
    amount: Math.round(payload.order.total * 100), // Converter para centavos
    currency: payload.order.currency || "BRL",
    status: statusMap[payload.status] || "pending",
    paymentMethod: payload.payment.method,
  };
}

/**
 * Tipos de eventos suportados pela Kiwify
 */
export enum KiwifyEventType {
  ORDER_APPROVED = "order.approved",
  ORDER_PENDING = "order.pending",
  ORDER_FAILED = "order.failed",
  ORDER_REFUNDED = "order.refunded",
  ORDER_CHARGEBACK = "order.chargeback",
  SUBSCRIPTION_ACTIVATED = "subscription.activated",
  SUBSCRIPTION_CANCELLED = "subscription.cancelled",
  SUBSCRIPTION_RENEWED = "subscription.renewed",
}

/**
 * Verificar tipo de evento
 */
export function getEventType(payload: KiwifyWebhookPayload): KiwifyEventType | null {
  const eventMap: Record<string, KiwifyEventType> = {
    approved: KiwifyEventType.ORDER_APPROVED,
    pending: KiwifyEventType.ORDER_PENDING,
    failed: KiwifyEventType.ORDER_FAILED,
    refunded: KiwifyEventType.ORDER_REFUNDED,
    chargeback: KiwifyEventType.ORDER_CHARGEBACK,
  };

  return eventMap[payload.status] || null;
}
