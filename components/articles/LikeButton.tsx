"use client";
import React, { useOptimistic, useTransition } from "react";
import { Button } from "../ui/button";
import { Bookmark, Share2, ThumbsUp } from "lucide-react";
import { likeDislikeToggle } from "@/actions/like-dislike";
import { Like } from "@prisma/client";

type likeDislikeProps = {
  articleId: string;
  likes: Like[];
  isLiked: boolean;
};

const LikeButton: React.FC<likeDislikeProps> = ({
  articleId,
  likes,
  isLiked,
}) => {
  const [optimisticLike, setOptimisticLike] = useOptimistic(likes.length);
  const [isPending, startTransaction] = useTransition();

  const handleLikeDislike = async () => {
    startTransaction(async () => {
      setOptimisticLike(isLiked ? optimisticLike - 1 : optimisticLike + 1);
      await likeDislikeToggle(articleId);
    });
  };
  return (
    <div className="flex gap-4 mb-12 border-t pt-8">
      <form action={handleLikeDislike}>
        <Button
          disabled={isPending}
          type="submit"
          variant={"ghost"}
          className="gap-2"
        >
          <ThumbsUp className="w-5 h-5" />
          {optimisticLike}
        </Button>
      </form>
      <Button variant={"ghost"} className="gap-2">
        <Bookmark className="w-5 h-5" />
      </Button>
      <Button variant={"ghost"} className="gap-2">
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default LikeButton;
