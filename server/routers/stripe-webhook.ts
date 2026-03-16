import { publicProcedure } from "../_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { getDb } from "../db";
import { sendConfirmationEmail } from "../_core/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const stripeWebhookRouter = {
  handleWebhook: publicProcedure
    .input(
      z.object({
        event: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const event = input.event;

        switch (event.type) {
          case "checkout.session.completed":
            await handleCheckoutSessionCompleted(event.data.object);
            break;

          case "customer.subscription.created":
            await handleSubscriptionCreated(event.data.object);
            break;

          case "customer.subscription.updated":
            await handleSubscriptionUpdated(event.data.object);
            break;

          case "customer.subscription.deleted":
            await handleSubscriptionDeleted(event.data.object);
            break;

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        return { success: true };
      } catch (error) {
        console.error("[Stripe Webhook Error]", error);
        throw error;
      }
    }),
};

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: any): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  try {
    const email = session.customer_email;
    const planId = session.metadata?.plan_id || "professional";
    const customerId = session.customer;

    if (!email) {
      console.error("Missing email in session");
      return;
    }

    // For now, just log the successful payment
    console.log(
      `[Stripe] Checkout completed: ${email} with plan ${planId}`,
      {
        customerId,
        sessionId: session.id,
      }
    );

    // Send confirmation email
    await sendConfirmationEmail(email, 0, planId);
  } catch (error) {
    console.error("[Stripe] Error handling checkout session:", error);
    throw error;
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(subscription: any): Promise<void> {
  try {
    console.log(`[Stripe] Subscription created: ${subscription.id}`, {
      customerId: subscription.customer,
      status: subscription.status,
    });
  } catch (error) {
    console.error("[Stripe] Error handling subscription created:", error);
    throw error;
  }
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  try {
    console.log(`[Stripe] Subscription updated: ${subscription.id}`, {
      status: subscription.status,
    });
  } catch (error) {
    console.error("[Stripe] Error handling subscription updated:", error);
    throw error;
  }
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(subscription: any): Promise<void> {
  try {
    console.log(`[Stripe] Subscription cancelled: ${subscription.id}`, {
      customerId: subscription.customer,
    });
  } catch (error) {
    console.error("[Stripe] Error handling subscription deleted:", error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): any {
  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);
    return event;
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}
