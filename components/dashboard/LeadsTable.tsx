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
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-xl">
        <div className="border-b border-zinc-800 px-6 py-5">
          <h2 className="text-xl font-bold">
            Последние заявки
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Всего заявок: {leads.length}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead>Гость</TableHead>
              <TableHead>Контакт</TableHead>
              <TableHead>Номер</TableHead>
              <TableHead>Даты</TableHead>
              <TableHead>Гостей</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Комментарий</TableHead>
              <TableHead className="text-right">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.lead_id}
                onClick={() => setSelectedLead(lead)}
                className="cursor-pointer border-zinc-900 transition hover:bg-zinc-900/70"
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
                        {lead.guest_name || "Без имени"}
                      </div>

                      <div className="text-xs text-zinc-500">
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
                      <div className="flex items-center gap-2 text-zinc-400">
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

                    <div className="text-zinc-500">
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

                <TableCell className="max-w-[260px] truncate text-zinc-400">
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
                  className="py-16 text-center text-zinc-500"
                >
                  Заявок пока нет
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
          Подтверждена
        </Badge>
      );

    case "contacted":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-500">
          Связались
        </Badge>
      );

    case "cancelled":
      return (
        <Badge variant="destructive">
          Отменена
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          Новая
        </Badge>
      );
  }
}