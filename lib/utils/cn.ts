// lib/utils/cn.ts
// A small helper for combining CSS class names.
// It filters out any falsy values (undefined, null, false) so we can safely write:
//   cn("base-class", isActive && "active-class", className)
// without ending up with "false" or "undefined" in the class string.

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
