/** Placeholder shaped like a signed-in page (header, then rows) while it loads. */
export default function PageSkeleton({ rows = 5 }: { rows?: number }) {
  const bar = "rounded-md bg-sunken animate-pulse";
  return (
    <main className="shell pt-10 sm:pt-14" aria-busy="true" aria-label="Loading">
      <div className="border-b border-line pb-6">
        <div className={`${bar} h-9 w-48`} />
        <div className={`${bar} mt-3 h-4 w-80 max-w-full`} />
      </div>
      <ul className="mt-6 divide-y divide-line">
        {Array.from({ length: rows }, (_, i) => (
          <li key={i} className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <div className={`${bar} h-4 w-40`} />
              <div className={`${bar} mt-2 h-3.5 w-72 max-w-full`} />
            </div>
            <div className={`${bar} h-4 w-16`} />
          </li>
        ))}
      </ul>
    </main>
  );
}
