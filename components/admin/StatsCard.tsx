export interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  const displayValue =
    typeof value === "number" ? value.toLocaleString("en-IN") : value;

  return (
    <div className="rounded-2xl border border-green-soft/20 bg-bg p-6 shadow-sm">
      <p className="text-sm font-medium text-text/60">{title}</p>
      <p className="mt-2 font-heading text-3xl font-bold text-green-deep">
        {displayValue}
      </p>
      {description && (
        <p className="mt-1 text-xs text-text/50">{description}</p>
      )}
    </div>
  );
}
