// components/atoms/StatBar.tsx
// A horizontal bar that shows a base stat (like HP or Attack) as a filled track.
// Used on the detail page to visualise all six stats at a glance.
// The bar is marked as a progressbar so screen readers can announce the value.

import { cn } from "@/lib/utils/cn";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;   // max possible value — defaults to 255 (the highest base stat in the games)
  className?: string;
}

export function StatBar({ label, value, max = 255, className }: StatBarProps) {
  // Clamp to 100% so the bar never overflows if a value exceeds the expected max
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Stat name — right-aligned so all bars start at the same position */}
      <span className="w-20 shrink-0 text-right text-xs font-medium capitalize text-gray-500">
        {label}
      </span>
      <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-800">
        {value}
      </span>
      {/* role="progressbar" with aria attributes makes this readable by screen readers */}
      <div
        className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${label}: ${value}`}
      >
        <div
          className="h-full rounded-full bg-red-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
