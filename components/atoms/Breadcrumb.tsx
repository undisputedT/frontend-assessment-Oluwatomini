/**
 * components/atoms/Breadcrumb.tsx
 *
 * Renders a semantic breadcrumb trail using the HTML landmark pattern
 * recommended by WAI-ARIA: <nav aria-label="Breadcrumb"> wrapping an <ol>
 * of <li> items. This gives screen reader users a clear navigation landmark
 * and communicates the page hierarchy.
 *
 * The last item receives aria-current="page" to identify the current location.
 * Separator slashes are marked aria-hidden so assistive technology does not
 * announce them as content.
 */

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  /** When provided (and not the last item), the label renders as a link */
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Renders an ordered list of breadcrumb items.
 * Items with an href (except the last) render as Next.js links.
 * The final item renders as a plain span with aria-current="page".
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {/* Separator — hidden from assistive technology */}
              {i > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? "font-medium text-gray-900" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
