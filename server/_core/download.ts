/**
 * Download Service - Batch ZIP Generation
 * Gera arquivos ZIP com múltiplas gerações
 */

import archiver from "archiver";
import { Readable } from "stream";
import { getUserGenerations } from "../db-generations";

export interface DownloadOptions {
  userId: number;
  type?: "image" | "video";
  style?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}

/**
 * Gerar ZIP com gerações
 */
export async function generateDownloadZip(options: DownloadOptions): Promise<Buffer> {
  // Obter gerações do usuário
  const generations = await getUserGenerations(options.userId, {
    type: options.type,
    limit: options.limit || 100,
  });

  // Filtrar por data se especificado
  let filtered = generations;
  if (options.startDate || options.endDate) {
    filtered = generations.filter((gen: any) => {
      const genDate = new Date(gen.createdAt);
      if (options.startDate && genDate < options.startDate) return false;
      if (options.endDate && genDate > options.endDate) return false;
      return true;
    });
  }

  // Filtrar por estilo se especificado
  if (options.style) {
    filtered = filtered.filter((gen: any) => gen.style === options.style);
  }

  if (filtered.length === 0) {
    throw new Error("Nenhuma geração encontrada com os filtros especificados");
  }

  // Criar arquivo ZIP
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => {
      chunks.push(chunk);
    });

    archive.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    archive.on("error", (err) => {
      reject(err);
    });

    // Adicionar cada geração ao ZIP
    filtered.forEach((gen: any, index: number) => {
      const filename = `${index + 1}-${gen.style}-${gen.type}.json`;

      const metadata = {
        id: gen.id,
        type: gen.type,
        prompt: gen.prompt,
        style: gen.style,
        provider: gen.provider,
        quality: gen.quality,
        url: gen.url,
        status: gen.status,
        createdAt: gen.createdAt,
        processingTime: gen.processingTime,
      };

      archive.append(JSON.stringify(metadata, null, 2), {
        name: `generation_${index + 1}/${filename}`,
      });

      // Se houver URL, adicionar referência
      if (gen.url) {
        archive.append(`URL: ${gen.url}\n`, {
          name: `generation_${index + 1}/url.txt`,
        });
      }
    });

    // Adicionar manifest com informações do download
    const manifest = {
      downloadDate: new Date().toISOString(),
      totalGenerations: filtered.length,
      filters: {
        type: options.type,
        style: options.style,
        startDate: options.startDate?.toISOString(),
        endDate: options.endDate?.toISOString(),
      },
      generations: filtered.map((gen: any) => ({
        id: gen.id,
        type: gen.type,
        prompt: gen.prompt,
        style: gen.style,
        createdAt: gen.createdAt,
      })),
    };

    archive.append(JSON.stringify(manifest, null, 2), {
      name: "manifest.json",
    });

    archive.finalize();
  });
}

/**
 * Obter nome do arquivo de download
 */
export function getDownloadFilename(options: DownloadOptions): string {
  const date = new Date().toISOString().split("T")[0];
  const type = options.type || "all";
  const style = options.style ? `-${options.style}` : "";

  return `generations-${type}${style}-${date}.zip`;
}

/**
 * Validar opções de download
 */
export function validateDownloadOptions(options: DownloadOptions): string | null {
  if (!options.userId) {
    return "userId é obrigatório";
  }

  if (options.type && !["image", "video"].includes(options.type)) {
    return "type deve ser 'image' ou 'video'";
  }

  if (options.limit && options.limit < 1) {
    return "limit deve ser maior que 0";
  }

  if (options.startDate && options.endDate) {
    if (options.startDate > options.endDate) {
      return "startDate deve ser anterior a endDate";
    }
  }

  return null;
}
