import { db } from "@/lib/mongodb";
import stripe from "@/lib/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string
) {
  const user = await db.collection("users").findOne({
    stripe_customer_id: customerId,
  });

  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );

  const subscriptionData = {
    id: subscription.id,
    userId: user?._id,
    status: subscription.status as string,
    price_id: subscription.items.data[0].price.id,
  };

  await db.collection("subscription").insertOne(subscriptionData);
}

export async function updateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );

  const subscriptionData = {
    id: subscription.id,
    status: subscription.status as string,
    price_id: subscription.items.data[0].price.id,
  };

  await db.collection("subscription").updateOne(
    {
      id: subscriptionId,
    },
    {
      $set: subscriptionData,
    }
  );
}
