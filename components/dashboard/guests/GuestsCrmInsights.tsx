"use client";

import { useMemo } from "react";
import { Globe, Languages, Users } from "lucide-react";

import { DataCard } from "@/components/ui/data/DataCard";
import { Metric } from "@/components/ui/display/Metric";
import { SkeletonGroup } from "@/components/ui/display/Skeleton";
import { WorkspaceEmptyState } from "@/components/dashboard/shared/WorkspaceEmptyState";
import { Section } from "@/components/ui/primitives/Section";
import { useI18n } from "@/lib/i18n";

import { GuestAvatar } from "./GuestAvatar";
import { GuestTags } from "./GuestTags";
import {
  formatGuestCurrency,
  formatGuestDateTime,
  type GuestCardModel,
} from "./guest-crm-metrics";
import {
  getGuestLanguageLabel,
  GuestOpsListItem,
} from "./guests-ui";

type Props = {
  models: GuestCardModel[];
  loading?: boolean;
  onSelect?: (model: GuestCardModel) => void;
};

function GuestInsightList({
  models,
  emptyTitle,
  emptyDescription,
  onSelect,
}: {
  models: GuestCardModel[];
  emptyTitle: string;
  emptyDescription: string;
  onSelect?: (model: GuestCardModel) => void;
}) {
  if (models.length === 0) {
    return (
      <WorkspaceEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Users size={16} />}
      />
    );
  }

  return (
    <div className="space-y-2" role="list">
      {models.slice(0, 5).map((model) => {
        const fullName =
          `${model.guest.first_name} ${model.guest.last_name}`.trim();

        return (
          <GuestOpsListItem
            key={model.guest.id}
            role="listitem"
            aria-label={fullName}
            onClick={() => onSelect?.(model)}
          >
            <div className="flex items-start gap-3">
              <GuestAvatar
                firstName={model.guest.first_name}
                lastName={model.guest.last_name}
                avatarUrl={model.guest.avatar_url}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-[13px] font-medium text-[var(--shell-text)]">
                    {fullName}
                  </p>
                  <p className="shrink-0 text-[12px] font-semibold text-[var(--shell-text)]">
                    {formatGuestCurrency(model.guest.total_spent)}
                  </p>
                </div>
                <div className="mt-1.5">
                  <GuestTags
                    tags={model.guest.tags.slice(0, 1)}
                    isVip={model.guest.is_vip}
                  />
                </div>
              </div>
            </div>
          </GuestOpsListItem>
        );
      })}
    </div>
  );
}

export function GuestsCrmInsights({
  models,
  loading = false,
  onSelect,
}: Props) {
  const { t } = useI18n();

  const vipGuests = useMemo(
    () => models.filter((model) => model.guest.is_vip),
    [models]
  );

  const returningGuests = useMemo(
    () => models.filter((model) => model.guest.total_bookings > 1),
    [models]
  );

  const topSpenders = useMemo(
    () =>
      [...models].sort(
        (a, b) => b.guest.total_spent - a.guest.total_spent
      ),
    [models]
  );

  const newGuests = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return models.filter(
      (model) => new Date(model.guest.created_at) >= weekAgo
    );
  }, [models]);

  const recentActivity = useMemo(
    () =>
      [...models].sort(
        (a, b) =>
          new Date(b.guest.updated_at).getTime() -
          new Date(a.guest.updated_at).getTime()
      ),
    [models]
  );

  const countries = useMemo(() => {
    const map = new Map<string, number>();

    for (const model of models) {
      const country = model.guest.country;
      if (!country) continue;
      map.set(country, (map.get(country) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [models]);

  const languages = useMemo(() => {
    const map = new Map<string, number>();

    for (const model of models) {
      const language = getGuestLanguageLabel(model.guest);
      if (!language) continue;
      map.set(language, (map.get(language) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [models]);

  if (loading) {
    return (
      <Section
        title={t("guests.crmInsightsTitle")}
        subtitle={t("guests.crmInsightsSubtitle")}
      >
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <DataCard key={index} title={t("guests.crmLoading")}>
              <SkeletonGroup />
            </DataCard>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section
      title={t("guests.crmInsightsTitle")}
      subtitle={t("guests.crmInsightsSubtitle")}
    >
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <DataCard
          interactive
          title={t("guests.crmVipTitle")}
          subtitle={`${vipGuests.length}`}
        >
          <GuestInsightList
            models={vipGuests}
            emptyTitle={t("guests.crmVipTitle")}
            emptyDescription={t("guests.crmVipEmptyDesc")}
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmReturningTitle")}
          subtitle={`${returningGuests.length}`}
        >
          <GuestInsightList
            models={returningGuests}
            emptyTitle={t("guests.crmReturningEmpty")}
            emptyDescription={t("guests.crmReturningEmptyDesc")}
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmTopSpendersTitle")}
          subtitle={t("guests.crmTopSpendersSubtitle")}
        >
          <GuestInsightList
            models={topSpenders}
            emptyTitle={t("guests.crmNoRevenue")}
            emptyDescription={t("guests.crmNoRevenueDesc")}
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmNewGuestsTitle")}
          subtitle={t("guests.crmNewGuestsSubtitle")}
        >
          <GuestInsightList
            models={newGuests}
            emptyTitle={t("guests.crmNoNewGuests")}
            emptyDescription={t("guests.crmNoNewGuestsDesc")}
            onSelect={onSelect}
          />
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmRecentActivityTitle")}
          subtitle={t("guests.crmRecentActivitySubtitle")}
        >
          {recentActivity.length === 0 ? (
            <WorkspaceEmptyState
              title={t("guests.crmNoActivity")}
              description={t("guests.crmNoActivityDesc")}
              icon={<Users size={16} />}
            />
          ) : (
            <div className="space-y-2" role="list">
              {recentActivity.slice(0, 5).map((model) => {
                const fullName =
                  `${model.guest.first_name} ${model.guest.last_name}`.trim();

                return (
                  <div
                    key={model.guest.id}
                    className="rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2.5"
                  >
                    <p className="text-[12px] font-medium text-[var(--shell-text)]">
                      {fullName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[var(--shell-muted)]">
                      {formatGuestDateTime(model.guest.updated_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmCountriesTitle")}
          subtitle={t("guests.crmCountriesSubtitle")}
        >
          {countries.length === 0 ? (
            <WorkspaceEmptyState
              title={t("guests.crmNoCountry")}
              description={t("guests.crmNoCountryDesc")}
              icon={<Globe size={16} />}
            />
          ) : (
            <div className="space-y-2">
              {countries.slice(0, 6).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2"
                >
                  <span className="text-[12px] text-[var(--shell-text)]">
                    {item.label}
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--shell-text)]">
                    <Metric value={item.count} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        <DataCard
          interactive
          title={t("guests.crmLanguagesTitle")}
          subtitle={t("guests.crmLanguagesSubtitle")}
        >
          {languages.length === 0 ? (
            <WorkspaceEmptyState
              title={t("guests.crmNoLanguage")}
              description={t("guests.crmNoLanguageDesc")}
              icon={<Languages size={16} />}
            />
          ) : (
            <div className="space-y-2">
              {languages.slice(0, 6).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-[var(--ds-radius-sm)] bg-[var(--shell-surface-raised)]/60 px-3 py-2"
                >
                  <span className="text-[12px] text-[var(--shell-text)]">
                    {item.label}
                  </span>
                  <span className="text-[12px] font-semibold text-[var(--shell-text)]">
                    <Metric value={item.count} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </DataCard>
      </div>
    </Section>
  );
}
