/**
 * tRPC Router - Batch Download
 * Endpoints para download em batch de gerações
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { generateDownloadZip, getDownloadFilename, validateDownloadOptions } from "../_core/download";

export const batchDownloadRouter = router({
  /**
   * Gerar ZIP com gerações para download
   */
  generateZip: protectedProcedure
    .input(
      z.object({
        type: z.enum(["image", "video"]).optional(),
        style: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        limit: z.number().int().min(1).max(1000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validar opções
        const options = {
          userId: ctx.user.id,
          type: input.type,
          style: input.style,
          startDate: input.startDate ? new Date(input.startDate) : undefined,
          endDate: input.endDate ? new Date(input.endDate) : undefined,
          limit: input.limit,
        };

        const validationError = validateDownloadOptions(options);
        if (validationError) {
          return {
            success: false,
            error: validationError,
          };
        }

        // Gerar ZIP
        const zipBuffer = await generateDownloadZip(options);
        const filename = getDownloadFilename(options);

        // Converter para base64 para envio
        const base64 = zipBuffer.toString("base64");

        return {
          success: true,
          filename,
          size: zipBuffer.length,
          data: base64,
          message: `ZIP gerado com sucesso (${zipBuffer.length} bytes)`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao gerar ZIP",
        };
      }
    }),

  /**
   * Obter informações sobre o download (sem gerar arquivo)
   */
  getInfo: protectedProcedure
    .input(
      z.object({
        type: z.enum(["image", "video"]).optional(),
        style: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Aqui você faria uma query para contar gerações
        // Por enquanto, retornamos dados simulados
        const count = Math.floor(Math.random() * 100) + 1;
        const estimatedSize = count * 50000; // ~50KB por imagem

        return {
          success: true,
          data: {
            generationCount: count,
            estimatedSize: estimatedSize,
            estimatedSizeFormatted: `${(estimatedSize / 1024 / 1024).toFixed(2)} MB`,
            filters: {
              type: input.type,
              style: input.style,
              startDate: input.startDate,
              endDate: input.endDate,
            },
          },
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          error: error instanceof Error ? error.message : "Erro ao obter informações",
        };
      }
    }),

  /**
   * Obter lista de gerações para download (com paginação)
   */
  listForDownload: protectedProcedure
    .input(
      z.object({
        type: z.enum(["image", "video"]).optional(),
        style: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // Aqui você faria uma query real
        // Por enquanto, retornamos dados simulados
        const generations = Array.from({ length: input.limit }, (_, i) => ({
          id: `GEN-${input.offset + i}`,
          type: input.type || "image",
          prompt: `Geração ${input.offset + i}`,
          style: input.style || "moderno",
          url: `https://example.com/image-${input.offset + i}.jpg`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          selected: false,
        }));

        return {
          success: true,
          data: generations,
          total: 150, // Simulado
          hasMore: input.offset + input.limit < 150,
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          total: 0,
          hasMore: false,
          error: error instanceof Error ? error.message : "Erro ao listar gerações",
        };
      }
    }),

  /**
   * Download de gerações selecionadas
   */
  downloadSelected: protectedProcedure
    .input(
      z.object({
        generationIds: z.array(z.string()).min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.generationIds.length === 0) {
          return {
            success: false,
            error: "Selecione pelo menos uma geração",
          };
        }

        // Aqui você faria uma query para obter as gerações selecionadas
        // Por enquanto, simulamos a geração do ZIP
        const zipSize = input.generationIds.length * 50000;
        const filename = `generations-selected-${Date.now()}.zip`;

        return {
          success: true,
          filename,
          size: zipSize,
          message: `${input.generationIds.length} gerações selecionadas para download`,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao preparar download",
        };
      }
    }),
});
