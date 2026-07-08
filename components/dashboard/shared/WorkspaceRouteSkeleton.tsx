import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";

type Props = {
  label: string;
  kpiCount?: number;
  kpiGridClassName?: string;
  children?: ReactNode;
};

export function WorkspaceRouteSkeleton({
  label,
  kpiCount = 6,
  kpiGridClassName = "sm:grid-cols-2 xl:grid-cols-6",
  children,
}: Props) {
  return (
    <Stack gap="md" aria-busy="true" aria-label={label}>
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className={`grid gap-3 ${kpiGridClassName}`}>
          {Array.from({ length: kpiCount }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
      {children ?? (
        <>
          <Skeleton className="h-28 rounded-[var(--ds-radius)]" />
          <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
        </>
      )}
    </Stack>
  );
}
