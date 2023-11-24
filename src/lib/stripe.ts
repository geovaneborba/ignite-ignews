import Stripe from "stripe";
import packageJson from "../../package.json";

const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2023-08-16",
  appInfo: {
    name: "ignews",
    version: packageJson.version,
  },
});

export default stripe;
