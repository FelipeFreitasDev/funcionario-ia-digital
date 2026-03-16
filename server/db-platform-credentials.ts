/**
 * Database Helpers - Platform Credentials
 */

import { getDb } from "./db";

export interface PlatformCredential {
  id: number;
  userId: number;
  platform: "shopee" | "mercadolivre" | "amazon";
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  platformUserId: string;
  platformUsername: string;
  connectedAt: Date;
  lastSyncAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Salvar credenciais de plataforma
 */
export async function savePlatformCredential(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon",
  credential: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    platformUserId: string;
    platformUsername: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Use raw SQL via the database client
    const client = (db as any).$client;
    const query = `
      INSERT INTO platform_credentials 
      (user_id, platform, access_token, refresh_token, expires_at, platform_user_id, platform_username, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, true)
      ON DUPLICATE KEY UPDATE
      access_token = VALUES(access_token),
      refresh_token = VALUES(refresh_token),
      expires_at = VALUES(expires_at),
      platform_user_id = VALUES(platform_user_id),
      platform_username = VALUES(platform_username),
      is_active = true,
      updated_at = CURRENT_TIMESTAMP
    `;

    const [result] = await client.execute(query, [
      userId,
      platform,
      credential.accessToken,
      credential.refreshToken || null,
      credential.expiresAt || null,
      credential.platformUserId,
      credential.platformUsername,
    ]);

    return result;
  } catch (error) {
    console.error("[DB] Erro ao salvar credenciais:", error);
    throw error;
  }
}

/**
 * Obter credenciais de uma plataforma
 */
export async function getPlatformCredential(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon"
): Promise<PlatformCredential | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      SELECT * FROM platform_credentials
      WHERE user_id = ? AND platform = ? AND is_active = true
      LIMIT 1
    `;

    const [rows] = await client.execute(query, [userId, platform]);
    const row = (rows as any[])[0];

    if (!row) return null;

    return {
      id: row.id,
      userId: row.user_id,
      platform: row.platform,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      platformUserId: row.platform_user_id,
      platformUsername: row.platform_username,
      connectedAt: new Date(row.connected_at),
      lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error("[DB] Erro ao obter credenciais:", error);
    throw error;
  }
}

/**
 * Obter todas as credenciais de um usuário
 */
export async function getUserPlatformCredentials(userId: number): Promise<PlatformCredential[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      SELECT * FROM platform_credentials
      WHERE user_id = ? AND is_active = true
      ORDER BY platform ASC
    `;

    const [rows] = await client.execute(query, [userId]);

    return (rows as any[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      platform: row.platform,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      platformUserId: row.platform_user_id,
      platformUsername: row.platform_username,
      connectedAt: new Date(row.connected_at),
      lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("[DB] Erro ao obter credenciais do usuário:", error);
    throw error;
  }
}

/**
 * Atualizar token de acesso
 */
export async function updateAccessToken(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon",
  accessToken: string,
  expiresAt?: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      UPDATE platform_credentials
      SET access_token = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND platform = ?
    `;

    await client.execute(query, [accessToken, expiresAt || null, userId, platform]);
  } catch (error) {
    console.error("[DB] Erro ao atualizar token:", error);
    throw error;
  }
}

/**
 * Atualizar última sincronização
 */
export async function updateLastSync(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      UPDATE platform_credentials
      SET last_sync_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND platform = ?
    `;

    await client.execute(query, [userId, platform]);
  } catch (error) {
    console.error("[DB] Erro ao atualizar última sincronização:", error);
    throw error;
  }
}

/**
 * Desconectar plataforma
 */
export async function disconnectPlatform(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      UPDATE platform_credentials
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND platform = ?
    `;

    await client.execute(query, [userId, platform]);
  } catch (error) {
    console.error("[DB] Erro ao desconectar plataforma:", error);
    throw error;
  }
}

/**
 * Obter credenciais que precisam de renovação
 */
export async function getExpiredCredentials(): Promise<PlatformCredential[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const client = (db as any).$client;
    const query = `
      SELECT * FROM platform_credentials
      WHERE is_active = true 
      AND expires_at IS NOT NULL
      AND expires_at < DATE_ADD(NOW(), INTERVAL 5 MINUTE)
      ORDER BY expires_at ASC
    `;

    const [rows] = await client.execute(query);

    return (rows as any[]).map((row) => ({
      id: row.id,
      userId: row.user_id,
      platform: row.platform,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      platformUserId: row.platform_user_id,
      platformUsername: row.platform_username,
      connectedAt: new Date(row.connected_at),
      lastSyncAt: row.last_sync_at ? new Date(row.last_sync_at) : undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error("[DB] Erro ao obter credenciais expiradas:", error);
    throw error;
  }
}
