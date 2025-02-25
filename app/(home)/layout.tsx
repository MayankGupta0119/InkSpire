import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import { headers } from "next/headers";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("next-url") || "/";
  const user = await currentUser();
  if (!user && pathname === "/") {
    return <>{children}</>; // Render login/signup page
  }
  if (!user) return null;

  //if user is already loggedin, then its data is already there in the database.
  const loggedInUser = await prisma.user.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  //if such user not found
  if (!loggedInUser) {
    await prisma.user.create({
      data: {
        name: user.fullName ?? "Unknown User", //this can be null, therefore expilcitly typecasting it to string.
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "no-email@example.com",
        imageUrl: user.imageUrl,
      },
    });
  }
  return <>{children}</>;
}
