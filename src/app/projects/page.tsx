// "use client";

// // import React, { useMemo, useState } from "react";
// import TextType from "@/app/components/UI/TextType/TextType";
// // import Image from "next/image";
// import ProjectCard from "../components/ProjectCard/ProjectCard";
// import { useEffect, useState } from "react";
// import Modal from "../components/ProjectModal/ProjectModal";
// import colorMap from "@/app/utils/colorMap";
// import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";


// interface Session {
//   id: string;
//   // Add other session properties as needed
// }


// export default function LinksClient() {
//   const cards = [
//     { color: "gray", title: "Gray Folder" },
//     { color: "lavender", title: "Blue Folder" },
//     { color: "mint", title: "Cyan Folder" },
//     { color: "peach", title: "Sand Folder" },
//   ];
//   // стейты
// const [open, setOpen] = useState(false);
// const [title, setTitle] = useState("");
// const [description, setDescription] = useState("");
// const [color, setColor] = useState("#A5D8FF"); // дефолт — голубой из colorMap
// const [session, setSession] = useState<Session | null>(null);



// useEffect(() => {
//   (async () => {
//     try {
//       const res = await fetch("/api/auth/me", { cache: "no-store" });
//       const data = await res.json();
//       console.log("Session data:", data.user);
//       console.log("type of data.user.id:", typeof data.user?.id);
//       if (res.ok && data.ok) setSession(data.user as Session);
//       else setSession(null);
//     } catch {
//       setSession(null);
//     }

//   })();
// }, []);

// async function onSubmit(e?: React.FormEvent) {
//   e?.preventDefault?.();

//   if (!session?.id) {
//     alert("You must be logged in to create a project.");
//     return;
//   }

//   try {
//     const res = await fetch("/api/project", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: session.id,   // 👈 добавили сюда!
//         title,
//         description,
//         color,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

//     console.log("✅ New project created:", data);
//   } catch (error) {
//     console.error("❌ Error creating project:", error);
//   }
// }

//   const colors = Object.values(colorMap).map(col => col.iconBg.match(/#([0-9A-Fa-f]{3,6})/)?.[0] ?? "");
//   return (

    
//     <div className="container text-primary-text mx-auto px-4 mt-40">
//       <div className="flex justify-between  md:flex-row w-full mb-10 gap-5">
//         <div className="flex flex-col">
//           <TextType
//             textColors={["text-primary-text"]}
//             text={["Projects"]}
//             typingSpeed={25}
//             pauseDuration={1500}
//             showCursor
//             cursorCharacter=""
//             className="text-4xl text-primary-text text-center md:text-left"
//           />
//           <TextType
//             textColors={["text-primary-text"]}
//             text={["Orgranize your links into projects for better management"]}
//             typingSpeed={30}
//             pauseDuration={1500}
//             showCursor
//             cursorCharacter=""
//             className="text-start text-gray-500 mt-2"
//           />
//         </div>
//         <div onClick={() => setOpen(true)} className="flex mt-5 justify-center justfiy-self-center w-full sm:w-1/3 lg:w-1/5 self-center rounded-2xl border p-2 font-semibold
//                             transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
//                             active:translate-y-0 active:shadow-md
//                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2">
//               {/* <Link href="/" prefetch={false} className="w-full h-full text-center"> */}
//                 Add project
//               {/* </Link> */}
//             </div>
//       </div>

      
//       <div className="mt-10 flex items-center flex-wrap gap-5 w-full justify-center md:justify-start">
//       {cards.map((card) => (
//         <ProjectCard key={card.title} title={card.title}/>
        
//       ))}



//       <Modal open={open} onClose={() => setOpen(false)} title="Create New Project">   
//   <div className="max-h-[80vh] overflow-y-auto p-2">
//     {/* Заголовок */}
//     <div className="px-1">
//       <h2 className="text-2xl font-bold">Create New Project</h2>
//       <p className="text-gray-500 mt-1">
//         Add a new project to organize your links
//       </p>
//     </div>

//     {/* Поля формы */}
//     <div className="mt-6 space-y-5">
//       {/* Project Name */}
//       <div>
//         <label className="block text-sm font-semibold mb-2">Project Name</label>
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="My Awesome Project"
//           autoFocus
//           className="h-11 w-full rounded-2xl border px-4 outline-none transition
//                      focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
//         />
//       </div>

//       {/* Description */}
//       <div>
//         <label className="block text-sm font-semibold mb-2">Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           placeholder="Describe your project..."
//           className="min-h-[96px] max-h-[320px] w-full rounded-2xl border px-4 py-2 outline-none transition
//                      focus:ring-2 focus:ring-black/60 focus:ring-offset-2 resize-y"
//         />
//       </div>

   
//       <div>
//         <label className="block text-sm font-semibold mb-2">Project Color</label>
//       </div>
//       <div className="max-w-100">
//         <ColorPicker
//           value={color}
//           onChange={setColor}
//           colors={colors}
//         />
//       </div>
//     </div>

//     {/* Кнопки */}
//     <div className="flex justify-end gap-3 mt-8">
//       <button
//         onClick={() => setOpen(false)}
//         className="px-4 py-2 rounded-2xl border hover:bg-gray-50 transition"
//       >
//         Cancel
//       </button>
//       <button
//         onClick={() => {
//           onSubmit(); 
//           setOpen(false);
//         }}
//         className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition"
//       >
//         Create Project
//       </button>
//     </div>
//   </div>
// </Modal>
//       </div>
//     </div>
//   );
 
// }








// app/projects/page.tsx
import ProjectsClient from "./ProjectsClient";
import colorMap from "@/app/utils/colorMap";
import { getSession } from "@/lib/auth/auth";
import getProjects from "@/lib/queries/projects";

export const revalidate = 0;
export const dynamic = "force-dynamic";
  
export default async function Page() {
  const session = await getSession();
  console.log(colorMap)
  const rawProjects = session ? await getProjects(session.id) : [];
  console.log("Projects fetched in Projects Page:", rawProjects);
  
  // Transform MongoDB documents to ProjectListItem format
  const projects = rawProjects.map(project => ({
    id: project._id?.toString() ?? '',
    title: project.title,
    color: project.color
  }));
  
  const colorNames = Object.keys(colorMap) as (keyof typeof colorMap)[];

  console.log("Session in Projects Page:", session);
  return (
    <div className="container text-primary-text mx-auto px-4 mt-40">
      <ProjectsClient
        sessionId={session?.id ?? null}
        colors={colorNames}
        projects={projects}
      />
    </div>
  );
}