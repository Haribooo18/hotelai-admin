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
        placeholder="Поиск по имени, телефону, email, номеру..."
        className="
          h-12
          w-full
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          px-5
          text-sm
          text-white
          outline-none
          transition
          placeholder:text-zinc-500
          focus:border-emerald-500
        "
      />
    </div>
  );
}