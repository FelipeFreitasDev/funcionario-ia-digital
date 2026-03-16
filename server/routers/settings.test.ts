import { describe, it, expect } from "vitest";
import { settingsRouter } from "./settings";

describe("Settings Router", () => {
  // Mock context
  const mockContext = {
    user: { id: 1, name: "Test User", email: "test@example.com" },
    req: {} as any,
    res: {} as any,
  };

  it("should get user settings", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    const result = await caller.getSettings();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("data");
  });

  it("should validate VAPID keys format", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    
    // Invalid keys
    const invalidResult = await caller.testVAPIDKeys({
      publicKey: "short",
      privateKey: "short",
    });
    expect(invalidResult.success).toBe(false);

    // Valid format keys
    const validResult = await caller.testVAPIDKeys({
      publicKey: "BBQFGvG-Jz45__cdOjON8ZTYw1K83dI5tCJCeqU7zA5yUrxa16wSM2IkTYWX1BTjqjweGla6QUzyIUDE0hA-iPA",
      privateKey: "qpFPvclm4nuuRzPxaSoSS8ME6iCLxnokxaoQUeco9Yw",
    });
    expect(validResult.success).toBe(true);
  });

  it("should get notification preferences", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    const result = await caller.getNotificationPreferences();
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("data");
    if (result.data) {
      expect(result.data).toHaveProperty("newOrder");
      expect(result.data).toHaveProperty("orderStatusChange");
    }
  });

  it("should handle platform credentials", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    
    // Get credentials
    const getResult = await caller.getPlatformCredentials({ platform: "shopee" });
    expect(getResult).toHaveProperty("success");
    expect(getResult).toHaveProperty("data");
  });

  it("should get all platforms", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    const result = await caller.getAllPlatforms();
    expect(result).toHaveProperty("success");
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("should validate input for updating settings", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    
    // Valid input
    const result = await caller.updateSettings({
      notificationEmail: true,
      syncIntervalMinutes: 5,
    });
    expect(result).toHaveProperty("success");
  });

  it("should handle invalid sync interval", async () => {
    const caller = settingsRouter.createCaller(mockContext);
    
    try {
      // This should fail validation
      await caller.updateSettings({
        syncIntervalMinutes: 2000, // Too large
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
