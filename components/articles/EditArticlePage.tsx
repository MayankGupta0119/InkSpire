"use client";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import "react-quill-new/dist/quill.snow.css";
import type { Article } from "@prisma/client";
import { editArticle } from "@/actions/edit-article";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type EditArticleProps = {
  article: Article;
};

export const EditArticlePage: React.FC<EditArticleProps> = ({ article }) => {
  const [formState, action, isPending] = useActionState(
    editArticle.bind(null, article.id),
    {
      errors: {}, // Ensure correct type
    }
  );
  const [content, setContent] = useState(article.content);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("content", content);
    startTransition(() => {
      action(formData);
    });
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
                placeholder="Enter title of the article"
                defaultValue={article.title}
              ></Input>
              {formState.errors.title && (
                <span className="text-red-600 text-sm">
                  {formState.errors.title[0]}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <select
                name="category"
                id="category"
                defaultValue={article.category}
                className="flex h-10 w-full rounded-md"
              >
                <option value="">Select Category</option>
                <option value="technology">Technology</option>
                <option value="business">Business</option>
                <option value="fashion">Fashion </option>
                <option value="food">Food </option>
                <option value="travel">Travel </option>
                <option value="health">Health</option>
                <option value="fitness">Fitness</option>
                <option value="lifestyle">Lifestyle </option>
                <option value="finance">Finance </option>
                <option value="craft">Craft</option>
                <option value="parenting">Parenting </option>
                <option value="political">Political </option>
                <option value="educational">Educational </option>
                <option value="photography">Photography </option>
                <option value="music">Music </option>
                <option value="sports">Sports </option>
                <option value="environmental">Environmental </option>
                <option value="gaming">Gaming </option>
                <option value="pet">Pet </option>
                <option value="news">News </option>
                <option value="art">Art </option>
                <option value="literature">Literature </option>
                <option value="automotive">Automotive </option>
                <option value="realestate">RealEstate </option>
                <option value="legal">Legal </option>
                <option value="web-dev">Web Development </option>
                <option value="ai">AI</option>
                <option value="ml">ML </option>
                <option value="fullstack">FullStack </option>
                <option value="networking">Networking</option>
                <option value="mlops">MlOps </option>
                <option value="fintech">FinTech </option>
                <option value="startups">StartUps</option>
              </select>
              {formState.errors.category && (
                <span className="text-red-600 text-sm">
                  {formState.errors.category[0]}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="featuredImage">Featured Image</Label>
              <Input
                type="file"
                id="featuredImage"
                name="featuredImage"
                accept="image/*"
              />
              <div className="mb-4">
                {article.featuredImage && (
                  <img
                    src={article.featuredImage}
                    alt="prev_image"
                    className="w-48 h-32 object-cover rounded-md"
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill theme="snow" value={content} onChange={setContent} />
              {formState.errors.content && (
                <span className="text-red-600 text-sm">
                  {formState.errors.content[0]}
                </span>
              )}
            </div>
            <div className="flex justify-end gap-4">
              <Button variant={"outline"}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Edit Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
