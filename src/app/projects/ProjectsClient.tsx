"use client";

import TextType from "@/app/components/UI/TextType/TextType";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Modal from "../components/ProjectModal/ProjectModal";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import { useEffect, useState } from "react";
import { createProjectAction } from "@/app/actions/projects";
import colorMap from "../utils/colorMap";
import { useFormStatus } from "react-dom";

type ColorName = keyof typeof colorMap;

type ProjectListItem = {
  _id: string;               
  title: string;
  description?: string;
  color: ColorName;          
  createdAt?: string;       
  updatedAt?: string;        
};

type Props = {
  sessionId: string | null;
  colors: ColorName[];       
  projects: ProjectListItem[];
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-2xl bg-black text-white hover:bg-black/90 transition disabled:opacity-60"
      aria-busy={pending}
    >
      {pending ? "Creating..." : "Create Project"}
    </button>
  );
}

export default function ProjectsClient({ sessionId, colors, projects}: Props) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<ColorName>("mint");
  const [links, setLinks] = useState<{ _id: string; shortId: string; originalUrl: string; clicks: number }[]>([]);



  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await fetch(`/api/links/find?projectid=null`, {
          method: "GET",
          cache: "no-store", // чтобы не словить кэш
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLinks(data);
        console.log("Links for gay project:", data);
      } catch (error) {
        console.error("Error fetching links for project:", error);
      }
    };
    fetchLinks();
  }, []);
  console.log("ProjectsClient rendered with projects:", projects);
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full mb-10 gap-5">
        <div className="flex flex-col">
          <TextType
            textColors={["text-primary-text"]}
            text={["Projects"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-4xl text-primary-text text-left"
          />
          <TextType
            textColors={["text-primary-text"]}
            text={["Organize your links into projects for better management"]}
            typingSpeed={30}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-start text-gray-500 mt-2"
          />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center mt-2 md:mt-0 rounded-2xl border px-4 py-2 font-semibold
                     transition hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5
                     active:translate-y-0 active:shadow-md focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-black/60 focus-visible:ring-offset-2 w-full sm:w-auto"
          disabled={!sessionId}
          title={sessionId ? "" : "Log in to create a project"}
        >
          + Add project
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed p-8 text-center text-gray-500">
          <p className="text-lg">No projects yet</p>
          <p className="mt-1">Create your first project to start organizing links.</p>
          <div className="mt-4">
            <button
              onClick={() => setOpen(true)}
              className="rounded-2xl bg-black text-white px-4 py-2 hover:bg-black/90 transition"
              disabled={!sessionId}
            >
              Create Project
            </button>
          </div>
        </div>
      ) : (
        <div
          className="
            grid grid-cols-1
            xs:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-5
            w-full
          "
        >
          {projects.map((card) => (
            <ProjectCard
              key={card._id}
              projectId={card._id}                           
              title={card.title}
              description={card.description ?? ""}
              color={card.color as ColorName}                 
              linksCount={0}
              clicks={0}
              emptyLinks={links}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create New Project">
        <form
          action={async (fd) => {
            const res = await createProjectAction(fd);
            if (res.ok) setOpen(false);
            else alert(res.error ?? "Failed");
          }}
          className="max-h-[80vh] overflow-y-auto p-2"
        >
          <div className="px-1">
            <h2 className="text-2xl font-bold">Create New Project</h2>
            <p className="text-gray-500 mt-1">Add a new project to organize your links</p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Project Name</label>
              <input
                name="title"
                placeholder="My Awesome Project"
                autoFocus
                className="h-11 w-full rounded-2xl border px-4 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Describe your project..."
                className="min-h-[96px] max-h-[320px] w-full rounded-2xl border px-4 py-2 outline-none transition
                           focus:ring-2 focus:ring-black/60 focus:ring-offset-2 resize-y"
              />
            </div>

            {/* Color (names) */}
            <div>
              <label className="block text-sm font-semibold mb-2">Project Color</label>
              {/* 
                 Предполагаем, что твой ColorPicker умеет работать с ИМЕНАМИ цветов.
              */}
              <ColorPicker
                value={color}
                onChange={(c: string) => setColor(c as ColorName)}
                colors={colors} // массив имён (["blue","mint",...])
              />
              {/* гарантируем попадание в FormData */}
              <input type="hidden" name="color" value={color} />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-2xl border hover:bg-gray-50 transition w-full sm:w-auto"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      </Modal>
    </>
  );
}