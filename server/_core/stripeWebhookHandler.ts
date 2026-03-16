import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Map product IDs to plan names
const PRODUCT_TO_PLAN: Record<string, "starter" | "professional" | "enterprise"> = {
  "prod_U9wPBa7HXAt6Wo": "starter",
  "prod_U9wRtBfXhx1vHg": "professional",
  "prod_U9wSEBy7So53A8": "enterprise",
};

export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("[Stripe] Checkout session completed:", session.id);

  const customerEmail = session.customer_email;
  if (!customerEmail) {
    console.error("[Stripe] No customer email found in session");
    return;
  }

  // Get product ID from line items
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
  const productId = lineItems.data[0]?.price?.product as string;
  const plan = PRODUCT_TO_PLAN[productId] || "starter";

  console.log(`[Stripe] Creating user for ${customerEmail} with plan: ${plan}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("[Stripe] Subscription created:", subscription.id);

  const customerEmail = (subscription.customer as any)?.email;
  if (!customerEmail) {
    console.error("[Stripe] No customer email found in subscription");
    return;
  }

  const productId = subscription.items.data[0]?.price?.product as string;
  const plan = PRODUCT_TO_PLAN[productId] || "starter";

  console.log(`[Stripe] Subscription created for ${customerEmail} with plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("[Stripe] Subscription updated:", subscription.id);

  const customerEmail = (subscription.customer as any)?.email;
  if (!customerEmail) {
    console.error("[Stripe] No customer email found in subscription");
    return;
  }

  const productId = subscription.items.data[0]?.price?.product as string;
  const plan = PRODUCT_TO_PLAN[productId] || "starter";

  console.log(`[Stripe] Plan updated for ${customerEmail}: ${plan}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("[Stripe] Subscription deleted:", subscription.id);

  const customerEmail = (subscription.customer as any)?.email;
  if (!customerEmail) {
    console.error("[Stripe] No customer email found in subscription");
    return;
  }

  console.log(`[Stripe] Subscription cancelled for ${customerEmail}`);
}

export async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): Promise<Stripe.Event> {
  return stripe.webhooks.constructEvent(body, signature, secret);
}
