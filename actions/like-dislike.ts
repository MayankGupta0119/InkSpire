"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const likeDislikeToggle = async (articleId: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to like or dislike an article");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const existingLike = await prisma.like.findFirst({
    where: {
      articleId: articleId,
      userId: user.id,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.like.create({
      data: {
        articleId: articleId,
        userId: user.id,
      },
    });
  }

  revalidatePath(`/articles/${articleId}`);
};
