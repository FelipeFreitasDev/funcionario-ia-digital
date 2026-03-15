import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Router para gerenciar contas de usuários
 * Cria contas automaticamente após pagamento
 */

export const accountsRouter = router({
  /**
   * Criar conta automaticamente após pagamento
   * Chamado pelo webhook da Kiwify
   */
  createFromPayment: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        transactionId: z.string(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // Verificar se usuário já existe
        const existingUser = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          return {
            success: true,
            userId: existingUser[0].id,
            message: "Usuário já existe",
          };
        }

        // Gerar openId único
        const openId = `payment-${input.transactionId}-${nanoid(8)}`;

        // Criar novo usuário
        const result = await db.insert(users).values({
          openId,
          email: input.email,
          name: input.name || input.email.split("@")[0],
          loginMethod: "payment",
          role: "user",
          lastSignedIn: new Date(),
        });

        return {
          success: true,
          message: "Conta criada com sucesso",
          email: input.email,
          transactionId: input.transactionId,
        };
      } catch (error) {
        console.error("[Accounts] Error creating user:", error);
        throw new Error("Falha ao criar conta");
      }
    }),

  /**
   * Obter dados da conta do usuário logado
   */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (user.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      return {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
        role: user[0].role,
        createdAt: user[0].createdAt,
        lastSignedIn: user[0].lastSignedIn,
      };
    } catch (error) {
      console.error("[Accounts] Error getting profile:", error);
      throw new Error("Falha ao obter perfil");
    }
  }),

  /**
   * Atualizar perfil do usuário
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const updateData: Record<string, unknown> = {};

        if (input.name) {
          updateData.name = input.name;
        }

        if (input.email) {
          // Verificar se email já existe
          const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, input.email))
            .limit(1);

          if (existing.length > 0 && existing[0].id !== ctx.user.id) {
            throw new Error("Email já está em uso");
          }

          updateData.email = input.email;
        }

        if (Object.keys(updateData).length === 0) {
          return { success: true, message: "Nenhuma alteração" };
        }

        updateData.updatedAt = new Date();

        await db.update(users).set(updateData).where(eq(users.id, ctx.user.id));

        return {
          success: true,
          message: "Perfil atualizado com sucesso",
        };
      } catch (error) {
        console.error("[Accounts] Error updating profile:", error);
        throw new Error("Falha ao atualizar perfil");
      }
    }),

  /**
   * Deletar conta do usuário
   */
  deleteAccount: protectedProcedure
    .input(z.object({ password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // TODO: Validar senha antes de deletar
        // Por enquanto, apenas deletar

        await db.delete(users).where(eq(users.id, ctx.user.id));

        return {
          success: true,
          message: "Conta deletada com sucesso",
        };
      } catch (error) {
        console.error("[Accounts] Error deleting account:", error);
        throw new Error("Falha ao deletar conta");
      }
    }),

  /**
   * Obter estatísticas da conta
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implementar estatísticas reais
    // Por enquanto, retornar dados simulados

    return {
      totalPosts: 24,
      totalEngagement: 1250,
      connectedAccounts: 3,
      scheduledPosts: 5,
      accountAge: Math.floor((Date.now() - ctx.user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    };
  }),
});
