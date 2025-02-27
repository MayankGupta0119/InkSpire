import { Prisma } from "@prisma/client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LikeButton from "./LikeButton";
import CommentList from "../comments/CommentList";
import CommentInput from "../comments/CommentInput";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type ArticleDetailPageProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = async ({
  article,
}) => {
  const { userId } = await auth();

  // Handle unauthenticated users
  if (!userId) {
    console.warn("User is not authenticated.");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold">
          Please log in to interact with the article.
        </h1>
      </div>
    );
  }

  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user is not found in the database, create a new user entry
  if (!user) {
    console.warn(
      `User with clerkUserId ${userId} not found in database. Creating new user.`
    );
    user = await prisma.user.create({
      data: { clerkUserId: userId },
    });
  }

  // Fetch comments related to the article
  const comments = await prisma.comment.findMany({
    where: { articleId: article.id },
    include: {
      author: {
        select: { name: true, email: true, imageUrl: true },
      },
    },
  });

  // Fetch likes related to the article
  const likes = await prisma.like.findMany({
    where: { articleId: article.id },
  });

  // Check if the logged-in user has liked the article
  const isLiked: boolean = likes.some((like) => like.userId === user?.id);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm">Web Dev</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={article.author.imageUrl || ""}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback>
                  {article.author.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm">
                  {article.createdAt.toDateString()} • 12 min read
                </p>
              </div>
            </div>
          </header>
          <section
            className="mb-12 max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article action button */}
          <LikeButton articleId={article.id} likes={likes} isLiked={isLiked} />

          <CommentInput articleId={article.id} />

          {/* Comment Section */}
          <CommentList comments={comments} />
        </article>
      </main>
    </div>
  );
};

export default ArticleDetailPage;
