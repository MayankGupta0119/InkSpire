import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AllArticles() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="group relative overflow-hidden translate-all hover:shadow-lg">
        <div className="p-6 ">
          <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
            <Image
              src={
                "https://plus.unsplash.com/premium_photo-1673139285535-80a03340beda?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="image"
              fill
              className="object-cover"
            />
          </div>
          {/* Article Content */}
          <h2 className="text-xl font-semibold">Title</h2>
          <p className="mt-2">web-dev</p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-sm">Mayank Gupta</span>
            </div>

            <div className=" text-sm ">12 feb</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
