"use client";
import React, { startTransition, useTransition } from "react";
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
import { useFormStatus } from "react-dom";
import { deleteArticle } from "@/actions/delete-article";

type recentArticleProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      comments: true;
      author: { select: { name: true; email: true; imageUrl: true } };
    };
  }>[];
};

export const RecentArticless: React.FC<recentArticleProps> = ({ articles }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Articles</CardTitle>
          <Button
            className="text-muted-foreground"
            size={"sm"}
            variant={"ghost"}
          >
            View All →
          </Button>
        </div>
      </CardHeader>

      {!articles.length ? (
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
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      className="rounded-full bg-green-100 text-gray-800"
                      variant={"outline"}
                    >
                      Published
                    </Badge>
                  </TableCell>
                  <TableCell>{article.comments.length}</TableCell>
                  <TableCell>{article.createdAt.toDateString()}</TableCell>
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

type deleteButtonProps = {
  articleId: string;
};

const DeleteButton: React.FC<deleteButtonProps> = ({ articleId }) => {
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
