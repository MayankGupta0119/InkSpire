import UserArticles from "@/components/articles/UserArticles";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function page() {
  return (
    <div>
      <UserArticles />
    </div>
  );
}
