import type { ReactNode } from "react";

export default function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-panel border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {children && <p className="mx-auto mt-1.5 max-w-sm text-ink-soft">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
