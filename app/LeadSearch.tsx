"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function LeadSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="mb-6">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, phone, email, room..."
        className="
          h-12
          w-full
          rounded-[var(--ds-radius)]
          border
          border-[var(--shell-border)]
          bg-[var(--shell-surface-raised)]
          px-5
          text-sm
          text-white
          outline-none
          transition
          placeholder:text-[var(--shell-muted)]
          focus:border-emerald-500
        "
      />
    </div>
  );
}