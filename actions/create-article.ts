"use server";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { redirect } from "next/navigation";
import { z } from "zod";

const createArticleSchema = z.object({
  title: z.string().min(3).max(100),
  category: z.string().min(3).max(50),
  content: z.string().min(10),
});

type CreateArticleFormState = {
  errors: {
    title?: string;
    category?: string;
    content?: string;
    featuredImage?: string;
    formErrors?: string;
  };
};

export const createArticle = async (
  prevState: CreateArticleFormState,
  formData: FormData
) => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  //checking if user is authenticated
  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You must be logged in to create an article"],
      },
    };
  }

  //start creating article
  redirect("/dashboard");
};
