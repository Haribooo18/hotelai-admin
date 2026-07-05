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
      <div className="rounded-[var(--ds-radius)] border border-dashed border-[var(--shell-border)] p-4 text-center text-sm text-[var(--shell-muted)]">
        No linked inquiry
      </div>
    );
  }

  return (
    <div className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-4">
      <p className="text-xs uppercase tracking-widest text-[var(--shell-muted)]">Inquiry</p>

      <p className="mt-2 font-semibold">{lead.guest_name ?? "—"}</p>

      <dl className="mt-3 space-y-2 text-sm">
        {lead.room_type && (
          <div>
            <dt className="text-[var(--shell-muted)]">Room</dt>
            <dd>{lead.room_type}</dd>
          </div>
        )}

        {lead.check_in && lead.check_out && (
          <div>
            <dt className="text-[var(--shell-muted)]">Dates</dt>
            <dd>
              {lead.check_in} → {lead.check_out}
            </dd>
          </div>
        )}

        {lead.guests != null && (
          <div>
            <dt className="text-[var(--shell-muted)]">Guests</dt>
            <dd>{lead.guests}</dd>
          </div>
        )}
      </dl>

      {lead.status && (
        <div className="mt-3">
          <span className="inline-flex rounded-full border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] px-2.5 py-0.5 text-xs font-medium text-[var(--shell-text)]">
            {leadStatusLabels[lead.status] ?? lead.status}
          </span>
        </div>
      )}

      {lead.comment && (
        <p className="mt-3 text-xs text-[var(--shell-muted)]">{lead.comment}</p>
      )}
    </div>
  );
}
