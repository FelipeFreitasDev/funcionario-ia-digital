/**
 * Web Push Service - Handle push notifications
 */

import webpush from "web-push";

// Initialize web-push with VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "your-public-key";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "your-private-key";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:support@funcionariodigital.com",
    vapidPublicKey,
    vapidPrivateKey
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

/**
 * Send push notification to a subscription
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  notification: PushNotification
): Promise<boolean> {
  try {
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || "/icon-192x192.png",
      badge: notification.badge || "/badge-72x72.png",
      tag: notification.tag || "notification",
      data: notification.data || {},
    });

    await webpush.sendNotification(subscription, payload);
    return true;
  } catch (error) {
    console.error("[WebPush] Erro ao enviar notificação:", error);
    return false;
  }
}

/**
 * Generate VAPID keys (run once and save to env)
 */
export function generateVAPIDKeys() {
  const vapidKeys = webpush.generateVAPIDKeys();
  return {
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };
}

/**
 * Get public key for client subscription
 */
export function getPublicKey(): string {
  return vapidPublicKey;
}
