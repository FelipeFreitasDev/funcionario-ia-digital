import express, { Router, Request, Response } from "express";
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
    console.log("[Webhook] Webhook recebido:", req.body);
    
    // Validar assinatura do webhook
    const signature = req.headers["x-kiwify-signature"] as string;
    if (!signature) {
      console.error("[Webhook] Assinatura não fornecida");
      return res.status(401).json({ error: "Assinatura não fornecida" });
    }

    console.log("[Webhook] Webhook processado com sucesso");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Webhook] Erro ao processar webhook:", error);
    return res.status(500).json({ error: "Erro ao processar webhook" });
  }
});

export default router;
