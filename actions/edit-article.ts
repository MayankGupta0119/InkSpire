"use server";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export const editArticle = async (
  articleId: string,
  prevState: CreateArticleFormState,
  formData: FormData
) => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    content: formData.get("content"),
  });

  console.log(result);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  //checking if user is authenticated
  // const authres = await auth();
  // console.log(authres);
  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You must be logged in to create an article"],
      },
    };
  }

  const existingArticle = await prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });

  if (!existingArticle) {
    return {
      errors: {
        formErrors: ["Article not found"],
      },
    };
  }

  //the id returned from clerk auth is clerkUserId, now finding the actual userId object
  const existingUser = await prisma.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!existingUser || existingArticle.authorId !== existingUser.id) {
    return {
      errors: {
        formErrors: ["User not found"],
      },
    };
  }
  //start creating article

  const imageFile = formData.get("featuredImage") as File | null;
  let imageUrl = existingArticle.featuredImage;

  if (imageFile && imageFile.name !== "undefined") {
    try {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse: UploadApiResponse | undefined = await new Promise(
        (resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        }
      );

      if (uploadResponse?.secure_url) {
        imageUrl = uploadResponse.secure_url;
      } else {
        return {
          errors: {
            featuredImage: ["failded to upload the image"],
          },
        };
      }
    } catch (e) {
        return {
            errors:{
                formErrors:['Error while uploading the image, Please try again']
            }
        }
    }
  }

  if (!imageUrl) {
    return {
      errors: {
        featuredImage: ["Failed to upload image, Please try again"],
      },
    };
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        category: result.data.category,
        content: result.data.content,
        featuredImage: imageUrl,
        authorId: existingUser.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occured"],
        },
      };
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
};
