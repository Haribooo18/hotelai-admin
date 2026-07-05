import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";

export function RevenueRouteLoading() {
  return (
    <Stack gap="md" aria-busy="true" aria-label="Loading revenue">
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </GlassSurface>
      <Skeleton className="h-24 rounded-[var(--ds-radius)]" />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
        <Skeleton className="hidden min-h-[420px] rounded-[var(--ds-radius)] xl:block" />
      </div>
      <Skeleton className="h-48 rounded-[var(--ds-radius)]" />
    </Stack>
  );
}
