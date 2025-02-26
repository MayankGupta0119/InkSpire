import { EditArticlePage } from "@/components/articles/EditArticlePage";
import { prisma } from "@/lib/prisma";
import React from "react";

type editArticlePageProps = {
  params: Promise<{ id: string }>;
};

const page: React.FC<editArticlePageProps> = async ({ params }) => {
  const id = (await params).id;
  const article = await prisma.article.findUnique({
    where: {
      id: id,
    },
  });

  if (!article) {
    return <h1>Article Not found</h1>;
  }
  return (
    <div>
      <EditArticlePage article={article} />
    </div>
  );
};

export default page;
