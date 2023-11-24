import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { db } from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        const existingUser = await db.collection("users").findOne({
          email: session?.user?.email?.toLocaleLowerCase(),
        });

        const userActiveSubscription = await db
          .collection("subscription")
          .findOne({
            userId: existingUser?._id,
            status: "active",
          });

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        {
          return {
            ...session,
            activeSubscription: null,
          };
        }
      }
    },
    async signIn(data) {
      const { user } = data;

      try {
        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (!existingUser) {
          await db.collection("users").insertOne({
            email: user.email?.toLocaleLowerCase(),
          });
        }

        return true;
      } catch (error) {
        return false;
      }
    },
  },
};
