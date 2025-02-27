import React from "react";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[600px] w-full overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/images/homebg.jpg')" }}
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 before:absolute before:left-1/4 
        before:top-0 before:h-[500px] before:w-[500px] before:rounded-full
        before:bg-gradient-to-r before:from-yellow-500/20 before:to-orange-500/20 before:blur-3xl"
      />
      <div className="conatiner relative mx-auto flex h-full flex-col items-center justify-center px-4 py-24 md:flex-row md:py-32">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl md:text-6xl">
            Explore the world through
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-extrabold">
              {" "}
              words
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 md:text-xl">
            Discover Insightfull Articles, thought-provoking stories, and expret
            prespectives on technology, lifestyle and innovations
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Button className="rounded-full text-lg">Start Reading</Button>
            <Button className="rounded-full text-lg" variant={"outline"}>
              Explore Topics
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-8 text-black md:max-w-md">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary text-black">
                1k+
              </div>
              <div className="text-sm text-gray-600">Published Articles</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary text-black">
                50+
              </div>
              <div className="text-sm text-gray-600">Expert Writers</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary text-black">
                10M
              </div>
              <div className="text-sm text-gray-600">Monthly Readers</div>
            </div>
          </div>
          {/* Image Frame */}
        </div>
        {/* <div className="mt-12 flex-1 md:mt-0">
          <div
            className={cn(
              "realtive mx-auto w-64 h-64 rounded-2xl overflow-hidden",
              "bg-gradient-to-br from-white/5 to-transparent",
              "border border-primary/20 backdrop-blur-lg",
              "shadow-2xl shadow-indigo-500/10"
            )}
          >
            <Image
              src="https://images.unsplash.com/photo-1740165886179-c2be3d6447ca?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="hero-image"
              fill
              className="object-cover"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}
