import React from "react";
import TextType from "../UI/TextType/TextType";
import InteractivePart from "../InteractivePart/InteractivePart";

const Main = () => {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full flex-col items-center">
        {/* Hero Text */}
        <div className="relative flex h-[60px] items-center justify-center text-foreground">
          <TextType
            textColors={["text-foreground"]}
            text={["Improve your links with Relinxr"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl"
          />
        </div>

        <p className="mt-6 max-w-xl text-center text-lg text-muted-foreground">
          Shorten, track, and manage your links with powerful analytics
        </p>

        {/* Link Shortener Card */}
        <div className="mt-12 w-full max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-10">
          <h1 className="mb-4 text-xl font-bold text-card-foreground">
            Shorten your link
          </h1>
          <InteractivePart />
        </div>
      </div>
    </div>
  );
};

export default Main;
