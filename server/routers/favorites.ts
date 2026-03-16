/**
 * tRPC Router - Favorites Management
 * Endpoints para gerenciar gerações favoritas e compartilhamento
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createFavorite,
  deleteFavorite,
  getFavoriteById,
  getFavoriteByPublicToken,
  getUserCollections,
  getUserFavorites,
  getUserFavoritesStats,
  isFavorite,
  shareFavorite,
} from "../db-favorites";

export const favoritesRouter = router({
  /**
   * Adicionar geração aos favoritos
   */
  add: protectedProcedure
    .input(
      z.object({
        generationId: z.string().min(1),
        collectionName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const favorite = await createFavorite(
          ctx.user.id,
          input.generationId,
          input.collectionName
        );

        return {
          success: true,
          id: favorite.id,
          message: "Geração adicionada aos favoritos",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao adicionar favorito",
        };
      }
    }),

  /**
   * Remover dos favoritos
   */
  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const favorite = await getFavoriteById(input.id);

        if (!favorite || favorite.userId !== ctx.user.id) {
          return {
            success: false,
            error: "Favorito não encontrado",
          };
        }

        const deleted = await deleteFavorite(input.id);

        return {
          success: deleted,
          message: deleted ? "Removido dos favoritos" : "Erro ao remover",
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao remover favorito",
        };
      }
    }),

  /**
   * Listar favoritos do usuário
   */
  list: protectedProcedure
    .input(
      z.object({
        collectionName: z.string().optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const favorites = await getUserFavorites(ctx.user.id, input.collectionName);

        return {
          success: true,
          data: favorites.slice(input.offset, input.offset + input.limit),
          count: favorites.length,
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          count: 0,
          error: error instanceof Error ? error.message : "Erro ao listar favoritos",
        };
      }
    }),

  /**
   * Obter favorito por ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const favorite = await getFavoriteById(input.id);

        if (!favorite || favorite.userId !== ctx.user.id) {
          return {
            success: true,
            data: null,
          };
        }

        return {
          success: true,
          data: favorite,
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : "Erro ao obter favorito",
        };
      }
    }),

  /**
   * Verificar se é favorito
   */
  isFavorite: protectedProcedure
    .input(z.object({ generationId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const favorite = await isFavorite(ctx.user.id, input.generationId);

        return {
          success: true,
          isFavorite: favorite,
        };
      } catch (error) {
        return {
          success: false,
          isFavorite: false,
          error: error instanceof Error ? error.message : "Erro ao verificar favorito",
        };
      }
    }),

  /**
   * Compartilhar favorito (gerar link público)
   */
  share: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        expiresInDays: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const favorite = await getFavoriteById(input.id);

        if (!favorite || favorite.userId !== ctx.user.id) {
          return {
            success: false,
            error: "Favorito não encontrado",
          };
        }

        const publicToken = await shareFavorite(input.id, input.expiresInDays);

        return {
          success: true,
          publicToken,
          shareUrl: `${process.env.VITE_FRONTEND_URL || "https://app.example.com"}/shared/${publicToken}`,
          expiresInDays: input.expiresInDays,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao compartilhar",
        };
      }
    }),

  /**
   * Obter favorito compartilhado (público)
   */
  getPublic: protectedProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      try {
        const favorite = await getFavoriteByPublicToken(input.token);

        if (!favorite) {
          return {
            success: false,
            data: null,
            error: "Link expirado ou inválido",
          };
        }

        return {
          success: true,
          data: favorite,
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : "Erro ao obter favorito compartilhado",
        };
      }
    }),

  /**
   * Obter coleções do usuário
   */
  getCollections: protectedProcedure.query(async ({ ctx }) => {
    try {
      const collections = await getUserCollections(ctx.user.id);

      return {
        success: true,
        data: collections,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Erro ao obter coleções",
      };
    }
  }),

  /**
   * Obter estatísticas de favoritos
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const stats = await getUserFavoritesStats(ctx.user.id);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        data: { total: 0, collections: 0, public_shares: 0 },
        error: error instanceof Error ? error.message : "Erro ao obter estatísticas",
      };
    }
  }),
});
