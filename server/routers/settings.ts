/**
 * Settings Router - User configuration endpoints
 */

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserSettings,
  updateUserSettings,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPlatformOAuthCredentials,
  savePlatformOAuthCredentials,
  getAllPlatformCredentials,
  validateVAPIDKeys,
  logSettingsChange,
} from "../db-settings";

export const settingsRouter = router({
  // Get user settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    try {
      const settings = await getUserSettings(ctx.user.id);
      return {
        success: true,
        data: settings || {
          userId: ctx.user.id,
          vapidPublicKey: null,
          vapidPrivateKey: null,
          notificationEmail: true,
          notificationPush: true,
          notificationSms: false,
          syncIntervalMinutes: 5,
        },
      };
    } catch (error) {
      console.error("[Settings] Error getting settings:", error);
      return { success: false, error: "Failed to get settings" };
    }
  }),

  // Update user settings
  updateSettings: protectedProcedure
    .input(
      z.object({
        vapidPublicKey: z.string().optional(),
        vapidPrivateKey: z.string().optional(),
        notificationEmail: z.boolean().optional(),
        notificationPush: z.boolean().optional(),
        notificationSms: z.boolean().optional(),
        syncIntervalMinutes: z.number().min(1).max(1440).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate VAPID keys if provided
        if (input.vapidPublicKey && input.vapidPrivateKey) {
          const isValid = await validateVAPIDKeys(input.vapidPublicKey, input.vapidPrivateKey);
          if (!isValid) {
            return { success: false, error: "Invalid VAPID keys format" };
          }
        }

        const oldSettings = await getUserSettings(ctx.user.id);
        await updateUserSettings(ctx.user.id, input);
        await logSettingsChange(ctx.user.id, "UPDATE", "user_settings", oldSettings, input);

        return { success: true, data: { message: "Settings updated successfully" } };
      } catch (error) {
        console.error("[Settings] Error updating settings:", error);
        return { success: false, error: "Failed to update settings" };
      }
    }),

  // Get notification preferences
  getNotificationPreferences: protectedProcedure.query(async ({ ctx }) => {
    try {
      const prefs = await getNotificationPreferences(ctx.user.id);
      return {
        success: true,
        data: prefs || {
          userId: ctx.user.id,
          newOrder: true,
          orderStatusChange: true,
          publicationCompleted: true,
          lowStockAlert: true,
          syncError: true,
          recommendation: true,
          dailySummary: false,
          summaryTime: "08:00:00",
        },
      };
    } catch (error) {
      console.error("[Settings] Error getting notification preferences:", error);
      return { success: false, error: "Failed to get notification preferences" };
    }
  }),

  // Update notification preferences
  updateNotificationPreferences: protectedProcedure
    .input(
      z.object({
        newOrder: z.boolean().optional(),
        orderStatusChange: z.boolean().optional(),
        publicationCompleted: z.boolean().optional(),
        lowStockAlert: z.boolean().optional(),
        syncError: z.boolean().optional(),
        recommendation: z.boolean().optional(),
        dailySummary: z.boolean().optional(),
        summaryTime: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const oldPrefs = await getNotificationPreferences(ctx.user.id);
        await updateNotificationPreferences(ctx.user.id, input);
        await logSettingsChange(ctx.user.id, "UPDATE", "notification_preferences", oldPrefs, input);

        return { success: true, data: { message: "Notification preferences updated" } };
      } catch (error) {
        console.error("[Settings] Error updating notification preferences:", error);
        return { success: false, error: "Failed to update notification preferences" };
      }
    }),

  // Get platform OAuth credentials
  getPlatformCredentials: protectedProcedure
    .input(z.object({ platform: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const creds = await getPlatformOAuthCredentials(ctx.user.id, input.platform);
        return {
          success: true,
          data: creds || { platform: input.platform, clientId: "", clientSecret: "" },
        };
      } catch (error) {
        console.error("[Settings] Error getting platform credentials:", error);
        return { success: false, error: "Failed to get platform credentials" };
      }
    }),

  // Save platform OAuth credentials
  savePlatformCredentials: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["shopee", "mercadolivre", "amazon"]),
        clientId: z.string().min(1),
        clientSecret: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const oldCreds = await getPlatformOAuthCredentials(ctx.user.id, input.platform);
        await savePlatformOAuthCredentials(ctx.user.id, input.platform, {
          clientId: input.clientId,
          clientSecret: input.clientSecret,
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
        });
        await logSettingsChange(ctx.user.id, "SAVE", "platform_oauth_credentials", oldCreds, input);

        return { success: true, data: { message: "Platform credentials saved" } };
      } catch (error) {
        console.error("[Settings] Error saving platform credentials:", error);
        return { success: false, error: "Failed to save platform credentials" };
      }
    }),

  // Get all connected platforms
  getAllPlatforms: protectedProcedure.query(async ({ ctx }) => {
    try {
      const platforms = await getAllPlatformCredentials(ctx.user.id);
      return { success: true, data: platforms };
    } catch (error) {
      console.error("[Settings] Error getting all platforms:", error);
      return { success: false, error: "Failed to get platforms" };
    }
  }),

  // Test VAPID keys
  testVAPIDKeys: protectedProcedure
    .input(
      z.object({
        publicKey: z.string(),
        privateKey: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const isValid = await validateVAPIDKeys(input.publicKey, input.privateKey);
        return { success: isValid, data: { valid: isValid } };
      } catch (error) {
        console.error("[Settings] Error testing VAPID keys:", error);
        return { success: false, error: "Failed to test VAPID keys" };
      }
    }),
});
