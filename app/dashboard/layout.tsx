import LeftSideBar from "@/components/dashboard/LeftSideBar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <div className="flex">
        <LeftSideBar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
