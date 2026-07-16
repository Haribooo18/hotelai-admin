"use client";

import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import type { Guest } from "@/types/guest";
import { useI18n } from "@/lib/i18n";

import { GuestAvatar } from "./GuestAvatar";
import { GuestTags } from "./GuestTags";

type Props = {
  guest: Guest;
  actions?: ReactNode;
};

export function GuestProfileCard({ guest, actions }: Props) {
  const { t } = useI18n();
  const location = [guest.city, guest.country].filter(Boolean).join(", ");

  return (
    <div className="rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <GuestAvatar
            firstName={guest.first_name}
            lastName={guest.last_name}
            avatarUrl={guest.avatar_url}
            size="lg"
          />

          <div>
            <h1 className="text-2xl font-bold">
              {guest.first_name} {guest.last_name}
            </h1>

            <div className="mt-2">
              <GuestTags
                tags={guest.tags}
                isVip={guest.is_vip}
                isFavorite={guest.is_favorite}
              />
            </div>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <ContactItem icon={<Mail size={16} />} label={t("login.email")}>
          {guest.email ?? "—"}
        </ContactItem>

        <ContactItem icon={<Phone size={16} />} label={t("bookings.formPhone")}>
          {guest.phone ?? "—"}
        </ContactItem>

        <ContactItem icon={<MapPin size={16} />} label={t("guests.location")}>
          {location || "—"}
        </ContactItem>
      </dl>

      {guest.notes && (
        <div className="mt-6 rounded-[var(--ds-radius)] border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-4">
          <p className="text-xs uppercase tracking-widest text-[var(--shell-muted)]">
            {t("guests.noNotes")}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--shell-text)]">
            {guest.notes}
          </p>
        </div>
      )}
    </div>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--shell-muted)]">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-[var(--shell-text)]">{children}</dd>
    </div>
  );
}
