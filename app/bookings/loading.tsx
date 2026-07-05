import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";

export default function BookingsLoading() {
  return (
    <Stack gap="md" aria-busy="true" aria-label="Loading reservations">
      <Skeleton className="h-8 w-48 rounded-[var(--ds-radius-sm)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
      <Skeleton className="h-28 rounded-[var(--ds-radius)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-[var(--ds-radius)]" />
          ))}
        </div>
      </GlassSurface>
    </Stack>
  );
}
