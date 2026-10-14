import type { ReactNode } from "react";

/** Title row at the top of every signed-in page: title + one-line description, actions on the right. */
export default function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-title font-semibold">{title}</h1>
        {description && <p className="mt-2 max-w-prose text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
}
