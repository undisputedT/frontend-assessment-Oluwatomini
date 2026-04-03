// app/pokemon/[id]/loading.tsx
// Shown while the detail page is fetching data.
// Matches the layout of the real page so nothing jumps when content arrives.

export default function Loading() {
  return (
    <>
      {/* Breadcrumb row */}
      <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: image card */}
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="mt-1 h-9 w-36 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-56 w-56 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
            <div className="h-7 w-16 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Right: stats + moves */}
        <div className="flex flex-col gap-6">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>

      {/* Evolution chain */}
      <div className="mt-8 h-36 animate-pulse rounded-2xl bg-gray-200" />
    </>
  );
}
