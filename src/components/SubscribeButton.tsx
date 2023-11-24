"use client";
import { getStripeJs } from "@/lib/stripe-js";
import { signIn, useSession } from "next-auth/react";
import Stripe from "stripe";
import { useRouter } from "next/navigation";

export function SubscribeButton() {
  const session = useSession();
  const router = useRouter();
  console.log(session);

  const handleSubscribe = async () => {
    if (session.status === "unauthenticated") {
      await signIn("github");
      return;
    }

    if (session.data?.activeSubscription) {
      router.push("/posts");
      return;
    }

    try {
      const stripe = await getStripeJs();

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(session.data?.user?.email),
      });

      const data = (await response.json()) as Stripe.Checkout.Session;
      const sessionId = data.id;

      await stripe?.redirectToCheckout({
        sessionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      className="h-16 w-[260px] rounded-[2rem] bg-yellow-500 text-gray-900 text-xl font-bold flex items-center justify-center mt-[2.5rem] hover:brightness-75 hover:transition-all"
    >
      Subscribe Now
    </button>
  );
}
