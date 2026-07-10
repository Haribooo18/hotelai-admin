import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import { PlatformWorkspaceNav } from "@/components/marketing/landing/PlatformWorkspaceNav";
import {
  mktOverlineClass,
  mktPlatformHeadlineClass,
  mktSubheadClass,
} from "@/lib/marketing/design";
import {
  PLATFORM_SHOWCASE_CONTENT,
  PLATFORM_WORKSPACES,
} from "@/lib/marketing/platform";
import { cn } from "@/lib/utils";

export function PlatformShowcaseSection() {
  return (
    <section
      id={PLATFORM_SHOWCASE_CONTENT.sectionId}
      className="mkt-platform-section"
      aria-labelledby="platform-showcase-heading"
    >
      <div className="mkt-container-wide">
        <header className="max-w-3xl">
          <p className={mktOverlineClass}>{PLATFORM_SHOWCASE_CONTENT.overline}</p>
          <h2
            id="platform-showcase-heading"
            className={cn(mktPlatformHeadlineClass, "mt-4")}
          >
            {PLATFORM_SHOWCASE_CONTENT.headline}
            <span className="block text-[var(--mkt-accent)]">
              {PLATFORM_SHOWCASE_CONTENT.headlineAccent}
            </span>
          </h2>
          <p className={cn(mktSubheadClass, "mt-6 max-w-2xl")}>
            {PLATFORM_SHOWCASE_CONTENT.supporting}
          </p>
        </header>

        <div className="mt-10 lg:mt-12">
          <PlatformWorkspaceNav workspaces={PLATFORM_WORKSPACES} />

          <div className="relative mt-6 lg:mt-8">
            <div className="mkt-product-halo pointer-events-none absolute inset-[4%_2%_2%]" aria-hidden />
            <WorkspacePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
