import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Clock, FileText, MessageCircle, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RecentArticless } from "./RecentArticless";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export default async function BlogDashboard() {
  const { userId } = await auth();

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId as string },
  });

  if (!existingUser) {
    return <p>User not found.</p>;
  }
  // getting all articles to show
  const articles = await prisma.article.findMany({
    where: { authorId: existingUser.id },
    orderBy: { createdAt: "desc" },
    include: {
      comments: true,
      author: { select: { name: true, email: true, imageUrl: true } },
    },
  });

  //getting totalcomments
  const totalcomments = await prisma.comment.findMany({
    where: { article: { authorId: existingUser.id } },
  });

  const totalLIkes = await prisma.like.findMany({
    where: { article: { authorId: existingUser.id } },
  });
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-bold text-2xl"></h1>
          <p></p>
        </div>

        <Link href={"/dashboard/articles/create"}>
          <Button>
            <PlusCircle className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid md:grid-cols-3 mb-8 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="font-medium text-sm">
              Total Articles
            </CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +{articles.length} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="font-medium text-sm">
              Total Comments
            </CardTitle>
            <MessageCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalcomments.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalcomments.length} awaiting moderation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
            <CardTitle className="font-medium text-sm">Total Likes</CardTitle>
            <Clock className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLIkes.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {totalLIkes.length} from last month
            </p>
          </CardContent>
        </Card>
      </div>
      {/* <h1>Recent Articles</h1> */}
      <RecentArticless articles={articles} />
    </main>
  );
}
