"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

import type { Guest } from "@/types/guest";

import { createGuest, updateGuest } from "@/lib/services/guests.mutations";
import {
  guestCreateSchema,
  guestUpdateSchema,
} from "@/lib/validations/guest";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FormCheckboxField,
  FormField,
} from "@/components/ui/core/FormField";
import { formStackClass } from "@/lib/dashboard/design-system";
import { localizeErrorWithT, useI18n } from "@/lib/i18n";

import { GuestTagsInput } from "./GuestTagsInput";

type Props = {
  guest?: Guest;
  onSuccess?: () => void;
};

type FieldName =
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "country"
  | "city"
  | "notes"
  | "avatar_url";

type FieldErrors = Partial<Record<FieldName, string>>;

export function GuestForm({ guest, onSuccess }: Props) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(guest?.first_name ?? "");
  const [lastName, setLastName] = useState(guest?.last_name ?? "");
  const [email, setEmail] = useState(guest?.email ?? "");
  const [phone, setPhone] = useState(guest?.phone ?? "");
  const [country, setCountry] = useState(guest?.country ?? "");
  const [city, setCity] = useState(guest?.city ?? "");
  const [notes, setNotes] = useState(guest?.notes ?? "");
  const [avatarUrl, setAvatarUrl] = useState(guest?.avatar_url ?? "");
  const [tags, setTags] = useState<string[]>(guest?.tags ?? []);
  const [isVip, setIsVip] = useState(guest?.is_vip ?? false);
  const [isFavorite, setIsFavorite] = useState(guest?.is_favorite ?? false);
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const raw = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      country,
      city,
      notes,
      avatar_url: avatarUrl,
      tags,
      is_vip: isVip,
      is_favorite: isFavorite,
    };

    const parsed = guest
      ? guestUpdateSchema.safeParse({ ...raw, id: guest.id })
      : guestCreateSchema.safeParse(raw);

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldName;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        if (guest) {
          await updateGuest({ ...parsed.data, id: guest.id });
          toast.success(t("guests.updated"));
        } else {
          await createGuest(parsed.data);
          toast.success(t("guests.created"));
        }
        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          localizeErrorWithT(
            t,
            error instanceof Error
              ? error.message
              : guest
                ? t("guests.updated")
                : t("errors.saveFailed")
          )
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={formStackClass} noValidate>
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t("guests.formFirstName")} htmlFor="first_name" error={errors.first_name}>
          <Input
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={Boolean(errors.first_name)}
            aria-describedby={errors.first_name ? "first_name-error" : undefined}
          />
        </FormField>

        <FormField label={t("guests.formLastName")} htmlFor="last_name" error={errors.last_name}>
          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-invalid={Boolean(errors.last_name)}
            aria-describedby={errors.last_name ? "last_name-error" : undefined}
          />
        </FormField>
      </div>

      <FormField label={t("login.email")} htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </FormField>

      <FormField label={t("bookings.formPhone")} htmlFor="phone">
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t("guests.crmCountriesTitle")} htmlFor="country">
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </FormField>

        <FormField label={t("guests.location")} htmlFor="city">
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </FormField>
      </div>

      <FormField label={t("guests.formAvatarUrl")} htmlFor="avatar_url">
        <Input
          id="avatar_url"
          placeholder="https://…"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </FormField>

      <FormField label={t("guests.formTags")} htmlFor="tags">
        <GuestTagsInput id="tags" value={tags} onChange={setTags} />
      </FormField>

      <FormField label={t("guests.noNotes")} htmlFor="notes">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </FormField>

      <div className="flex items-center gap-6">
        <FormCheckboxField
          id="is_vip"
          label={t("guests.vipOnly")}
          checked={isVip}
          onCheckedChange={setIsVip}
        />

        <FormCheckboxField
          id="is_favorite"
          label={t("guests.addFavorite")}
          checked={isFavorite}
          onCheckedChange={setIsFavorite}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? t("common.saving")
          : guest
          ? t("guests.formSaveChanges")
          : t("guests.formCreateGuest")}
      </Button>
    </form>
  );
}
