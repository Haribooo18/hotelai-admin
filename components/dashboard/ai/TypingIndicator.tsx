type Props = {
  label?: string;
  actor?: "guest" | "ai";
};

export function TypingIndicator({
  label,
  actor = "guest",
}: Props) {
  const defaultLabel =
    actor === "ai" ? "AI is typing" : "Guest is typing";

  return (
    <div
      className="flex items-center gap-1.5 px-4 py-2"
      role="status"
      aria-live="polite"
      aria-label={label ?? defaultLabel}
    >
      <span className="text-sm text-zinc-500">{label ?? defaultLabel}</span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
