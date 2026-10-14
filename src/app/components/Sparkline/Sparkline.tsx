/** Tiny 7-day trend line for project cards. Decorative; the numbers are shown next to it. */
export default function Sparkline({ values, className = "" }: { values: number[]; className?: string }) {
  const w = 120;
  const h = 32;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? w / (values.length - 1) : w;
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(h - 2 - (v / max) * (h - 4)).toFixed(1)}`);
  const flat = values.every((v) => v === 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true" className={`overflow-visible ${className}`}>
      {flat ? (
        <line x1="0" x2={w} y1={h - 2} y2={h - 2} stroke="var(--line-strong)" strokeWidth="1.5" strokeDasharray="3 4" />
      ) : (
        <>
          <polygon points={`0,${h} ${points.join(" ")} ${w},${h}`} fill="currentColor" opacity="0.12" />
          <polyline points={points.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
