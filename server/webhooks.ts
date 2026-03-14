import express, { Router, Request, Response } from "express";
import { validateKiwifyWebhook, processKiwifyWebhook } from "./_core/kiwifyWebhook";
import { sendPurchaseConfirmationEmail, sendPaymentFailedEmail, sendOwnerNotificationEmail } from "./_core/email";
import {
  createPurchase,
  getPurchaseByTransactionId,
  updatePurchaseStatus,
} from "./db";
import { nanoid } from "nanoid";

const router = Router();

/**
 * Middleware para parsear JSON
 */
router.use(express.json());

/**
 * Webhook da Kiwify
 * POST /api/webhooks/kiwify
 *
 * Recebe notificações de pagamento da Kiwify e processa automaticamente
 */
router.post("/kiwify", async (req: Request, res: Response) => {
  try {
    // Obter assinatura do header
    const signature = req.headers["x-kiwify-signature"] as string;
    const kiwifySecret = process.env.KIWIFY_WEBHOOK_SECRET;

    if (!kiwifySecret) {
      console.warn("[Webhook] KIWIFY_WEBHOOK_SECRET não configurado");
      return res.status(500).json({ error: "Webhook secret não configurado" });
    }

    if (!signature) {
      console.warn("[Webhook] Assinatura Kiwify não fornecida");
      return res.status(401).json({ error: "Assinatura inválida" });
    }

    // Validar assinatura
    const rawBody = JSON.stringify(req.body);
    const isValid = validateKiwifyWebhook(rawBody, signature, kiwifySecret);

    if (!isValid) {
      console.warn("[Webhook] Assinatura Kiwify inválida");
      return res.status(401).json({ error: "Assinatura inválida" });
    }

    // Processar payload
    const webhookData = processKiwifyWebhook(req.body);

    console.log("[Webhook] Processando pagamento:", {
      transactionId: webhookData.transactionId,
      status: webhookData.status,
      email: webhookData.email,
    });

    // Verificar se compra já existe
    let purchase = await getPurchaseByTransactionId(webhookData.transactionId);

    if (purchase) {
      // Atualizar status de compra existente
      console.log("[Webhook] Atualizando compra existente:", purchase.id);
      purchase = await updatePurchaseStatus(purchase.id, webhookData.status);
    } else {
      // Criar nova compra
      const purchaseId = `PURCHASE-${Date.now()}-${nanoid(9).toUpperCase()}`;
      const downloadToken = nanoid(32);

      console.log("[Webhook] Criando nova compra:", purchaseId);

      purchase = await createPurchase({
        id: purchaseId,
        transactionId: webhookData.transactionId,
        email: webhookData.email,
        name: webhookData.name,
        amount: webhookData.amount,
        currency: webhookData.currency,
        status: webhookData.status,
        kiwifyOrderId: webhookData.orderId,
        paymentMethod: webhookData.paymentMethod,
        downloadToken,
        downloadCount: 0,
        expiresAt:
          webhookData.status === "approved"
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
            : null,
      });
    }

    if (!purchase) {
      console.error("[Webhook] Erro ao processar compra");
      return res.status(500).json({ error: "Erro ao processar compra" });
    }

    // Enviar emails baseado no status
    if (purchase.status === "approved") {
      await sendPurchaseConfirmationEmail(
        purchase.email,
        purchase.name,
        purchase.downloadToken || "",
        purchase.amount
      );
    } else if (purchase.status === "failed") {
      await sendPaymentFailedEmail(
        purchase.email,
        purchase.name,
        "Houve um problema ao processar seu pagamento. Tente novamente."
      );
    }

    console.log("[Webhook] Compra processada com sucesso:", purchase.id);

    // Responder com sucesso (Kiwify requer 2xx)
    return res.status(200).json({
      success: true,
      purchaseId: purchase.id,
      message: "Webhook processado com sucesso",
    });
  } catch (error) {
    console.error("[Webhook] Erro ao processar webhook Kiwify:", error);

    // Sempre responder com 2xx para evitar retry loops
    // Mas logar o erro para investigação
    return res.status(200).json({
      success: false,
      error: "Erro ao processar webhook",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

/**
 * Health check para webhook
 * GET /api/webhooks/health
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Webhook de teste (para desenvolvimento)
 * POST /api/webhooks/test
 */
router.post("/test", async (req: Request, res: Response) => {
  try {
    const { email, name, amount, status } = req.body;

    if (!email || !name || !amount || !status) {
      return res.status(400).json({
        error: "Campos obrigatórios: email, name, amount, status",
      });
    }

    const purchaseId = `PURCHASE-${Date.now()}-${nanoid(9).toUpperCase()}`;
    const transactionId = `TEST-${nanoid(16)}`;
    const downloadToken = nanoid(32);

    const purchase = await createPurchase({
      id: purchaseId,
      transactionId,
      email,
      name,
      amount: Math.round(amount * 100), // Converter para centavos
      currency: "BRL",
      status: status as "approved" | "pending" | "failed" | "refunded",
      kiwifyOrderId: `TEST-ORDER-${nanoid(8)}`,
      paymentMethod: "test",
      downloadToken,
      downloadCount: 0,
      expiresAt:
        status === "approved"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null,
    });

    return res.status(200).json({
      success: true,
      purchase,
      downloadToken,
      message: "Compra de teste criada com sucesso",
    });
  } catch (error) {
    console.error("[Webhook Test] Erro:", error);
    return res.status(500).json({
      error: "Erro ao criar compra de teste",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
});

export default router;
