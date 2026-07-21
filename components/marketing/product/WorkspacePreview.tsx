import {
  Activity,
  Check,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { ProductScreenshot } from "@/components/marketing/product/ProductScreenshot";
import type { PlatformWorkspaceId } from "@/lib/marketing/platform";
import { PLATFORM_DEFAULT_WORKSPACE_ID } from "@/lib/marketing/platform";
import type { ProductPresentationPreset } from "@/lib/marketing/product-presentation";
import { getWorkspacePreview } from "@/lib/marketing/workspace-previews";
import { cn } from "@/lib/utils";

type Props = {
  workspaceId?: PlatformWorkspaceId;
  priority?: boolean;
  className?: string;
  presentation?: ProductPresentationPreset;
};

export function WorkspacePreview({
  workspaceId = PLATFORM_DEFAULT_WORKSPACE_ID,
  priority = false,
  className,
  presentation,
}: Props) {
  if (presentation === "securityHero") {
    return <SecurityControlCenterPreview className={className} />;
  }

  const preview = getWorkspacePreview(workspaceId);

  return (
    <ProductScreenshot
      workspace={preview.workspace}
      title={preview.title}
      tabTitle={preview.tabTitle}
      productUrl={preview.productUrl}
      alt={preview.alt}
      media={preview.media}
      priority={priority}
      className={className}
      presentation={presentation}
    />
  );
}

function SecurityControlCenterPreview({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mkt-product-showcase mkt-product-showcase--emphasis",
        "overflow-hidden rounded-[1.75rem] border border-[color:var(--mkt-border-default)] bg-[var(--mkt-surface-1)] shadow-2xl shadow-black/10",
        className
      )}
      aria-label="Monavel Security Overview preview"
    >
      <div className="flex items-center justify-between border-b border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-inset)] px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
            <ShieldCheck className="size-4" strokeWidth={1.8} aria-hidden />
          </div>

          <div>
            <p className="text-sm font-semibold leading-5 text-[var(--mkt-text)]">
              Security Overview
            </p>
            <p className="text-[10px] leading-4 text-[var(--mkt-text-muted)]">
              Monavel Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-[var(--mkt-accent)] shadow-[0_0_8px_rgb(200_162_90/55%)]" />
          <span className="text-[10px] font-semibold text-[var(--mkt-accent)]">
            Protected
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-3.5 sm:p-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-surface-inset)] p-3.5">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--mkt-accent)] to-transparent opacity-60"
              aria-hidden
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium text-[var(--mkt-text-muted)]">
                  Security score
                </p>

                <p className="mt-0.5 text-xl font-semibold tracking-tight text-[var(--mkt-text)]">
                  99.98%
                </p>

                <p className="mt-0.5 text-[10px] leading-4 text-[var(--mkt-text-muted)]">
                  All protection layers active
                </p>
              </div>

              <div className="flex size-9 items-center justify-center rounded-full border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
                <ShieldCheck
                  className="size-[18px]"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--mkt-surface-3)]">
              <div className="relative h-full w-[96%] rounded-full bg-[var(--mkt-accent)]">
                <span className="absolute right-0 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[var(--mkt-accent-hover)] shadow-[0_0_9px_rgb(200_162_90/70%)]" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--mkt-text-muted)]">
              <span>Protection coverage</span>
              <span className="font-semibold text-[var(--mkt-text)]">
                7 / 7 controls
              </span>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <SecurityStatusCard
              icon={KeyRound}
              label="Authentication"
              value="MFA enabled"
              detail="Identity verified"
            />

            <SecurityStatusCard
              icon={UsersRound}
              label="Tenant isolation"
              value="Verified"
              detail="Workspace boundaries"
            />

            <SecurityStatusCard
              icon={LockKeyhole}
              label="Encryption"
              value="Active"
              detail="At rest and in transit"
            />

            <SecurityStatusCard
              icon={Activity}
              label="Monitoring"
              value="24/7"
              detail="Continuous detection"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-inset)] p-3.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold leading-5 text-[var(--mkt-text)]">
                Security events
              </p>
              <p className="text-[10px] leading-4 text-[var(--mkt-text-muted)]">
                Recent verified activity
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-2)] px-2 py-1 text-[9px] font-medium text-[var(--mkt-text-muted)]">
              Updated now
            </span>
          </div>

          <div className="mt-3 divide-y divide-[color:var(--mkt-border-subtle)]">
            <SecurityEvent
              title="Administrator signed in"
              detail="Identity verified"
              time="2m"
            />

            <SecurityEvent
              title="Access policy updated"
              detail="Role permissions changed"
              time="18m"
            />

            <SecurityEvent
              title="API token rotated"
              detail="Credential secured"
              time="1h"
            />

            <SecurityEvent
              title="Workspace boundary checked"
              detail="Tenant isolation verified"
              time="3h"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type IconComponent = typeof ShieldCheck;

function SecurityStatusCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="group flex min-h-[96px] items-start gap-3 rounded-xl border border-[color:var(--mkt-border-subtle)] bg-[var(--mkt-surface-inset)] px-3 py-3 transition-colors duration-200 hover:border-[color:var(--mkt-border-strong)] hover:bg-[var(--mkt-accent-muted)]">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
        <Icon className="size-4" strokeWidth={1.8} aria-hidden />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-medium leading-4 text-[var(--mkt-text-muted)]">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold leading-5 text-[var(--mkt-text)]">
          {value}
        </p>

        <p className="mt-0.5 text-[9px] leading-4 text-[var(--mkt-text-muted)]">
          {detail}
        </p>
      </div>
    </div>
  );
}

function SecurityEvent({
  title,
  detail,
  time,
}: {
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-2.5 py-2.5 first:pt-0 last:pb-0">
      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-[color:var(--mkt-border-strong)] bg-[var(--mkt-accent-muted)] text-[var(--mkt-accent)]">
        <Check className="size-3" strokeWidth={2} aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-medium leading-4 text-[var(--mkt-text)]">
          {title}
        </p>

        <p className="truncate text-[9px] leading-4 text-[var(--mkt-text-muted)]">
          {detail}
        </p>
      </div>

      <span className="shrink-0 pt-0.5 text-[9px] leading-4 text-[var(--mkt-text-subtle)]">
        {time}
      </span>
    </div>
  );
}