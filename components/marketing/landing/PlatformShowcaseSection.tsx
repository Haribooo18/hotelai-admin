import { WorkspacePreview } from "@/components/marketing/product/WorkspacePreview";
import { PlatformWorkspaceNav } from "@/components/marketing/landing/PlatformWorkspaceNav";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import {
  PLATFORM_SHOWCASE_CONTENT,
  PLATFORM_WORKSPACES,
} from "@/lib/marketing/platform";

export function PlatformShowcaseSection() {
  return (
    <section
      id={PLATFORM_SHOWCASE_CONTENT.sectionId}
      className="mkt-platform-section"
      aria-labelledby="platform-showcase-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{PLATFORM_SHOWCASE_CONTENT.overline}</p>
          <h2
            id="platform-showcase-heading"
            className={mktSectionHeadlineClass}
          >
            {PLATFORM_SHOWCASE_CONTENT.headline}
            <span className="block text-[var(--mkt-accent)]">
              {PLATFORM_SHOWCASE_CONTENT.headlineAccent}
            </span>
          </h2>
          <p className={mktSectionSubheadClass}>
            {PLATFORM_SHOWCASE_CONTENT.supporting}
          </p>
        </header>

        <div className={mktSectionBodyClass}>
          <PlatformWorkspaceNav workspaces={PLATFORM_WORKSPACES} />

          <div className="mkt-platform-showcase-visual">
            <WorkspacePreview presentation="platformShowcase" />
          </div>
        </div>
      </div>
    </section>
  );
}
