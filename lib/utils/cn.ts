/**
 * lib/utils/cn.ts
 *
 * A minimal className concatenation utility.
 *
 * Tailwind classes are just strings — sometimes we need to combine a base
 * set of classes with conditional or override classes. This utility accepts
 * any number of class strings (including undefined, null, and false which
 * are filtered out), making it safe to write:
 *
 *   cn("base-class", isActive && "active-class", className)
 *
 * without worrying about undefined/false ending up in the output string.
 *
 * We deliberately avoid pulling in clsx or tailwind-merge as external
 * dependencies — the project's usage patterns don't require the extra
 * weight of conflict resolution.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
