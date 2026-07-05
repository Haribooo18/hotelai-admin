"use client";

import { useState } from "react";
import { Phone, Mail, Users, CalendarDays } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { LeadStatusActions } from "@/app/LeadStatusActions";
import { LeadDrawer } from "./LeadDrawer";

type Lead = {
  lead_id: string;
  created_at?: string |null;
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
  leads: Lead[];
};

export function LeadsTable({ leads }: Props) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-surface)] shadow-xl">
        <div className="border-b border-[var(--shell-border)] px-6 py-5">
          <h2 className="text-xl font-bold">
            Recent requests
          </h2>

          <p className="mt-1 text-sm text-[var(--shell-muted)]">
            Total requests: {leads.length}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-[var(--shell-border)]">
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.lead_id}
                onClick={() => setSelectedLead(lead)}
                className="cursor-pointer border-[var(--shell-border)] transition hover:bg-[var(--shell-surface-raised)]/70"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                      {(lead.guest_name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div className="font-semibold">
                        {lead.guest_name || "No name"}
                      </div>

                      <div className="text-xs text-[var(--shell-muted)]">
                        #{lead.lead_id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2 text-sm">
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {lead.phone}
                      </div>
                    )}

                    {lead.email && (
                      <div className="flex items-center gap-2 text-[var(--shell-muted)]">
                        <Mail size={14} />
                        {lead.email}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {lead.room_type || "—"}
                </TableCell>

                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} />
                      {lead.check_in}
                    </div>

                    <div className="text-[var(--shell-muted)]">
                      {lead.check_out}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users size={15} />
                    {lead.guests || 1}
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge status={lead.status || "new"} />
                </TableCell>

                <TableCell className="max-w-[260px] truncate text-[var(--shell-muted)]">
                  {lead.comment || "—"}
                </TableCell>

                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LeadStatusActions
                    leadId={lead.lead_id}
                    currentStatus={lead.status}
                  />
                </TableCell>
              </TableRow>
            ))}

            {leads.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-[var(--shell-muted)]"
                >
                  No requests yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <LeadDrawer
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => {
          if (!open) setSelectedLead(null);
        }}
      />
    </>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-600">
          Confirmed
        </Badge>
      );

    case "contacted":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-500">
          Contacted
        </Badge>
      );

    case "cancelled":
      return (
        <Badge variant="destructive">
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          New
        </Badge>
      );
  }
}