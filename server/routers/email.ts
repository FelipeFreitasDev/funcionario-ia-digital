import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";

/**
 * Email Router
 * Gerencia envio de emails de confirmação, renovação e notificações
 */
export const emailRouter = router({
  /**
   * Enviar email de confirmação de pagamento
   * Chamado pelo webhook do Stripe após pagamento bem-sucedido
   */
  sendPaymentConfirmation: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        planName: z.string(),
        amount: z.number(),
        currency: z.string().default("BRL"),
        subscriptionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Template do email de confirmação
        const emailContent = `
          <h1>Pagamento Confirmado! 🎉</h1>
          <p>Olá ${input.name},</p>
          <p>Seu pagamento foi processado com sucesso!</p>
          
          <h2>Detalhes da Assinatura:</h2>
          <ul>
            <li><strong>Plano:</strong> ${input.planName}</li>
            <li><strong>Valor:</strong> ${input.currency} ${(input.amount / 100).toFixed(2)}</li>
            <li><strong>ID da Assinatura:</strong> ${input.subscriptionId}</li>
          </ul>
          
          <p>Você agora tem acesso total ao Dashboard. Clique no botão abaixo para começar:</p>
          <a href="${process.env.VITE_FRONTEND_URL || "https://funciaia-sdysrify.manus.space"}/dashboard" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Acessar Dashboard
          </a>
          
          <hr>
          <p>Se tiver dúvidas, entre em contato com nosso suporte.</p>
          <p>Obrigado por escolher o Funcionário Digital!</p>
        `;

        // Aqui você integraria com seu serviço de email (SendGrid, Resend, etc)
        console.log(`[EMAIL] Enviando confirmação de pagamento para ${input.email}`);
        console.log(`[EMAIL] Conteúdo: ${emailContent}`);

        // TODO: Integrar com serviço de email real
        // await sendEmail({
        //   to: input.email,
        //   subject: `Pagamento Confirmado - Plano ${input.planName}`,
        //   html: emailContent,
        // });

        return {
          success: true,
          message: "Email de confirmação enviado com sucesso",
        };
      } catch (error) {
        console.error("[EMAIL] Erro ao enviar email de confirmação:", error);
        return {
          success: false,
          message: "Erro ao enviar email de confirmação",
        };
      }
    }),

  /**
   * Enviar notificação de renovação de assinatura
   * Chamado 7 dias antes da renovação
   */
  sendRenewalNotification: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        planName: z.string(),
        renewalDate: z.string(), // ISO date string
        amount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const emailContent = `
          <h1>Sua Assinatura Será Renovada em Breve 📅</h1>
          <p>Olá ${input.name},</p>
          <p>Queremos lembrá-lo que sua assinatura será renovada em <strong>${new Date(input.renewalDate).toLocaleDateString("pt-BR")}</strong>.</p>
          
          <h2>Detalhes da Renovação:</h2>
          <ul>
            <li><strong>Plano:</strong> ${input.planName}</li>
            <li><strong>Valor:</strong> R$ ${(input.amount / 100).toFixed(2)}</li>
            <li><strong>Data de Renovação:</strong> ${new Date(input.renewalDate).toLocaleDateString("pt-BR")}</li>
          </ul>
          
          <p>Se deseja fazer alterações na sua assinatura (upgrade, downgrade ou cancelamento), você pode fazer isso agora:</p>
          <a href="${process.env.VITE_FRONTEND_URL || "https://funciaia-sdysrify.manus.space"}/subscription-management" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Gerenciar Assinatura
          </a>
          
          <hr>
          <p>Dúvidas? Estamos aqui para ajudar!</p>
        `;

        console.log(`[EMAIL] Enviando notificação de renovação para ${input.email}`);

        // TODO: Integrar com serviço de email real
        // await sendEmail({
        //   to: input.email,
        //   subject: `Lembrete: Sua Assinatura Será Renovada em ${new Date(input.renewalDate).toLocaleDateString("pt-BR")}`,
        //   html: emailContent,
        // });

        return {
          success: true,
          message: "Email de renovação enviado com sucesso",
        };
      } catch (error) {
        console.error("[EMAIL] Erro ao enviar email de renovação:", error);
        return {
          success: false,
          message: "Erro ao enviar email de renovação",
        };
      }
    }),

  /**
   * Enviar email de cancelamento de assinatura
   */
  sendCancellationConfirmation: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string(),
        planName: z.string(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const emailContent = `
          <h1>Sua Assinatura Foi Cancelada 😢</h1>
          <p>Olá ${input.name},</p>
          <p>Confirmamos que sua assinatura do plano <strong>${input.planName}</strong> foi cancelada com sucesso.</p>
          
          ${input.reason ? `<p><strong>Motivo do Cancelamento:</strong> ${input.reason}</p>` : ""}
          
          <p>Você ainda terá acesso até o final do período de faturamento atual.</p>
          
          <h2>Sinta-se à vontade para voltar!</h2>
          <p>Se mudou de ideia ou tiver sugestões de melhorias, adoraríamos ouvir de você.</p>
          <a href="${process.env.VITE_FRONTEND_URL || "https://funciaia-sdysrify.manus.space"}/subscription-plans" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Ver Planos Novamente
          </a>
          
          <hr>
          <p>Obrigado por ter sido nosso cliente!</p>
        `;

        console.log(`[EMAIL] Enviando confirmação de cancelamento para ${input.email}`);

        // TODO: Integrar com serviço de email real
        // await sendEmail({
        //   to: input.email,
        //   subject: "Sua Assinatura Foi Cancelada",
        //   html: emailContent,
        // });

        return {
          success: true,
          message: "Email de cancelamento enviado com sucesso",
        };
      } catch (error) {
        console.error("[EMAIL] Erro ao enviar email de cancelamento:", error);
        return {
          success: false,
          message: "Erro ao enviar email de cancelamento",
        };
      }
    }),
});
