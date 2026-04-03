// components/atoms/Breadcrumb.tsx
// Shows where you are in the app — like "All Pokémon / Bulbasaur".
// Uses a proper <nav> and <ol> so screen readers announce it as navigation
// and announce the item count.
// The last item is marked aria-current="page" so screen readers know it's the current page.

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string; // when provided (and not the last item), renders as a link
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {/* Slash separator — hidden from screen readers since it's just decoration */}
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
