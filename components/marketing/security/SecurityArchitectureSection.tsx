import { ArrowDown } from "lucide-react";

import {
  mktOverlineClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { SECURITY_PAGE_ARCHITECTURE } from "@/lib/marketing/security-page";

export function SecurityArchitectureSection() {
  const [workspace, security, platform, database, infrastructure] =
    SECURITY_PAGE_ARCHITECTURE.steps;

  return (
    <section
      id={SECURITY_PAGE_ARCHITECTURE.sectionId}
      className="mkt-features-section"
      aria-labelledby="security-architecture-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>
            {SECURITY_PAGE_ARCHITECTURE.overline}
          </p>

          <h2
            id="security-architecture-heading"
            className={`${mktSectionHeadlineClass} max-w-4xl`}
          >
            {SECURITY_PAGE_ARCHITECTURE.headline}
          </h2>

          <p className={`${mktSectionSubheadClass} max-w-3xl`}>
            {SECURITY_PAGE_ARCHITECTURE.subhead}
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl">
          <div className="space-y-4">
            <ArchitectureLayer
              title={workspace.label}
              variant="primary"
            />

            <Connector />

            <ArchitectureLayer
              title="Security Layer"
              description={`${security.label} • ${platform.label}`}
            />

            <Connector />

            <ArchitectureLayer
              title={database.label}
            />

            <Connector />

            <ArchitectureLayer
              title={infrastructure.label}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Connector() {
  return (
    <div className="flex justify-center">
      <ArrowDown
        className="size-5 text-muted-foreground/35"
        strokeWidth={1.5}
        aria-hidden
      />
    </div>
  );
}

function ArchitectureLayer({
  title,
  description,
  variant,
}: {
  title: string;
  description?: string;
  variant?: "primary";
}) {
  return (
    <div
      className={[
        "rounded-[1.5rem] border p-6 text-center",
        variant === "primary"
          ? "border-primary/20 bg-primary/5"
          : "border-border/70 bg-card",
      ].join(" ")}
    >
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}