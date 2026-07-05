import type { Lead } from "@/types/lead";

import { LeadSearch } from "@/app/LeadSearch";
import { LeadFilters } from "@/app/LeadFilters";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { DashboardSectionTitle, DashboardSurface } from "./DashboardPrimitives";

type Props = {
  leads: Lead[];
  search: string;
  status: string;
  counts: {
    all: number;
    new: number;
    contacted: number;
    confirmed: number;
    cancelled: number;
  };
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function DashboardLeadsPanel({
  leads,
  search,
  status,
  counts,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <DashboardSurface className="overflow-hidden">
      <div className="border-b border-[var(--shell-border)] px-6 py-5">
        <DashboardSectionTitle
          title="Booking requests"
          subtitle="Incoming requests and their statuses"
        />
      </div>

      <div className="space-y-5 px-6 py-5">
        <LeadSearch value={search} onChange={onSearchChange} />
        <LeadFilters
          active={status}
          setActive={onStatusChange}
          counts={counts}
        />
      </div>

      <div className="px-2 pb-2">
        <LeadsTable leads={leads} />
      </div>
    </DashboardSurface>
  );
}
