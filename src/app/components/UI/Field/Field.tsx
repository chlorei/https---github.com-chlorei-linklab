import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "block w-full h-11 rounded-control border border-line-strong bg-surface px-3.5 text-[0.9375rem] text-ink " +
  "transition-colors hover:border-ink-faint focus:border-link focus:outline-none focus:ring-3 focus:ring-link/15 " +
  "disabled:opacity-60";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${inputClass} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: ComponentProps<"textarea">) {
  return <textarea className={`${inputClass} h-auto min-h-24 py-2.5 resize-y ${className}`} {...props} />;
}

/** A labeled form control with an optional hint underneath. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="text-sm text-ink-soft">{hint}</p>}
    </div>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`text-sm ${tone === "error" ? "text-danger" : "text-success"}`}
    >
      {children}
    </p>
  );
}
