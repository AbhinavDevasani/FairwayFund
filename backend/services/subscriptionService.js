import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_123");

export const createStripeSession = async (user, plan, amount) => {
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Digital Heroes ${plan} Subscription`,
          },
          unit_amount: Math.round(amount * 100),
          recurring: {
            interval: plan === "monthly" ? "month" : "year",
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/cancel`,
    client_reference_id: user._id.toString(),
  });

  return session;
};
