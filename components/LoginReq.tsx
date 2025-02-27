import Image from "next/image";
import React from "react";

export default function LoginReq() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
        You are not logged in, please login and try again
      </h1>
      <Image
        alt="Login required"
        src="/images/loginreq.png"
        width={400}
        height={400}
        className="w-auto max-w-full h-auto"
      />
    </div>
  );
}
