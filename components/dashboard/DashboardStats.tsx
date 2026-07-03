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
        title="Всего заявок"
        value={counts.all}
        color="text-white"
      />

      <StatCard
        title="Новые"
        value={counts.new}
        color="text-blue-400"
      />

      <StatCard
        title="Подтверждено"
        value={counts.confirmed}
        color="text-emerald-400"
      />

      <StatCard
        title="Отменено"
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
    <Card className="rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </p>
    </Card>
  );
}