"use client";

import { useState } from "react";
import { Plus, FolderOpen } from "lucide-react";
import { useFormStatus } from "react-dom";
import TextType from "@/app/components/UI/TextType/TextType";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Modal from "../components/ProjectModal/ProjectModal";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import { createProjectAction } from "@/app/actions/projects";
import colorMap from "../utils/colorMap";

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
  activityAll: Record<string, { day: string; clicks: number }[]>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      aria-busy={pending}
    >
      {pending ? "Creating..." : "Create Project"}
    </button>
  );
}

export default function ProjectsClient({
  sessionId,
  colors,
  projects,
  activityAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState<ColorName>("mint");

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <TextType
            textColors={["text-foreground"]}
            text={["Projects"]}
            typingSpeed={25}
            pauseDuration={1500}
            showCursor
            cursorCharacter=""
            className="text-3xl font-bold text-foreground sm:text-4xl"
          />
          <p className="mt-2 text-muted-foreground">
            Organize your links into projects for better management
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          disabled={!sessionId}
          title={sessionId ? "" : "Log in to create a project"}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-card-foreground">
            No projects yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to start organizing links
          </p>
          <button
            onClick={() => setOpen(true)}
            disabled={!sessionId}
            className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessionId &&
            projects.map((card) => (
              <ProjectCard
                sessionId={sessionId}
                key={card._id}
                projectId={card._id}
                title={card.title}
                description={card.description}
                color={card.color as ColorName}
                linksCount={0}
                clicks={0}
                activity={activityAll[card._id] || []}
              />
            ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create New Project"
      >
        <form
          action={async (fd) => {
            const res = await createProjectAction(fd);
            if (res.ok) setOpen(false);
            else alert(res.error ?? "Failed");
          }}
          className="max-h-[80vh] overflow-y-auto"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-card-foreground">
              Create New Project
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new project to organize your links
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Project Name
              </label>
              <input
                name="title"
                placeholder="My Awesome Project"
                autoFocus
                required
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your project..."
                className="min-h-[96px] w-full resize-y rounded-xl border border-border bg-card px-4 py-3 text-card-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
              />
            </div>

            {/* Color */}
            <div>
              <label className="mb-2 block text-sm font-medium text-card-foreground">
                Project Color
              </label>
              <ColorPicker
                value={color}
                onChange={(c: string) => setColor(c as ColorName)}
                colors={colors}
              />
              <input type="hidden" name="color" value={color} />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-card-foreground transition-all hover:bg-secondary sm:w-auto"
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
