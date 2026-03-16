/**
 * Database helpers para gerenciar histórico de gerações de IA
 */

import { getDb } from "./db";
import { generations } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Gerar ID único para geração
 */
function generateGenerationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `GEN-${timestamp}-${random}`;
}

/**
 * Criar novo registro de geração
 */
export async function createGeneration(data: {
  userId: number;
  type: "image" | "video";
  prompt: string;
  style: string;
  provider: string;
  quality?: string;
  duration?: number;
  width?: number;
  height?: number;
  url?: string;
  thumbnailUrl?: string;
  fromCache?: boolean;
}) {
  const id = generateGenerationId();
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(generations).values({
    id,
    userId: data.userId,
    type: data.type,
    prompt: data.prompt,
    style: data.style,
    provider: data.provider,
    quality: data.quality,
    duration: data.duration,
    width: data.width || 1024,
    height: data.height || 768,
    url: data.url,
    thumbnailUrl: data.thumbnailUrl,
    status: data.url ? "completed" : "pending",
    fromCache: data.fromCache || false,
  });

  return id;
}

/**
 * Obter geração por ID
 */
export async function getGenerationById(id: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(generations)
    .where(eq(generations.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * Listar gerações do usuário
 */
export async function getUserGenerations(
  userId: number,
  options?: {
    type?: "image" | "video";
    limit?: number;
    offset?: number;
  }
) {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(desc(generations.createdAt))
    .limit(options?.limit || 20)
    .offset(options?.offset || 0);

  return results;
}

/**
 * Atualizar status de geração
 */
export async function updateGenerationStatus(
  id: string,
  status: "pending" | "processing" | "completed" | "failed",
  data?: {
    url?: string;
    thumbnailUrl?: string;
    error?: string;
    processingTime?: number;
  }
) {
  const db = await getDb();
  if (!db) return;
  const updateData: any = { status };

  if (data?.url) updateData.url = data.url;
  if (data?.thumbnailUrl) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data?.error) updateData.error = data.error;
  if (data?.processingTime) updateData.processingTime = data.processingTime;

  await db.update(generations).set(updateData).where(eq(generations.id, id));
}

/**
 * Deletar geração
 */
export async function deleteGeneration(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(generations).where(eq(generations.id, id));
}

/**
 * Obter estatísticas do usuário
 */
export async function getUserGenerationStats(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, images: 0, videos: 0, completed: 0, failed: 0, fromCache: 0, avgProcessingTime: 0 };
  const allGenerations = await db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId));

  const images = allGenerations.filter((g: any) => g.type === "image");
  const videos = allGenerations.filter((g: any) => g.type === "video");
  const completed = allGenerations.filter((g: any) => g.status === "completed");
  const failed = allGenerations.filter((g: any) => g.status === "failed");
  const fromCache = allGenerations.filter((g: any) => g.fromCache);

  const totalProcessingTime = completed.reduce(
    (sum: number, g: any) => sum + (g.processingTime || 0),
    0
  );
  const avgProcessingTime =
    completed.length > 0 ? totalProcessingTime / completed.length : 0;

  return {
    total: allGenerations.length,
    images: images.length,
    videos: videos.length,
    completed: completed.length,
    failed: failed.length,
    fromCache: fromCache.length,
    avgProcessingTime: Math.round(avgProcessingTime),
  };
}

/**
 * Limpar gerações expiradas
 */
export async function cleanupExpiredGenerations() {
  const now = new Date();

  // Usar SQL direto para deletar expiradas
  // await db.delete(generations).where(isNotNull(generations.expiresAt));
  // Por enquanto, apenas retornar
  return;
}

/**
 * Obter gerações mais populares (por estilo)
 */
export async function getPopularStyles(userId: number, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  const userGenerations = await db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId));

  const styleCount: Record<string, number> = {};

  userGenerations.forEach((g: any) => {
    styleCount[g.style] = (styleCount[g.style] || 0) + 1;
  });

  return Object.entries(styleCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([style, count]) => ({ style, count }));
}
