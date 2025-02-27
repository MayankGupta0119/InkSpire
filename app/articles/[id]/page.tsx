import ArticleDetailPage from "@/components/articles/ArticleDetailPage";
import { prisma } from "@/lib/prisma";
import React from "react";

type ArticlePageProps = {
  params: { id: string }; // Remove Promise<>
};

const Page: React.FC<ArticlePageProps> = async ({ params }) => {
  const { id } = params; // `params` is already resolved, no need for `await`

  if (!id) {
    return <h1>Invalid Article ID</h1>;
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!article) {
      return <h1>Article Not Found</h1>;
    }

    return (
      <div>
        <ArticleDetailPage article={article} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching article:", error);
    return <h1>Something went wrong</h1>;
  }
};

export default Page;
