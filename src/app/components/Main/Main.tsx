import React from "react";
import TextType from "../UI/TextType/TextType";
import InteractivePart from "../InteractivePart/InteractivePart";

const Main = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex w-full flex-col items-center uppercase">
        <div className="relative h-[60px] flex items-center justify-center">
          <TextType
            text={["Improve your links with Relinxr"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter="|"
            className="text-4xl font-bold text-black text-center"
          />
        </div>

        <div className="mt-20 w-full max-w-2xl self-center rounded-2xl border-2 p-10">
          <h1 className="mb-3 font-bold normal-case">Shorten your link</h1>
          <InteractivePart />
        </div>
      </div>
    </div>
  );
};

export default Main;