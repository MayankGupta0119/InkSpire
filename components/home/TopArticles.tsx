import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { prisma } from "@/lib/prisma";

export default async function TopArticles() {
  const article = await prisma.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });
  // console.log("-------aritcles-----", article);
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {article.slice(0, 3).map((article) => (
        <Card
          className={cn(
            "group relative overflow-hidden transition-all hover:scale-[1.02]",
            "border border-gray-200/50 dark:border-white/10",
            "bg-white/50 dark:bg-gray-900/50"
          )}
          key={article.id}
        >
          <div className="p-6">
            <Link href={`/articles/${article.id}`}>
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                <Image
                  src={article.featuredImage}
                  alt="article"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={article.author.imageUrl || ""} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{article.author.name}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {article.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {article.category}
              </p>
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{article.createdAt.toDateString()}</span>
                <span>{5} min to read</span>
              </div>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
