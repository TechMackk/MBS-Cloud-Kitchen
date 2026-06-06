export default function MenuLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 h-40 animate-pulse rounded-2xl bg-cream/50" />
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-cream/50" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-cream/50"
          />
        ))}
      </div>
    </div>
  );
}
