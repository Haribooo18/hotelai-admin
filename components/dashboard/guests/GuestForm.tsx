"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Guest } from "@/types/guest";

import { createGuest, updateGuest } from "@/lib/services/guests.mutations";
import {
  guestCreateSchema,
  guestUpdateSchema,
} from "@/lib/validations/guest";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
          toast.success("Гость обновлён");
        } else {
          await createGuest(parsed.data);
          toast.success("Гость создан");
        }
        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error(
          error instanceof Error ? error.message : "Ошибка сохранения"
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Имя" htmlFor="first_name" error={errors.first_name}>
          <Input
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={Boolean(errors.first_name)}
            aria-describedby={errors.first_name ? "first_name-error" : undefined}
          />
        </Field>

        <Field label="Фамилия" htmlFor="last_name" error={errors.last_name}>
          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-invalid={Boolean(errors.last_name)}
            aria-describedby={errors.last_name ? "last_name-error" : undefined}
          />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      </Field>

      <Field label="Телефон" htmlFor="phone">
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Страна" htmlFor="country">
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Field>

        <Field label="Город" htmlFor="city">
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Ссылка на аватар" htmlFor="avatar_url">
        <Input
          id="avatar_url"
          placeholder="https://…"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />
      </Field>

      <Field label="Теги" htmlFor="tags">
        <GuestTagsInput id="tags" value={tags} onChange={setTags} />
      </Field>

      <Field label="Заметки" htmlFor="notes">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Field>

      <div className="flex items-center gap-6">
        <Checkbox
          id="is_vip"
          label="VIP"
          checked={isVip}
          onChange={setIsVip}
        />

        <Checkbox
          id="is_favorite"
          label="Избранный"
          checked={isFavorite}
          onChange={setIsFavorite}
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? "Сохранение..."
          : guest
          ? "Сохранить изменения"
          : "Создать гостя"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm text-zinc-400">
        {label}
      </label>

      {children}

      {error && (
        <p id={`${htmlFor}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function Checkbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 accent-emerald-600"
      />
      {label}
    </label>
  );
}
