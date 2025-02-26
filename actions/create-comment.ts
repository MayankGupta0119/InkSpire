"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommentSchema = z.object({
  body: z.string().min(1),
});

type createCommentFormState = {
  errors: {
    body?: string[];
    formErrors?: string[];
  };
};
export const createComment = async (
  articleId: string,
  prevState: createCommentFormState,
  formData: FormData
): Promise<createCommentFormState> => {
  const result = createCommentSchema.safeParse({ body: formData.get("body") });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You must be logged in to comment"],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!existingUser) {
    return {
      errors: {
        formErrors: ["User not found"],
      },
    };
  }

  try {
    await prisma.comment.create({
      data: {
        body: result.data.body,
        authorId: existingUser.id,
        articleId,
      },
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        errors: {
          formErrors: [e.message],
        },
      };
    }
    return {
      errors: {
        formErrors: ["An unexpected error occurred while adding comment"],
      },
    };
  }
  revalidatePath(`/articles/${articleId}`);
  return { errors: {} };
};
