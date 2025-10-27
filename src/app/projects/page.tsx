"use client";

// import React, { useMemo, useState } from "react";
import TextType from "@/app/components/UI/TextType/TextType";
import Link from "next/link";
// import Image from "next/image";
import ProjectCard from "../components/ProjectCard/ProjectCard";


export default function LinksClient() {

  return (
    <div className="container text-primary-text mx-auto px-4 mt-40">
      <div className="flex justify-between  md:flex-row w-full mb-10 gap-5">
        <div className="flex flex-col">
          <TextType
            textColors={["text-primary-text"]}
            text={["Projects"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-4xl text-primary-text text-center md:text-left"
          />
          <TextType
            textColors={["text-primary-text"]}
            text={["Orgranize your links into projects for better management"]}
            typingSpeed={30}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-start text-gray-500 mt-2"
          />
        </div>
        <div className="flex mt-5 justify-center justfiy-self-center w-full sm:w-1/3 lg:w-1/5 self-center rounded-2xl border p-2 font-semibold
                            transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                            active:translate-y-0 active:shadow-md
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
              <Link href="/" prefetch={false} className="w-full h-full text-center">
                Add project
              </Link>
            </div>
      </div>

      {/* <input
        name="search"
        type="text"
        placeholder="Search"
        className="h-11 w-full rounded-2xl border px-4 mt-3 outline-none transition
                   focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
      /> */}
      <div className="mt-10 flex items-center flex-wrap gap-5 w-full justify-center md:justify-start">
      <ProjectCard color="gray" title="youtube channel"/>
      <ProjectCard color="lavender" title="Lavender Folder"/>
      <ProjectCard color="peach" title="Peach Folder"/>
      {/* <ProjectCard color="mint" title="Sand Folder"/> */}
      {/* <ProjectCard color="mint" title="Gray Folder"/>
      <ProjectCard color="lavender" title="Blue Folder"/>
      <ProjectCard color="mint" title="Cyan Folder"/> */}
      </div>
    </div>
  );
}