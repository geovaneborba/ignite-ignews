import { Header } from "@/components/Header";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@/lib/prismicio";
import { PrismicRichText } from "@prismicio/react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { RichText } from "prismic-dom";

type PostParams = {
  params: {
    slug: string;
  };
};

export const revalidate = 60 * 30; // 30 minutos

export async function generateMetadata({ params: { slug } }: PostParams) {
  const client = createClient();
  const result = await client.getByUID("post", slug);
  const title = result.data.title[0]?.text;

  return {
    title,
  };
}

export default async function Post({ params: { slug } }: PostParams) {
  const session = await getServerSession(authOptions);

  if (!session?.activeSubscription) {
    redirect("/");
  }

  const client = createClient();

  const result = await client.getByUID("post", slug);

  const post = {
    slug,
    title: RichText.asText(result.data.title),
    content: result.data.content,
    updatedAt: new Date(result.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return (
    <>
      <Header />

      <main className="max-w-[1120px] my-0 mx-auto px-8">
        <article className="max-w-[720px] mt-20 mx-auto mb-0 ">
          <h1 className="text-[3.5rem] font-black">{post.title}</h1>
          <time className="text-base text-gray-300 mt-6">{post.updatedAt}</time>
          <div className="mt-8 leading-[2rem] text-lg text-gray-100">
            <PrismicRichText
              field={post.content}
              components={{
                paragraph: ({ children }) => (
                  <p className="my-6 ">{children}</p>
                ),
                list: ({ children }) => (
                  <ul className="my-6 pl-6 list-disc">{children}</ul>
                ),
                listItem: ({ children }) => (
                  <li className="my-[0.5rem] mx-0">{children}</li>
                ),
              }}
            />
          </div>
        </article>
      </main>
    </>
  );
}
