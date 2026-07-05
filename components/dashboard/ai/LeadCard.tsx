import type { Lead } from "@/types/lead";

const leadStatusLabels: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

type Props = {
  lead: Lead | null;
};

export function LeadCard({ lead }: Props) {
  if (!lead) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center text-sm text-zinc-500">
        No linked inquiry
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-500">Inquiry</p>

      <p className="mt-2 font-semibold">{lead.guest_name ?? "—"}</p>

      <dl className="mt-3 space-y-2 text-sm">
        {lead.room_type && (
          <div>
            <dt className="text-zinc-500">Room</dt>
            <dd>{lead.room_type}</dd>
          </div>
        )}

        {lead.check_in && lead.check_out && (
          <div>
            <dt className="text-zinc-500">Dates</dt>
            <dd>
              {lead.check_in} → {lead.check_out}
            </dd>
          </div>
        )}

        {lead.guests != null && (
          <div>
            <dt className="text-zinc-500">Guests</dt>
            <dd>{lead.guests}</dd>
          </div>
        )}
      </dl>

      {lead.status && (
        <div className="mt-3">
          <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
            {leadStatusLabels[lead.status] ?? lead.status}
          </span>
        </div>
      )}

      {lead.comment && (
        <p className="mt-3 text-xs text-zinc-400">{lead.comment}</p>
      )}
    </div>
  );
}
