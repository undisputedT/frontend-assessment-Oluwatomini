// app/loading.tsx
// Shown automatically while the listing page is fetching data.
// It's a skeleton that matches the real page layout so nothing jumps when
// the content loads in. Each element pulses gently to signal loading.

function CardSkeleton() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-4">
      <div className="h-28 w-28 animate-pulse rounded-full bg-gray-200" />
      <div className="mt-2 h-3 w-10 animate-pulse rounded bg-gray-200" />
      <div className="mt-1 h-5 w-24 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 flex gap-1">
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
        <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <>
      <div className="mb-6">
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="mb-6 flex gap-3">
        <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-11 w-44 animate-pulse rounded-xl bg-gray-200" />
      </div>
      {/* 10 card skeletons to match the default page size */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}>
            <CardSkeleton />
          </li>
        ))}
      </ul>
    </>
  );
}
