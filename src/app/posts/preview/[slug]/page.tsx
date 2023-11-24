"use client";
import { Header } from "@/components/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SinglePost } from "@/components/SinglePost";
import { Suspense, useEffect } from "react";

type PostParams = {
  params: {
    slug: string;
  };
};

// export async function generateMetadata({ params: { slug } }: PostParams) {
//   const client = createClient();
//   const result = await client.getByUID("post", slug);
//   const title = result.data.title[0]?.text;

//   return {
//     title,
//   };
// }

export default function PostPreview({ params: { slug } }: PostParams) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${slug}`);
    }
  }, [session]);

  return (
    <>
      <Header />

      <main className="max-w-[1120px] my-0 mx-auto px-8">
        <Suspense>
          <SinglePost slug={slug} />
        </Suspense>
      </main>
    </>
  );
}
