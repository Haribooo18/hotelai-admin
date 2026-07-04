import { cn } from "@/lib/utils";

type Props = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-20 w-20 text-2xl",
};

export function GuestAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = "md",
  className,
}: Props) {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
  const fullName = `${firstName} ${lastName}`.trim();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are arbitrary/external; next/image would require remotePatterns config
      <img
        src={avatarUrl}
        alt={fullName}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-emerald-600/20 font-semibold text-emerald-400",
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
