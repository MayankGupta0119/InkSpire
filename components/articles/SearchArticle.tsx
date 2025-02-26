import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

export default function SearchArticle() {
  return (
    <form className="mx-auto max-w-2xl">
      <div className="relative ">
        <Search className="w-5 h-5 absolute letf-3 top-1/2 -translate-y-1/2" />
        <Input
          className="w-full pl-10 pr-4 py-6 text-lg"
          type="text"
          name="search"
          placeholder="Search Articles"
        />
      </div>
    </form>
  );
}
