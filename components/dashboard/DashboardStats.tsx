import { Card } from "@/components/ui/card";

type Props = {
  counts: {
    all: number;
    new: number;
    contacted: number;
    confirmed: number;
    cancelled: number;
  };
};

export function DashboardStats({ counts }: Props) {
  return (
    <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total requests"
        value={counts.all}
        color="text-[var(--shell-text)]"
      />

      <StatCard
        title="New"
        value={counts.new}
        color="text-blue-400"
      />

      <StatCard
        title="Confirmed"
        value={counts.confirmed}
        color="text-emerald-400"
      />

      <StatCard
        title="Cancelled"
        value={counts.cancelled}
        color="text-red-400"
      />
    </section>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <Card className="rounded-[var(--ds-radius)] p-6 transition-all duration-[var(--ds-duration)] ease-[var(--ds-ease)] hover:-translate-y-px hover:shadow-[var(--shell-shadow-md)]">
      <p className="text-sm text-[var(--shell-muted)]">
        {title}
      </p>

      <p className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </p>
    </Card>
  );
}