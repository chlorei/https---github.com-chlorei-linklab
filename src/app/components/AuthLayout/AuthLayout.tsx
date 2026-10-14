import type { ReactNode } from "react";

/** Narrow centered column shared by sign-in, sign-up and the consent screen. */
export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="shell flex justify-center pt-14 sm:pt-24">
      <div className="w-full max-w-sm">
        <h1 className="text-title font-semibold">{title}</h1>
        {description && <p className="mt-2 text-ink-soft">{description}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-8 border-t border-line pt-6 text-sm text-ink-soft">{footer}</div>}
      </div>
    </main>
  );
}
