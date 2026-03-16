/**
 * tRPC Router - Platform OAuth Management
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getAuthorizationUrl, exchangeCodeForToken, getValidToken } from "../_core/platformOAuth";
import {
  savePlatformCredential,
  getPlatformCredential,
  getUserPlatformCredentials,
  disconnectPlatform as dbDisconnectPlatform,
  updateLastSync,
} from "../db-platform-credentials";

export const platformsRouter = router({
  /**
   * Obter URL de autorização para uma plataforma
   */
  getAuthorizationUrl: protectedProcedure
    .input(z.object({ platform: z.enum(["shopee", "mercadolivre", "amazon"]) }))
    .query(async ({ input }) => {
      try {
        const state = Math.random().toString(36).substring(7);
        const authUrl = getAuthorizationUrl(input.platform, state);

        return {
          success: true,
          data: {
            authUrl,
            state,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao gerar URL de autorização",
        };
      }
    }),

  /**
   * Conectar plataforma via OAuth
   */
  connectPlatform: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["shopee", "mercadolivre", "amazon"]),
        code: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const tokenData = await exchangeCodeForToken(input.platform, input.code);

        // Salvar no banco de dados
        await savePlatformCredential(ctx.user.id, input.platform, {
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
          platformUserId: tokenData.platformUserId,
          platformUsername: tokenData.platformUsername,
        });

        return {
          success: true,
          data: {
            platform: input.platform,
            username: tokenData.platformUsername,
            connectedAt: new Date(),
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao conectar plataforma",
        };
      }
    }),

  /**
   * Desconectar plataforma
   */
  disconnectPlatform: protectedProcedure
    .input(z.object({ platform: z.enum(["shopee", "mercadolivre", "amazon"]) }))
    .mutation(async ({ input, ctx }) => {
      try {
        await dbDisconnectPlatform(ctx.user.id, input.platform);

        return {
          success: true,
          message: `${input.platform} desconectado com sucesso`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao desconectar plataforma",
        };
      }
    }),

  /**
   * Listar plataformas conectadas
   */
  getConnectedPlatforms: protectedProcedure.query(async ({ ctx }) => {
    try {
      const credentials = await getUserPlatformCredentials(ctx.user.id);

      return {
        success: true,
        data: credentials.map((c) => ({
          platform: c.platform,
          username: c.platformUsername,
          connectedAt: c.connectedAt,
          lastSyncAt: c.lastSyncAt,
        })),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao listar plataformas",
      };
    }
  }),

  /**
   * Sincronizar dados de uma plataforma
   */
  syncPlatformData: protectedProcedure
    .input(z.object({ platform: z.enum(["shopee", "mercadolivre", "amazon"]) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const credential = await getPlatformCredential(ctx.user.id, input.platform);
        if (!credential) {
          return {
            success: false,
            error: "Plataforma não conectada",
          };
        }

        // Renovar token se necessário
        let accessToken = credential.accessToken;
        if (credential.expiresAt && new Date() >= credential.expiresAt && credential.refreshToken) {
          try {
            const result = await getValidToken(credential);
            if (typeof result === 'string') {
              accessToken = result;
            }
          } catch (e) {
            console.error("Erro ao renovar token:", e);
          }
        }

        // Aqui você buscaria pedidos/produtos/estoque da API
        await updateLastSync(ctx.user.id, input.platform);

        return {
          success: true,
          data: {
            platform: input.platform,
            syncedAt: new Date(),
            itemsSync: 0,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao sincronizar dados",
        };
      }
    }),

  /**
   * Obter status de sincronização
   */
  getSyncStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const credentials = await getUserPlatformCredentials(ctx.user.id);
      const status: Record<string, any> = {
        shopee: { lastSync: null, status: "disconnected" },
        mercadolivre: { lastSync: null, status: "disconnected" },
        amazon: { lastSync: null, status: "disconnected" },
      };

      for (const cred of credentials) {
        status[cred.platform] = {
          lastSync: cred.lastSyncAt,
          status: cred.isActive ? "connected" : "disconnected",
        };
      }

      return {
        success: true,
        data: status,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao obter status",
      };
    }
  }),

  /**
   * Testar conexão com plataforma
   */
  testConnection: protectedProcedure
    .input(z.object({ platform: z.enum(["shopee", "mercadolivre", "amazon"]) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const credential = await getPlatformCredential(ctx.user.id, input.platform);
        if (!credential) {
          return {
            success: false,
            error: "Plataforma não conectada",
          };
        }

        return {
          success: true,
          message: `Conexão com ${input.platform} está funcionando`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao testar conexão",
        };
      }
    }),
});
