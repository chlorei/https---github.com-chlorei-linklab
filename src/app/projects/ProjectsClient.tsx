"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus } from "lucide-react";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Modal from "../components/ProjectModal/ProjectModal";
import ColorPicker from "@/app/components/UI/ColorPicker/ColorPicker";
import PageHeader from "@/app/components/UI/PageHeader/PageHeader";
import EmptyState from "@/app/components/UI/EmptyState/EmptyState";
import { Button } from "@/app/components/UI/Button/Button";
import { Field, FormMessage, Input, Textarea } from "@/app/components/UI/Field/Field";
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
    <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>
      {pending ? "Creating…" : "Create project"}
    </Button>
  );
}

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

  const newProjectButton = (
    <Button variant="accent" onClick={() => setOpen(true)}>
      <Plus size={17} />
      New project
    </Button>
  );

  return (
    <main className="shell pt-10 sm:pt-14">
      <PageHeader
        title="Projects"
        description="Group links by campaign, client or release to see their clicks together."
        actions={projects.length > 0 ? newProjectButton : undefined}
      />

      <div className="mt-8">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" action={newProjectButton}>
            {unassigned.length > 0
              ? `You have ${unassigned.length} unfiled ${unassigned.length === 1 ? "link" : "links"} ready to be grouped.`
              : "Create a project, then add links to it."}
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New project" size="md">
        <form action={onCreate} className="flex flex-col gap-5">
          <Field label="Name" htmlFor="project-title">
            <Input id="project-title" name="title" placeholder="Spring launch" autoFocus required maxLength={100} />
          </Field>
          <Field label="Description" htmlFor="project-description" hint="Optional.">
            <Textarea id="project-description" name="description" placeholder="What these links are for" maxLength={1000} />
          </Field>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Color</span>
            <ColorPicker value={color} onChange={(c) => setColor(c as ColorName)} colors={COLOR_NAMES} />
            <input type="hidden" name="color" value={color} />
          </div>

          {error && <FormMessage tone="error">{error}</FormMessage>}

          <div className="flex justify-end gap-2 border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton />
          </div>
        </form>
      </Modal>
    </main>
  );
}
