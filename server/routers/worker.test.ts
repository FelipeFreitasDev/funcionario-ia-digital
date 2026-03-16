import { describe, it, expect, beforeEach } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: { headers: {} } as any,
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as any,
  };

  return { ctx, clearedCookies };
}

describe("worker router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(async () => {
    const { ctx } = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("start", () => {
    it("should start worker", async () => {
      const result = await caller.worker.start();

      expect(result.success).toBe(true);
      expect(result.message).toContain("iniciado");
    });
  });

  describe("stop", () => {
    it("should stop worker", async () => {
      const result = await caller.worker.stop();

      expect(result.success).toBe(true);
      expect(result.message).toContain("parado");
    });
  });

  describe("getStatus", () => {
    it("should get worker status", async () => {
      const result = await caller.worker.getStatus();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.isRunning).toBeDefined();
      expect(result.data?.taskCount).toBeGreaterThan(0);
      expect(Array.isArray(result.data?.tasks)).toBe(true);
    });

    it("should have default tasks", async () => {
      const result = await caller.worker.getStatus();

      expect(result.success).toBe(true);
      const taskIds = result.data?.tasks?.map((t: any) => t.id) || [];
      expect(taskIds).toContain("sync-orders");
      expect(taskIds).toContain("sync-inventory");
      expect(taskIds).toContain("process-scheduled");
    });
  });

  describe("executeTask", () => {
    it("should execute task manually", async () => {
      const result = await caller.worker.executeTask({
        taskId: "sync-orders",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("executada");
    });

    it("should fail for non-existent task", async () => {
      const result = await caller.worker.executeTask({
        taskId: "non-existent-task",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("getRecommendations", () => {
    it("should get recommendations", async () => {
      const result = await caller.worker.getRecommendations({
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(0);
    });

    it("should respect limit", async () => {
      const result = await caller.worker.getRecommendations({
        limit: 5,
      });

      expect(result.success).toBe(true);
      expect(result.data?.length).toBeLessThanOrEqual(5);
    });
  });

  describe("dismissRecommendation", () => {
    it("should dismiss recommendation", async () => {
      // Primeiro obter uma recomendação
      const recsResult = await caller.worker.getRecommendations({ limit: 1 });

      if ((recsResult as any)?.data?.length > 0) {
        const recId = (recsResult as any).data[0].id;

        const result = await caller.worker.dismissRecommendation({
          recommendationId: recId,
        });

        expect(result.success).toBe(true);
        expect(result.message).toContain("descartada");
      }
    });
  });

  describe("getRecommendationHistory", () => {
    it("should get recommendation history", async () => {
      const result = await caller.worker.getRecommendationHistory({
        limit: 50,
      });

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.count).toBeGreaterThanOrEqual(0);
    });

    it("should respect limit", async () => {
      const result = await caller.worker.getRecommendationHistory({
        limit: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.length).toBeLessThanOrEqual(10);
    });
  });

  describe("clearOldRecommendations", () => {
    it("should clear old recommendations", async () => {
      const result = await caller.worker.clearOldRecommendations({
        hoursOld: 24,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("removidas");
    });
  });

  describe("getStats", () => {
    it("should get worker statistics", async () => {
      const result = await caller.worker.getStats();

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.isRunning).toBeDefined();
      expect(result.data?.taskCount).toBeGreaterThan(0);
      expect(result.data?.totalRecommendations).toBeGreaterThanOrEqual(0);
      expect(result.data?.unreadRecommendations).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getTaskDetails", () => {
    it("should get task details", async () => {
      const result = await caller.worker.getTaskDetails({
        taskId: "sync-orders",
      });

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe("sync-orders");
      expect(result.data?.name).toBeDefined();
      expect(result.data?.interval).toBeGreaterThan(0);
    });

    it("should fail for non-existent task", async () => {
      const result = await caller.worker.getTaskDetails({
        taskId: "non-existent",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
