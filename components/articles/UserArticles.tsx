import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import AllArticles from "./AllArticles";

const UserArticles = async () => {
  const { userId } = await auth(); //returns clerkUserId
  if (!userId) {
    return <div>You must be logged in to view your articles</div>;
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!existingUser) {
    return <div>User not found</div>;
  }
  const userArticles = await prisma.article.findMany({
    where: {
      authorId: existingUser?.id,
    },
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
          email: true,
        },
      },
    },
  });
  if (userArticles.length <= 0) {
    return <div>No articles found</div>;
  }
  return (
    <div>
      <AllArticles articles={userArticles} />
    </div>
  );
};

export default UserArticles;
