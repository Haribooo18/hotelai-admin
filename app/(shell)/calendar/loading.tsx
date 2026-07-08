import { Skeleton } from "@/components/ui/display/Skeleton";
import { GlassSurface } from "@/components/ui/primitives/GlassSurface";
import { Stack } from "@/components/ui/primitives/Stack";

export default function CalendarLoading() {
  return (
    <Stack gap="md" aria-busy="true" aria-label="Loading calendar">
      <Skeleton className="h-8 w-56 rounded-[var(--ds-radius-sm)]" />
      <GlassSurface className="p-[var(--ds-surface-padding)]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2 px-2 py-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </GlassSurface>
      <Skeleton className="h-32 rounded-[var(--ds-radius)]" />
      <Skeleton className="min-h-[420px] rounded-[var(--ds-radius)]" />
      <Skeleton className="h-12 rounded-[var(--ds-radius)]" />
    </Stack>
  );
}
