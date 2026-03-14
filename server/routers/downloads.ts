import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import {
  createPurchase,
  getPurchaseByDownloadToken,
  incrementDownloadCount,
  getPurchaseByTransactionId,
  updatePurchaseStatus,
} from "../db";

/**
 * Router para gerenciar downloads do Funcionário Digital
 * Verifica pagamento antes de liberar acesso ao executável
 */
export const downloadsRouter = router({
  /**
   * Registrar compra após pagamento na Kiwify
   * Chamado pelo webhook ou após retorno da Kiwify
   */
  registerPurchase: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
        email: z.string().email(),
        name: z.string(),
        amount: z.number().int(), // em centavos
        kiwifyOrderId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verificar se compra já existe
        const existingPurchase = await getPurchaseByTransactionId(
          input.transactionId
        );
        if (existingPurchase) {
          return {
            success: true,
            downloadToken: existingPurchase.downloadToken,
            message: "Compra já registrada",
          };
        }

        // Gerar IDs únicos
        const purchaseId = `PURCHASE-${Date.now()}-${nanoid(9).toUpperCase()}`;
        const downloadToken = nanoid(32);

        // Criar registro de compra
        const purchase = await createPurchase({
          id: purchaseId,
          transactionId: input.transactionId,
          email: input.email,
          name: input.name,
          amount: input.amount,
          currency: "BRL",
          status: "approved",
          kiwifyOrderId: input.kiwifyOrderId,
          downloadToken,
          downloadCount: 0,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        });

        if (!purchase) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao registrar compra",
          });
        }

        // TODO: Enviar email com link de download
        // TODO: Enviar notificação ao proprietário

        return {
          success: true,
          downloadToken,
          message: "Compra registrada com sucesso",
        };
      } catch (error) {
        console.error("Erro ao registrar compra:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar compra",
        });
      }
    }),

  /**
   * Verificar se token de download é válido
   */
  verifyToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const purchase = await getPurchaseByDownloadToken(input.token);

        if (!purchase) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token inválido ou expirado",
          });
        }

        // Verificar se token expirou
        if (purchase.expiresAt && new Date() > purchase.expiresAt) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token expirado",
          });
        }

        // Verificar se compra foi aprovada
        if (purchase.status !== "approved") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Compra não foi aprovada",
          });
        }

        return {
          valid: true,
          email: purchase.email,
          name: purchase.name,
          downloadCount: purchase.downloadCount,
          expiresAt: purchase.expiresAt,
        };
      } catch (error) {
        console.error("Erro ao verificar token:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao verificar token",
        });
      }
    }),

  /**
   * Gerar URL de download do executável
   * Incrementa contador de downloads
   */
  generateDownloadUrl: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Verificar token
        const purchase = await getPurchaseByDownloadToken(input.token);

        if (!purchase) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Token inválido",
          });
        }

        // Verificar expiração
        if (purchase.expiresAt && new Date() > purchase.expiresAt) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Token expirado",
          });
        }

        // Verificar status da compra
        if (purchase.status !== "approved") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Compra não foi aprovada",
          });
        }

        // Incrementar contador de downloads
        await incrementDownloadCount(purchase.id);

        // TODO: Gerar URL de download com assinatura (S3 presigned URL)
        // Por enquanto, retornar URL de placeholder
        const downloadUrl =
          "https://d2xsxph8kpxj0f.cloudfront.net/funcionario-digital-executable.zip";

        return {
          success: true,
          downloadUrl,
          filename: "funcionario-digital-v1.0.0.zip",
          size: "2.5GB",
          message: "Link de download gerado com sucesso",
        };
      } catch (error) {
        console.error("Erro ao gerar URL de download:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao gerar link de download",
        });
      }
    }),

  /**
   * Obter informações de compra
   */
  getPurchaseInfo: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const purchase = await getPurchaseByDownloadToken(input.token);

        if (!purchase) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Compra não encontrada",
          });
        }

        return {
          id: purchase.id,
          email: purchase.email,
          name: purchase.name,
          amount: purchase.amount,
          currency: purchase.currency,
          status: purchase.status,
          downloadCount: purchase.downloadCount,
          createdAt: purchase.createdAt,
          expiresAt: purchase.expiresAt,
        };
      } catch (error) {
        console.error("Erro ao buscar informações de compra:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar informações",
        });
      }
    }),

  /**
   * Webhook para receber confirmação de pagamento da Kiwify
   * Deve ser chamado por webhook da Kiwify
   */
  kiwifyWebhook: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["approved", "pending", "failed", "refunded"]),
        email: z.string().email(),
        name: z.string(),
        amount: z.number(),
        transactionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Verificar se compra já existe
        let purchase = await getPurchaseByTransactionId(input.transactionId);

        if (!purchase) {
          // Criar nova compra
          const purchaseId = `PURCHASE-${Date.now()}-${nanoid(9).toUpperCase()}`;
          const downloadToken = nanoid(32);

          purchase = await createPurchase({
            id: purchaseId,
            transactionId: input.transactionId,
            email: input.email,
            name: input.name,
            amount: input.amount,
            currency: "BRL",
            status: input.status as "approved" | "pending" | "failed" | "refunded",
            kiwifyOrderId: input.orderId,
            downloadToken,
            downloadCount: 0,
            expiresAt:
              input.status === "approved"
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : null,
          });
        } else {
          // Atualizar status de compra existente
          purchase = await updatePurchaseStatus(
            purchase.id,
            input.status as "approved" | "pending" | "failed" | "refunded"
          );
        }

        // TODO: Enviar email ao usuário
        // TODO: Notificar proprietário

        return {
          success: true,
          message: "Webhook processado com sucesso",
        };
      } catch (error) {
        console.error("Erro ao processar webhook:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar webhook",
        });
      }
    }),
});
