import AllArticles from "@/components/articles/AllArticles";
import SearchArticle from "@/components/articles/SearchArticle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchArticleByQuery } from "@/lib/query/fetchArticleByQuery";
import Link from "next/link";
import React, { Suspense } from "react";

type searchPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 6;

const page: React.FC<searchPageProps> = async ({ searchParams }) => {
  const searchText = (await searchParams).search || "";
  const currentPage = Number((await searchParams).page) || 1; // Default to 1 if not provided
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  return (
    <div className="min-h-screen bg-background">
      <main className="conatiner mx-auto px-4 py-12 sm:px-4 lg:text-5xl">
        {/* page header */}
        <div className="mb-12 space-y-6 text-center">
          <div className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center space-x-2">
              <span className="font-bold text-2xl">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                  Ink
                </span>
                <span className="text-foreground">Spire</span>
              </span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">All Articles</h1>
          {/* Search Bar */}
          <SearchArticle />
        </div>

        {/* All article cards  */}

        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticles articles={articles} />
        </Suspense>

        {/* pagination  */}

        <div className="mt-12 flex justify-center gap-2">
          <Link href={`?search=${searchText}&page=${currentPage - 1}`} passHref>
            <Button disabled={currentPage === 1} variant={"ghost"} size={"sm"}>
              ← Prev
            </Button>
          </Link>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              href={`?search=${searchText}&page=${index + 1}`}
              passHref
            >
              <Button
                variant={`${
                  currentPage === index + 1 ? "destructive" : "ghost"
                }`}
                size={"sm"}
              >
                {index + 1}
              </Button>
            </Link>
          ))}
          <Link href={`?search=${searchText}&page=${currentPage + 1}`} passHref>
            <Button
              disabled={currentPage === totalPages}
              variant={"ghost"}
              size={"sm"}
            >
              Next →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default page;

export const AllArticlesPageSkeleton = () => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="p-6">
            {/* Article Image Skeleton */}
            <Skeleton className="mb-4 h-48 w-full rounded-xl bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20" />

            {/* Article Title Skeleton */}
            <Skeleton className="h-6 w-3/4 rounded-lg" />

            {/* Article Category Skeleton */}
            <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />

            {/* Author & Metadata Skeleton */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Author Avatar Skeleton */}
                <Skeleton className="h-8 w-8 rounded-full" />

                {/* Author Name Skeleton */}
                <Skeleton className="h-4 w-20 rounded-lg " />
              </div>

              {/* Date Skeleton */}
              <Skeleton className="h-4 w-24 rounded-lg " />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
