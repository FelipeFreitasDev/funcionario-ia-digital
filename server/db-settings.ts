/**
 * Database helpers for user settings management
 */

import { getDb } from "./db";
import { sql } from "drizzle-orm";

export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(
      sql`SELECT * FROM user_settings WHERE user_id = ${userId}`
    );
    return (result as any)[0] || null;
  } catch (error) {
    console.error("[Settings] Error getting user settings:", error);
    return null;
  }
}

export async function updateUserSettings(userId: number, settings: any) {
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await getUserSettings(userId);

    if (existing) {
      await db.execute(
        sql`UPDATE user_settings SET 
          vapid_public_key = ${settings.vapidPublicKey},
          vapid_private_key = ${settings.vapidPrivateKey},
          notification_email = ${settings.notificationEmail},
          notification_push = ${settings.notificationPush},
          notification_sms = ${settings.notificationSms},
          sync_interval_minutes = ${settings.syncIntervalMinutes}
          WHERE user_id = ${userId}`
      );
    } else {
      await db.execute(
        sql`INSERT INTO user_settings (user_id, vapid_public_key, vapid_private_key, notification_email, notification_push, notification_sms, sync_interval_minutes) 
          VALUES (${userId}, ${settings.vapidPublicKey}, ${settings.vapidPrivateKey}, ${settings.notificationEmail}, ${settings.notificationPush}, ${settings.notificationSms}, ${settings.syncIntervalMinutes})`
      );
    }
  } catch (error) {
    console.error("[Settings] Error updating user settings:", error);
  }
}

export async function getNotificationPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(
      sql`SELECT * FROM notification_preferences WHERE user_id = ${userId}`
    );
    return (result as any)[0] || null;
  } catch (error) {
    console.error("[Settings] Error getting notification preferences:", error);
    return null;
  }
}

export async function updateNotificationPreferences(userId: number, prefs: any) {
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await getNotificationPreferences(userId);

    if (existing) {
      await db.execute(
        sql`UPDATE notification_preferences SET 
          new_order = ${prefs.newOrder},
          order_status_change = ${prefs.orderStatusChange},
          publication_completed = ${prefs.publicationCompleted},
          low_stock_alert = ${prefs.lowStockAlert},
          sync_error = ${prefs.syncError},
          recommendation = ${prefs.recommendation},
          daily_summary = ${prefs.dailySummary},
          summary_time = ${prefs.summaryTime}
          WHERE user_id = ${userId}`
      );
    } else {
      await db.execute(
        sql`INSERT INTO notification_preferences (user_id, new_order, order_status_change, publication_completed, low_stock_alert, sync_error, recommendation, daily_summary, summary_time) 
          VALUES (${userId}, ${prefs.newOrder}, ${prefs.orderStatusChange}, ${prefs.publicationCompleted}, ${prefs.lowStockAlert}, ${prefs.syncError}, ${prefs.recommendation}, ${prefs.dailySummary}, ${prefs.summaryTime})`
      );
    }
  } catch (error) {
    console.error("[Settings] Error updating notification preferences:", error);
  }
}

export async function getPlatformOAuthCredentials(userId: number, platform: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.execute(
      sql`SELECT * FROM platform_oauth_credentials WHERE user_id = ${userId} AND platform = ${platform}`
    );
    return (result as any)[0] || null;
  } catch (error) {
    console.error("[Settings] Error getting platform credentials:", error);
    return null;
  }
}

export async function savePlatformOAuthCredentials(userId: number, platform: string, credentials: any) {
  const db = await getDb();
  if (!db) return;

  try {
    const existing = await getPlatformOAuthCredentials(userId, platform);

    if (existing) {
      await db.execute(
        sql`UPDATE platform_oauth_credentials SET 
          client_id = ${credentials.clientId},
          client_secret = ${credentials.clientSecret},
          access_token = ${credentials.accessToken},
          refresh_token = ${credentials.refreshToken},
          token_expires_at = ${credentials.tokenExpiresAt}
          WHERE user_id = ${userId} AND platform = ${platform}`
      );
    } else {
      await db.execute(
        sql`INSERT INTO platform_oauth_credentials (user_id, platform, client_id, client_secret, access_token, refresh_token, token_expires_at) 
          VALUES (${userId}, ${platform}, ${credentials.clientId}, ${credentials.clientSecret}, ${credentials.accessToken}, ${credentials.refreshToken}, ${credentials.tokenExpiresAt})`
      );
    }
  } catch (error) {
    console.error("[Settings] Error saving platform credentials:", error);
  }
}

export async function getAllPlatformCredentials(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db.execute(
      sql`SELECT * FROM platform_oauth_credentials WHERE user_id = ${userId} AND is_active = true`
    );
    return (result as any) || [];
  } catch (error) {
    console.error("[Settings] Error getting all platform credentials:", error);
    return [];
  }
}

export async function validateVAPIDKeys(publicKey: string, privateKey: string): Promise<boolean> {
  try {
    if (!publicKey || !privateKey) return false;
    if (publicKey.length < 50 || privateKey.length < 30) return false;
    if (!/^[A-Za-z0-9_-]+$/.test(publicKey)) return false;
    if (!/^[A-Za-z0-9_-]+$/.test(privateKey)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function logSettingsChange(userId: number, action: string, tableName: string, oldValues: any, newValues: any) {
  const db = await getDb();
  if (!db) return;

  try {
    await db.execute(
      sql`INSERT INTO settings_audit_log (user_id, action, table_name, old_values, new_values, ip_address) 
        VALUES (${userId}, ${action}, ${tableName}, ${JSON.stringify(oldValues)}, ${JSON.stringify(newValues)}, '0.0.0.0')`
    );
  } catch (error) {
    console.error("[Settings] Error logging settings change:", error);
  }
}
