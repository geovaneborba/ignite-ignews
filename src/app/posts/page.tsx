import { Header } from "@/components/Header";
import { authOptions } from "@/lib/auth-options";
import { createClient } from "@/lib/prismicio";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { RichText } from "prismic-dom";

type ExcerptType = {
  type: string;
  text: string;
};

export const metadata: Metadata = {
  title: "Posts | Ignews",
};

export default async function Post() {
  const session = await getServerSession(authOptions);

  console.log(session?.activeSubscription?.status);

  const client = createClient();

  const results = await client.getAllByType("post");

  // eslint-disable-next-line
  const posts = results.map((result) => {
    return {
      slug: result.uid,
      title: RichText.asText(result.data.title),
      excerpt: result.data.content.find(
        (content) => content.type === "paragraph"
      ) as ExcerptType,
      updatedAt: new Date(result.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return (
    <>
      <Header />

      <main className="max-w-[1120px] my-0 mx-auto px-8">
        <div className="max-w-[720px] mt-[5rem] mx-auto mb-0">
          {posts.map((post) => (
            <Link
              href={
                session?.activeSubscription?.status === "active"
                  ? `/posts/${post.slug}`
                  : `/posts/preview/${post.slug}`
              }
              key={post.slug}
              className="block mt-8 pt-8 border-t border-t-gray-700 first:border-t-0 first:mt-0 first:pt-0"
            >
              <time className="text-base flex items-center text-gray-300">
                {post.updatedAt}
              </time>
              <strong className="block text-2xl mt-4 leading-[2rem] hover:text-yellow-500 transition-colors">
                {post.title}
              </strong>
              <p className="text-gray-300 mt-[0.5rem] leading-[1.625rem]">
                {post.excerpt.text}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
