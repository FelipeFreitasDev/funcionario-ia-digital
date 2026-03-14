import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import {
  createSupportTicket,
  getSupportTicketById,
  getSupportTicketsByEmail,
  addResponseToTicket,
} from "../db";

// Validação de entrada para criar ticket
const createTicketSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  category: z.enum([
    "installation",
    "performance",
    "compatibility",
    "features",
    "offline",
    "other",
  ]),
  subject: z.string().min(5, "Assunto deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  attachments: z
    .array(
      z.object({
        filename: z.string(),
        size: z.number(),
        url: z.string(),
      })
    )
    .default([]),
});

// Validação para adicionar resposta
const addResponseSchema = z.object({
  ticketId: z.string(),
  author: z.string().min(2),
  message: z.string().min(5),
});

export const supportRouter = router({
  /**
   * Criar novo ticket de suporte
   */
  createTicket: publicProcedure
    .input(createTicketSchema)
    .mutation(async ({ input }) => {
      try {
        // Gerar ID único para o ticket
        const ticketId = `SUPP-${Date.now()}-${nanoid(9).toUpperCase()}`;

        // Calcular prioridade baseado na categoria
        const priorityMap: Record<string, "low" | "medium" | "high" | "critical"> = {
          installation: "high",
          offline: "high",
          performance: "medium",
          compatibility: "medium",
          features: "low",
          other: "low",
        };

        const priority = priorityMap[input.category] || "low";

        // Criar ticket no banco de dados
        const ticket = await createSupportTicket({
          id: ticketId,
          name: input.name,
          email: input.email,
          category: input.category,
          subject: input.subject,
          description: input.description,
          status: "open",
          priority,
          attachments: input.attachments,
          responses: [],
        });

        if (!ticket) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao criar ticket",
          });
        }

        // TODO: Enviar email de confirmação ao usuário
        // TODO: Notificar equipe de suporte

        return {
          success: true,
          ticketId: ticket.id,
          message: "Ticket de suporte criado com sucesso",
        };
      } catch (error) {
        console.error("Erro ao criar ticket:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao processar solicitação",
        });
      }
    }),

  /**
   * Obter ticket por ID
   */
  getTicket: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const ticket = await getSupportTicketById(input.id);

        if (!ticket) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Ticket não encontrado",
          });
        }

        return ticket;
      } catch (error) {
        console.error("Erro ao buscar ticket:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar ticket",
        });
      }
    }),

  /**
   * Obter tickets por email
   */
  getTicketsByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      try {
        const tickets = await getSupportTicketsByEmail(input.email);
        return tickets;
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao buscar tickets",
        });
      }
    }),

  /**
   * Adicionar resposta a um ticket
   */
  addResponse: publicProcedure
    .input(addResponseSchema)
    .mutation(async ({ input }) => {
      try {
        const ticket = await addResponseToTicket(
          input.ticketId,
          input.author,
          input.message
        );

        if (!ticket) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Ticket não encontrado",
          });
        }

        // TODO: Notificar usuário sobre nova resposta

        return {
          success: true,
          message: "Resposta adicionada com sucesso",
          ticket,
        };
      } catch (error) {
        console.error("Erro ao adicionar resposta:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erro ao adicionar resposta",
        });
      }
    }),
});
