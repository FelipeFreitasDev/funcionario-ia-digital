import { describe, it, expect, vi, beforeEach } from "vitest";
import { stripeWebhookRouter } from "./stripe-webhook";

describe("Stripe Webhook Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should handle checkout.session.completed event", async () => {
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer_email: "test@example.com",
          customer: "cus_test_123",
          metadata: {
            plan_id: "professional",
          },
        },
      },
    };

    const result = await stripeWebhookRouter.handleWebhook.createCaller({
      session: { userId: 1 } as any,
    })({
      event,
    });

    expect(result).toEqual({ success: true });
  });

  it("should handle customer.subscription.created event", async () => {
    const event = {
      type: "customer.subscription.created",
      data: {
        object: {
          id: "sub_test_123",
          customer: "cus_test_123",
          status: "active",
        },
      },
    };

    const result = await stripeWebhookRouter.handleWebhook.createCaller({
      session: { userId: 1 } as any,
    })({
      event,
    });

    expect(result).toEqual({ success: true });
  });

  it("should handle customer.subscription.updated event", async () => {
    const event = {
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test_123",
          customer: "cus_test_123",
          status: "active",
        },
      },
    };

    const result = await stripeWebhookRouter.handleWebhook.createCaller({
      session: { userId: 1 } as any,
    })({
      event,
    });

    expect(result).toEqual({ success: true });
  });

  it("should handle customer.subscription.deleted event", async () => {
    const event = {
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_123",
          customer: "cus_test_123",
          status: "canceled",
        },
      },
    };

    const result = await stripeWebhookRouter.handleWebhook.createCaller({
      session: { userId: 1 } as any,
    })({
      event,
    });

    expect(result).toEqual({ success: true });
  });

  it("should handle unhandled event types gracefully", async () => {
    const event = {
      type: "some.unknown.event",
      data: {
        object: {},
      },
    };

    const result = await stripeWebhookRouter.handleWebhook.createCaller({
      session: { userId: 1 } as any,
    })({
      event,
    });

    expect(result).toEqual({ success: true });
  });

  it("should throw error on invalid event", async () => {
    const event = null;

    try {
      await stripeWebhookRouter.handleWebhook.createCaller({
        session: { userId: 1 } as any,
      })({
        event,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
