import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";

export function SettingsRouteLoading() {
  return (
    <Stack gap="md" aria-busy="true" aria-label="Loading settings">
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Skeleton className="h-80 rounded-[var(--ds-radius)]" />
          <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
        </div>
        <Skeleton className="hidden min-h-[420px] rounded-[var(--ds-radius)] xl:block" />
      </div>
      <Skeleton className="h-48 rounded-[var(--ds-radius)]" />
    </Stack>
  );
}
