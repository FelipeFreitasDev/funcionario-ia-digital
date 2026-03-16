import { describe, it, expect, vi } from "vitest";
import { getPublicKey, generateVAPIDKeys } from "./webPush";

describe("Web Push Service", () => {
  it("should generate VAPID keys", () => {
    const keys = generateVAPIDKeys();
    expect(keys).toHaveProperty("publicKey");
    expect(keys).toHaveProperty("privateKey");
    expect(typeof keys.publicKey).toBe("string");
    expect(typeof keys.privateKey).toBe("string");
    expect(keys.publicKey.length).toBeGreaterThan(0);
    expect(keys.privateKey.length).toBeGreaterThan(0);
  });

  it("should get public key", () => {
    const publicKey = getPublicKey();
    expect(typeof publicKey).toBe("string");
  });

  it("should handle push notification structure", () => {
    const notification = {
      title: "Test Notification",
      body: "This is a test",
      icon: "/icon.png",
      badge: "/badge.png",
      tag: "test",
      data: { url: "/test" },
    };

    expect(notification).toHaveProperty("title");
    expect(notification).toHaveProperty("body");
    expect(notification.title).toBe("Test Notification");
  });

  it("should validate push subscription structure", () => {
    const subscription = {
      endpoint: "https://example.com/push",
      keys: {
        p256dh: "test-key",
        auth: "test-auth",
      },
    };

    expect(subscription).toHaveProperty("endpoint");
    expect(subscription).toHaveProperty("keys");
    expect(subscription.keys).toHaveProperty("p256dh");
    expect(subscription.keys).toHaveProperty("auth");
  });
});
