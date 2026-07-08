import { RevenuePage } from "@/components/dashboard/revenue";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { createRevenueRepository } from "@/repositories/revenue.repository.server";
import { getTenantContext } from "@/lib/tenant/context";

export default async function RatesRoute() {
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const revenueRepository = createRevenueRepository(repositoryContext);

  const dataPromise = revenueRepository.load();
  const [data, kpis, trend, breakdown, forecast] = await Promise.all([
    dataPromise,
    revenueRepository.getMetrics(dataPromise),
    revenueRepository.getTrend(dataPromise),
    revenueRepository.getBreakdown(dataPromise),
    revenueRepository.getForecast(dataPromise),
  ]);

  return (
    <RevenuePage
      bookings={data.bookings}
      rooms={data.rooms}
      serverRange={data.range}
      serverKpis={kpis}
      serverTrend={trend}
      serverBySource={breakdown.bySource}
      serverByRoomType={breakdown.byRoomType}
      serverForecast={forecast}
    />
  );
}
