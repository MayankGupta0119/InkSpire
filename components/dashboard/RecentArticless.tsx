"use client";
import React, { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Prisma } from "@prisma/client";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook
import { deleteArticle } from "@/actions/delete-article";

type RecentArticleProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      comments: true;
      author: { select: { name: true; email: true; imageUrl: true } };
    };
  }>[];
};

export const RecentArticless: React.FC<RecentArticleProps> = ({ articles }) => {
  const { user } = useUser(); // Get the current logged-in user

  if (!user) {
    return (
      <CardContent>You must be logged in to view your articles.</CardContent>
    );
  }

  // Filter articles to show only the ones created by the logged-in user
  const userArticles = articles.filter(
    (article) => article.author.email === user.primaryEmailAddress?.emailAddress
  );

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Recent Articles</CardTitle>
          <Button
            className="text-muted-foreground"
            size={"sm"}
            variant={"ghost"}
          >
            View All →
          </Button>
        </div>
      </CardHeader>

      {!userArticles.length ? (
        <CardContent>No Articles Found</CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Link href={`/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-full bg-green-100 text-gray-800"
                      variant={"outline"}
                    >
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell>{article.comments.length}</TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Button variant={"ghost"} size={"sm"}>
                          Edit
                        </Button>
                      </Link>
                      <DeleteButton articleId={article.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

type DeleteButtonProps = {
  articleId: string;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ articleId }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        startTransition(async () => {
          await deleteArticle(articleId);
        });
      }}
    >
      <Button disabled={isPending} variant={"ghost"} size={"sm"}>
        {isPending ? "Loading..." : "Delete"}
      </Button>
    </form>
  );
};
