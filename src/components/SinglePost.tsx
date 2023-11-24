import { createClient } from "@/lib/prismicio";
import { PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import { RichText } from "prismic-dom";

type SinglePostProps = {
  slug: string;
};

export const revalidate = 60 * 30; // 30 minutos

export async function SinglePost({ slug }: SinglePostProps) {
  const client = createClient();

  const result = await client.getByUID("post", slug);

  const post = {
    slug,
    title: RichText.asText(result.data.title),
    content: result.data.content.slice(0, 3),
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
    <article className="max-w-[720px] mt-20 mx-auto mb-0 ">
      <h1 className="text-[3.5rem] font-black">{post.title}</h1>
      <time className="text-base text-gray-300 mt-6">{post.updatedAt}</time>
      <div className="mt-8 leading-[2rem] text-lg from-white to-black bg-gradient-to-b bg-clip-text text-transparent">
        <PrismicRichText
          field={post.content as any}
          components={{
            paragraph: ({ children }) => <p className="my-6 ">{children}</p>,
            list: ({ children }) => (
              <ul className="my-6 pl-6 list-disc">{children}</ul>
            ),
            listItem: ({ children }) => (
              <li className="my-[0.5rem] mx-0">{children}</li>
            ),
          }}
        />
        <span className="flex p-8 items-center justify-center text-gray-100 bg-gray-850 text-lg font-bold rounded-[100px] my-16 mx-8">
          Wanna continue reading ?
          <Link
            href="/"
            className="text-yellow-500 ml-[0.5rem] hover:underline"
          >
            Subscribe now 🤗
          </Link>
        </span>
      </div>
    </article>
  );
}
