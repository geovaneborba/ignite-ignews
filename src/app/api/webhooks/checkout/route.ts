import stripe from "@/services/stripe";
import {
  saveSubscription,
  updateSubscription,
} from "@/utils/handleSubscriptions";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get("stripe-signature");

    const event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await updateSubscription(subscription.id);

            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;

            if (checkoutSession.subscription && checkoutSession.customer) {
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer?.toString()
              );
            }

            break;
          default:
            throw new Error("Unhandled event.");
        }
      } catch (error) {
        return NextResponse.json(
          {
            message: "Webhook handler failed.,",
          },
          {
            status: 500,
          }
        );
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
