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
          <SheetTitle>{lead.guest_name || "Без имени"}</SheetTitle>
          <SheetDescription>
            Детали заявки на бронирование
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Статус
            </h3>

            <LeadStatusActions
              leadId={lead.lead_id}
              currentStatus={lead.status}
            />
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Контакты
            </h3>

            <Info label="Телефон" value={lead.phone} />
            <Info label="Email" value={lead.email} />

            <div className="mt-4 flex flex-wrap gap-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
                >
                  Позвонить
                </a>
              )}

              {whatsappPhone && (
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
                >
                  WhatsApp
                </a>
              )}

              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="rounded-xl border px-3 py-2 text-sm hover:bg-muted"
                >
                  Email
                </a>
              )}
            </div>
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Бронирование
            </h3>

            <Info label="Тип номера" value={lead.room_type} />
            <Info label="Заезд" value={lead.check_in} />
            <Info label="Выезд" value={lead.check_out} />
            <Info label="Гостей" value={lead.guests?.toString()} />
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Комментарий
            </h3>

            <p className="whitespace-pre-wrap text-sm">
              {lead.comment || "Комментария нет."}
            </p>
          </section>

          <section className="rounded-xl border p-4">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              Системная информация
            </h3>

            <Info label="ID заявки" value={lead.lead_id} />
            <Info label="Создана" value={lead.created_at} />
            <Info label="Статус" value={lead.status || "new"} />
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
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}