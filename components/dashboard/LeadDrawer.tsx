"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { LeadStatusActions } from "@/app/LeadStatusActions";

type Lead = {
  lead_id: string;
  created_at?: string | null;
  guest_name: string | null;
  phone: string | null;
  email: string | null;
  room_type: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  status: string | null;
  comment: string | null;
};

type Props = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadDrawer({ lead, open, onOpenChange }: Props) {
  if (!lead) return null;

  const phone = lead.phone || "";
  const whatsappPhone = phone.replace(/\D/g, "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{lead.guest_name || "No name"}</SheetTitle>
          <SheetDescription>
            Booking request details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-sm)]">
            <h3 className="mb-4 text-sm font-medium text-[var(--shell-muted)]">
              Status
            </h3>

            <LeadStatusActions
              leadId={lead.lead_id}
              currentStatus={lead.status}
            />
          </section>

          <section className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-sm)]">
            <h3 className="mb-4 text-sm font-medium text-[var(--shell-muted)]">
              Contacts
            </h3>

            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email} />

            <div className="mt-4 flex flex-wrap gap-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] px-3 py-2 text-sm text-[var(--shell-text)] transition-colors hover:bg-[var(--shell-nav-hover-bg)]"
                >
                  Call
                </a>
              )}

              {whatsappPhone && (
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[var(--ds-radius-sm)] bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500"
                >
                  WhatsApp
                </a>
              )}

              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="rounded-[var(--ds-radius-sm)] border border-[var(--shell-border)] px-3 py-2 text-sm text-[var(--shell-text)] transition-colors hover:bg-[var(--shell-nav-hover-bg)]"
                >
                  Email
                </a>
              )}
            </div>
          </section>

          <section className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-sm)]">
            <h3 className="mb-4 text-sm font-medium text-[var(--shell-muted)]">
              Reservation
            </h3>

            <Info label="Room type" value={lead.room_type} />
            <Info label="Check-in" value={lead.check_in} />
            <Info label="Check-out" value={lead.check_out} />
            <Info label="Guests" value={lead.guests?.toString()} />
          </section>

          <section className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-sm)]">
            <h3 className="mb-4 text-sm font-medium text-[var(--shell-muted)]">
              Comment
            </h3>

            <p className="whitespace-pre-wrap text-sm text-[var(--shell-text)]">
              {lead.comment || "No comment."}
            </p>
          </section>

          <section className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface)] p-4 shadow-[var(--shell-shadow-sm)]">
            <h3 className="mb-4 text-sm font-medium text-[var(--shell-muted)]">
              System information
            </h3>

            <Info label="Request ID" value={lead.lead_id} />
            <Info label="Created" value={lead.created_at} />
            <Info label="Status" value={lead.status || "new"} />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="mb-3">
      <p className="text-xs text-[var(--shell-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[var(--shell-text)]">{value || "—"}</p>
    </div>
  );
}
