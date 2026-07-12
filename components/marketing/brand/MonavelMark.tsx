import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function MonavelMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("mkt-brand-mark", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" className="mkt-brand-mark-bg" />
      <rect x="7.5" y="10" width="5.5" height="12" rx="1.5" className="mkt-brand-mark-bar" />
      <rect x="19" y="10" width="5.5" height="12" rx="1.5" className="mkt-brand-mark-bar" />
    </svg>
  );
}
