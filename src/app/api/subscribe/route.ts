import stripe from "@/services/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/services/mongodb";

export async function POST(request: Request) {
  const email = await request.json();

  const user = await db.collection("users").findOne({
    email: email,
  });

  let customerId = user?.stripe_customer_id;

  //* se não existir o id do stripe no usuário então cria um novo usuário no stripe
  if (!customerId) {
    const stripeCustomer = await stripe.customers.create({
      email,
    });

    //* atualiza o usuário no mongodb com o novo id do stripe
    await db.collection("users").updateOne(
      {
        _id: user?._id,
      },
      {
        $set: {
          stripe_customer_id: stripeCustomer.id,
        },
      }
    );

    //* atribui o novo id
    customerId = stripeCustomer.id;
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1NxYNgCTTBhxRfRR65eYdqoB", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL || "",
      cancel_url: process.env.STRIPE_CANCEL_URL || "",
    });

    return NextResponse.json(checkoutSession);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    }
  }
}
