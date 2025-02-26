import ArticleDetailPage from "@/components/articles/ArticleDetailPage";
import { prisma } from "@/lib/prisma";
import React from "react";

type articlePageProps = {
  params: Promise<{ id: string }>;
};
const page: React.FC<articlePageProps> = async ({ params }) => {
  const id = (await params).id;
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
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
};

export default page;
