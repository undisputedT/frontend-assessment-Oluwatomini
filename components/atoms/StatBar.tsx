/**
 * components/atoms/StatBar.tsx
 *
 * Renders a labelled, accessible progress bar for a single Pokémon base stat.
 * Used in the detail page stats section to visualise all six base stats.
 *
 * Accessibility: the outer track div carries role="progressbar" with the full
 * set of ARIA attributes (aria-valuenow, aria-valuemin, aria-valuemax,
 * aria-label) so screen readers can announce "hp: 45" rather than ignoring
 * what looks like a decorative bar.
 */

import { cn } from "@/lib/utils/cn";

interface StatBarProps {
  label: string;
  value: number;
  /** Maximum possible value — defaults to 255, the highest base stat in the games */
  max?: number;
  className?: string;
}

/**
 * Renders a horizontal stat bar with a numeric label on the left and the
 * filled portion scaled to (value / max) * 100%.
 *
 * The percentage is clamped to 100 with Math.min so that any hypothetical
 * stat above the expected maximum does not overflow the track element.
 */
export function StatBar({ label, value, max = 255, className }: StatBarProps) {
  // Clamp to [0, 100] so the bar never overflows its container
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Stat name — right-aligned so all bars start at the same horizontal position */}
      <span className="w-20 shrink-0 text-right text-xs font-medium capitalize text-gray-500">
        {label}
      </span>
      {/* Numeric value — fixed-width column keeps bars aligned */}
      <span className="w-8 shrink-0 text-right text-xs font-bold text-gray-800">
        {value}
      </span>
      {/* Track — role="progressbar" makes this meaningful to assistive technology */}
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
