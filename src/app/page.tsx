import { Header } from "@/components/Header";
import { Metadata } from "next";
import Image from "next/image";

import girlCodingAvatar from "@/assets/images/avatar.svg";
import { SubscribeButton } from "@/components/SubscribeButton";
import stripe from "@/lib/stripe";
import { priceFormatter } from "@/utils/priceFormatter";

export const metadata: Metadata = {
  title: "Home | ig.news",
};

export const revalidate = 60 * 60 * 24; // 24 hours

export default async function Home() {
  const price = await stripe.prices.retrieve("price_1NxYNgCTTBhxRfRR65eYdqoB");

  return (
    <>
      <Header />

      <main className="flex items-center justify-between max-w-[1128px] mx-auto px-8 mt-24">
        <section className="m-w-[600px]">
          <span className="text-[1.5rem] font-bold">👏 Hey, welcome</span>
          <h1 className="text-[4.5rem] leading-[4.5rem] font-extrabold mt-[2.5rem]">
            News about <br /> the <span className="text-cyan-500">React</span>{" "}
            world.
          </h1>
          <p className="text-[1.5rem] leading-[2.25rem] mt-[1.5rem]">
            Get access to all the publications <br />
            <span className="text-cyan-500 font-bold">
              for{" "}
              {price.unit_amount
                ? priceFormatter(price.unit_amount / 100)
                : null}{" "}
              month
            </span>
          </p>
          <SubscribeButton />
        </section>
        <Image src={girlCodingAvatar} alt="Girl Coding" />
      </main>
    </>
  );
}
