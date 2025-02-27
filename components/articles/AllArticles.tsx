import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search } from "lucide-react";
import type { Prisma } from "@prisma/client";

type allArticlesPageProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          imageUrl: true;
          email: true;
        };
      };
    };
  }>[];
};

const AllArticles: React.FC<allArticlesPageProps> = async ({ articles }) => {
  if (articles.length <= 0) {
    return <NoArticles />;
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Card
          key={article.id}
          className="group relative overflow-hidden translate-all hover:shadow-lg"
        >
          <div className="p-6 ">
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={article.featuredImage}
                alt="image"
                fill
                className="object-cover"
              />
            </div>
            {/* Article Content */}
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-sm">{article.category}</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={article.author.imageUrl || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-sm">{article.author.name}</span>
              </div>

              <div className=" text-sm ">
                {article.createdAt.toDateString()}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AllArticles;

const NoArticles = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 " />
      </div>
      <h1 className="font-bold ">No Articles Found</h1>
      <p className="mt-2">
        We could not find any related articles matching your search
      </p>
    </div>
  );
};
