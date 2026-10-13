"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import TextType from "@/app/components/UI/TextType/TextType";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Modal from "../components/ProjectModal/ProjectModal";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import { createProjectAction } from "@/app/actions/projects";
import colorMap from "../utils/colorMap";
import type { LinkItem } from "@/lib/services/link.service";
import type { ProjectItem } from "@/lib/services/project.service";
import type { ActivityPoint } from "@/lib/services/analytics.service";

type ColorName = keyof typeof colorMap;
const COLOR_NAMES = Object.keys(colorMap) as ColorName[];

type Props = {
  projects: ProjectItem[];
  links: LinkItem[];
  activity: Record<string, ActivityPoint[]>;
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

const addButtonClass =
  "inline-flex items-center justify-center rounded-2xl border px-4 py-2 font-semibold transition " +
  "hover:bg-hover-button-bg hover:text-hover-button-text hover:shadow-lg hover:-translate-y-0.5 " +
  "active:translate-y-0 active:shadow-md focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-black/60 focus-visible:ring-offset-2 w-full sm:w-auto";

export default function ProjectsClient({ projects, links, activity }: Props) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<ColorName>("mint");
  const [error, setError] = useState<string | null>(null);

  const { byProject, unassigned } = useMemo(() => {
    const byProject = new Map<string, LinkItem[]>();
    const unassigned: LinkItem[] = [];
    for (const link of links) {
      if (!link.projectId) unassigned.push(link);
      else byProject.set(link.projectId, [...(byProject.get(link.projectId) ?? []), link]);
    }
    return { byProject, unassigned };
  }, [links]);

  async function onCreate(fd: FormData) {
    setError(null);
    const res = await createProjectAction(fd);
    if (res.ok) {
      setOpen(false);
      setColor("mint");
    } else {
      setError(res.error);
    }
  }

  return (
    <>
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

        <button type="button" onClick={() => setOpen(true)} className={addButtonClass}>
          + Add project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="w-full rounded-2xl border border-dashed p-8 text-center text-gray-500">
          <p className="text-lg">No projects yet</p>
          <p className="mt-1">Create your first project to start organizing links.</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-4 rounded-2xl bg-black text-white px-4 py-2 hover:bg-black/90 transition"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              links={byProject.get(project._id) ?? []}
              unassignedLinks={unassigned}
              activity={activity[project._id] ?? []}
            />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create New Project">
        <form action={onCreate} className="p-1">
          <p className="text-gray-500">Add a new project to organize your links</p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="project-title" className="block text-sm font-semibold mb-2">
                Project Name
              </label>
              <input
                id="project-title"
                name="title"
                placeholder="My Awesome Project"
                autoFocus
                required
                maxLength={100}
                className="h-11 w-full rounded-2xl border px-4 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2"
              />
            </div>

            <div>
              <label htmlFor="project-description" className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                id="project-description"
                name="description"
                placeholder="Describe your project..."
                maxLength={1000}
                className="min-h-[96px] max-h-[320px] w-full rounded-2xl border px-4 py-2 outline-none transition focus:ring-2 focus:ring-black/60 focus:ring-offset-2 resize-y"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold mb-2">Project Color</span>
              <ColorPicker value={color} onChange={(c) => setColor(c as ColorName)} colors={COLOR_NAMES} />
              <input type="hidden" name="color" value={color} />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-2xl border hover:bg-gray-50 dark:hover:bg-white/5 transition w-full sm:w-auto"
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
