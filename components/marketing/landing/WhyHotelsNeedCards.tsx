import type { ComponentType } from "react";
import { Calendar, Check, Database, Globe, Mail, Phone, Send, Sparkles, TrendingUp, Users } from "lucide-react";

import type {
  ChannelIconId,
  CommunicationCard,
  HotelDataCard,
  OperationsCard,
  RevenueCard,
} from "@/lib/marketing/why-hotels-need";
import type {
  SharedGuestIdentity,
  WhyNeedCardRole,
} from "@/lib/marketing/why-hotels-need-story";

import { DemoCardShell, KpiSparkline, MiniMetric, RevenueSparkline } from "./WhyHotelsNeedPrimitives";

type IconComponent = ComponentType<{ size?: number; className?: string }>;

const CHANNEL_ICONS: Record<ChannelIconId, IconComponent> = {
  whatsapp: Phone,
  telegram: Send,
  booking: Globe,
  email: Mail,
};

const SOURCE_ICONS: Record<string, IconComponent> = {
  PMS: Database,
  CRM: Users,
  Calendar,
  Revenue: TrendingUp,
};

type DemoCardProps<T> = {
  card: T;
  orderIndex: number;
  className?: string;
  cardRole?: WhyNeedCardRole;
  updating?: boolean;
  identity: SharedGuestIdentity;
  identityVisible?: boolean;
  identityOpacity?: number;
  liveActive?: boolean;
};

export function CommunicationDemoCard({
  card,
  orderIndex,
  className,
  cardRole,
  updating,
  identity,
  identityVisible,
  identityOpacity,
  liveActive,
}: DemoCardProps<CommunicationCard>) {
  return (
    <DemoCardShell
      title={card.title}
      orderIndex={orderIndex}
      ariaLabel={card.summary}
      className={className}
      cardRole={cardRole}
      updating={updating}
      identity={identity}
      identityVisible={identityVisible}
      identityOpacity={identityOpacity}
      liveActive={liveActive}
    >
      <div className="mkt-why-need-comm-upper">
        <div className="mkt-why-need-channels">
          {card.channels.map((channel) => {
            const Icon = CHANNEL_ICONS[channel.id];
            const activeChannelId = card.messages[card.messages.length - 1]?.channelId;
            const isActive = channel.id === activeChannelId;
            return (
              <span
                key={channel.id}
                className="mkt-why-need-channel"
                data-active={isActive ? "true" : undefined}
              >
                <Icon size={10} />
                {channel.label}
              </span>
            );
          })}
        </div>

        <div className="mkt-why-need-inbox">
          {card.messages.map((message, index) => {
            const Icon = CHANNEL_ICONS[message.channelId];
            const isActive = index === card.messages.length - 1;
            return (
              <div
                key={message.time}
                className="mkt-why-need-inbox-row"
                data-active={isActive ? "true" : undefined}
              >
                <span className="mkt-why-need-inbox-icon">
                  <Icon size={9} />
                </span>
                <span className="mkt-why-need-inbox-text">{message.text}</span>
                {message.time ? (
                  <span className="mkt-why-need-inbox-time">{message.time}</span>
                ) : (
                  <span className="mkt-why-need-inbox-time" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mkt-why-need-comm-bridge" aria-hidden="true">
          <svg className="mkt-why-need-comm-bridge-svg" viewBox="0 0 100 18" preserveAspectRatio="none">
            <path className="mkt-why-need-comm-bridge-path" d="M18 0 V9 M50 0 V9 M82 0 V9" />
            <path className="mkt-why-need-comm-bridge-path mkt-why-need-comm-bridge-path--flow" d="M18 9 Q50 16 82 9" />
            <circle className="mkt-why-need-comm-bridge-pulse" cx="50" cy="13" r="1.5" />
            <circle className="mkt-why-need-comm-particle mkt-why-need-comm-particle--a" cx="30" cy="11" r="0.8" />
            <circle className="mkt-why-need-comm-particle mkt-why-need-comm-particle--b" cx="50" cy="13" r="0.8" />
            <circle className="mkt-why-need-comm-particle mkt-why-need-comm-particle--c" cx="70" cy="11" r="0.8" />
          </svg>
        </div>

        <div className="mkt-why-need-hub-row mkt-why-need-hub-row--ai">
          <span className="mkt-why-need-node mkt-why-need-node--hub">
            <span className="mkt-why-need-hub-ring" />
            {card.hub}
          </span>
          <span className="mkt-why-need-hub-status">
            <span className="mkt-why-need-hub-processing" aria-hidden="true">
              <span className="mkt-why-need-hub-dot" />
              <span className="mkt-why-need-hub-dot" />
              <span className="mkt-why-need-hub-dot" />
            </span>
            {card.hubStatus.endsWith("…") ? (
              <>
                <span className="mkt-why-need-hub-status-text">
                  {card.hubStatus.slice(0, -1)}
                </span>
                <span className="mkt-why-need-hub-status-dots" aria-hidden="true">
                  <span className="mkt-why-need-hub-status-dot" />
                  <span className="mkt-why-need-hub-status-dot" />
                  <span className="mkt-why-need-hub-status-dot" />
                </span>
              </>
            ) : (
              card.hubStatus
            )}
          </span>
        </div>
      </div>

      <span className="mkt-why-need-comm-flow-gap" aria-hidden="true">
        <svg className="mkt-why-need-comm-flow-svg" viewBox="0 0 4 14" preserveAspectRatio="none">
          <line className="mkt-why-need-comm-flow-line" x1="2" y1="0" x2="2" y2="14" />
          <circle className="mkt-why-need-comm-flow-pulse" cx="2" cy="7" r="1" />
        </svg>
      </span>

      <div className="mkt-why-need-guest-panel">
        <div className="mkt-why-need-guest-head">
          <span className="mkt-why-need-guest-avatar-wrap">
            <span className="mkt-why-need-guest-avatar">{card.guestName[0]}</span>
            <span className="mkt-why-need-guest-avatar-ring" />
          </span>
          <span className="mkt-why-need-guest-meta">
            <span className="mkt-why-need-guest-name">{card.guestName}</span>
            <span className="mkt-why-need-guest-badge">{card.guestStatus}</span>
          </span>
        </div>
        <div className="mkt-why-need-guest-divider" />
        <div className="mkt-why-need-guest-chips">
          {card.contextChips.map((chip, index) => (
            <span
              key={chip}
              className="mkt-why-need-guest-chip"
              data-reveal={index === card.contextChips.length - 1 ? "staged" : undefined}
              data-fresh={updating && index === card.contextChips.length - 1 ? "true" : undefined}
            >
              {chip}
            </span>
          ))}
        </div>
        <div className="mkt-why-need-guest-footer" data-state="complete">
          <span className="mkt-why-need-guest-footer-check">
            <Check size={9} />
          </span>
          <span className="mkt-why-need-guest-footer-label">{card.footerLabel}</span>
          <span className="mkt-why-need-guest-footer-time">{card.footerTime}</span>
        </div>
      </div>
    </DemoCardShell>
  );
}

export function OperationsDemoCard({
  card,
  orderIndex,
  className,
  cardRole,
  updating,
  identity,
  identityVisible,
  identityOpacity,
  liveActive,
}: DemoCardProps<OperationsCard>) {
  return (
    <DemoCardShell
      title={card.title}
      orderIndex={orderIndex}
      ariaLabel={card.summary}
      className={className}
      cardRole={cardRole}
      updating={updating}
      identity={identity}
      identityVisible={identityVisible}
      identityOpacity={identityOpacity}
      liveActive={liveActive}
    >
      <div className="mkt-why-need-ops-track">
        <span className="mkt-why-need-ops-line" />
        {card.stages.map((stage, index) => (
          <div
            key={stage.label}
            className="mkt-why-need-ops-row"
            data-state={stage.state}
            data-stage-index={index}
          >
            <span className="mkt-why-need-ops-node">
              {stage.state === "completed" ? <Check size={8} /> : null}
            </span>
            <span className="mkt-why-need-ops-label">
              {stage.label}
              {stage.state === "current" ? (
                <span className="mkt-why-need-ops-current">In progress</span>
              ) : null}
            </span>
            {stage.assigneeInitial ? (
              <span className="mkt-why-need-ops-assignee">
                <span className="mkt-why-need-ops-avatar">{stage.assigneeInitial}</span>
                {stage.eta}
              </span>
            ) : null}
            <span className="mkt-why-need-ops-time">
              {stage.time ? stage.time : null}
            </span>
          </div>
        ))}
      </div>

      <div className="mkt-why-need-room-panel" data-fresh={updating ? "true" : undefined}>
        <span className="mkt-why-need-room-label">{card.roomLabel}</span>
        <span className="mkt-why-need-room-status">{card.roomStatus}</span>
        <span className="mkt-why-need-room-note">{card.roomNote}</span>
      </div>
    </DemoCardShell>
  );
}

const ACTIVITY_SYNC_ORDER: Record<string, number> = {
  "Booking imported": 1,
  "Revenue synced": 2,
  "Guest profile updated": 3,
  "Room status changed": 4,
  "Stale PMS export": 1,
  "CRM pending": 2,
  "Calendar offline": 3,
  "Revenue delayed": 4,
};

export function HotelDataDemoCard({
  card,
  orderIndex,
  className,
  cardRole,
  updating,
  identity,
  identityVisible,
  identityOpacity,
  liveActive,
}: DemoCardProps<HotelDataCard>) {
  return (
    <DemoCardShell
      title={card.title}
      orderIndex={orderIndex}
      ariaLabel={card.summary}
      className={className}
      cardRole={cardRole}
      updating={updating}
      identity={identity}
      identityVisible={identityVisible}
      identityOpacity={identityOpacity}
      liveActive={liveActive}
    >
      <div className="mkt-why-need-sync-stack">
        <div className="mkt-why-need-sources">
          {card.sources.map((source) => {
            const Icon = SOURCE_ICONS[source.label] ?? Database;
            return (
              <div key={source.label} className="mkt-why-need-source">
                <span className="mkt-why-need-source-dot" />
                <span className="mkt-why-need-source-icon">
                  <Icon size={10} />
                </span>
                <span className="mkt-why-need-source-label">{source.label}</span>
                <span className="mkt-why-need-source-value">{source.value}</span>
              </div>
            );
          })}
        </div>

        <div className="mkt-why-need-sync-bridge" aria-hidden="true">
          <svg className="mkt-why-need-sync-bridge-svg" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path className="mkt-why-need-sync-bridge-path" d="M25 0 V8 M75 0 V8" />
            <path className="mkt-why-need-sync-bridge-path mkt-why-need-sync-bridge-path--flow" d="M25 8 Q50 17 75 8" />
            <circle className="mkt-why-need-sync-bridge-pulse" cx="50" cy="14" r="1.5" />
          </svg>
        </div>

        <div className="mkt-why-need-hub-row mkt-why-need-hub-row--data">
          <span className="mkt-why-need-node mkt-why-need-node--hub">
            <Database size={10} />
            {card.hub}
          </span>
          <span className="mkt-why-need-hub-status">{card.hubStatus}</span>
        </div>
      </div>

      <span className="mkt-why-need-data-connector" aria-hidden="true" />

      <div className="mkt-why-need-dashboard">
        <span className="mkt-why-need-dashboard-title">{card.dashboardLabel}</span>
        <div className="mkt-why-need-dashboard-grid">
          {card.metrics.map((metric, index) => (
            <MiniMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              delta={metric.delta}
              percent={metric.percent}
              visual={metric.visual}
              sparkIndex={index}
              metricIndex={index}
            />
          ))}
        </div>
      </div>

      <div className="mkt-why-need-activity">
        <span className="mkt-why-need-activity-title">{card.activityLabel}</span>
        <ul className="mkt-why-need-activity-list">
          {card.activities.map((activity, index) => (
            <li
              key={`${activity.label}-${activity.time}-${index}`}
              className="mkt-why-need-activity-row"
              data-sync-order={ACTIVITY_SYNC_ORDER[activity.label] ?? index + 1}
              data-fresh={updating && index === 0 ? "true" : undefined}
            >
              <span className="mkt-why-need-activity-check">
                <Check size={8} />
              </span>
              <span className="mkt-why-need-activity-label">{activity.label}</span>
              {activity.time ? (
                <span className="mkt-why-need-activity-time">{activity.time}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="mkt-why-need-footer-row" data-fresh={updating ? "true" : undefined}>
        <span className="mkt-why-need-footer-text">
          {card.footerLabel} <strong>{card.footerTime}</strong>
        </span>
        <span className="mkt-why-need-sync-chip">
          <span className="mkt-why-need-sync-dot" />
          {card.syncLabel}
        </span>
      </div>
    </DemoCardShell>
  );
}

export function RevenueDemoCard({
  card,
  orderIndex,
  className,
  cardRole,
  updating,
  identity,
  identityVisible,
  identityOpacity,
  liveActive,
}: DemoCardProps<RevenueCard>) {
  return (
    <DemoCardShell
      title={card.title}
      orderIndex={orderIndex}
      ariaLabel={card.summary}
      className={className}
      cardRole={cardRole}
      updating={updating}
      identity={identity}
      identityVisible={identityVisible}
      identityOpacity={identityOpacity}
      liveActive={liveActive}
    >
      <div className="mkt-why-need-rev-flow">
        <div className="mkt-why-need-rev-kpis">
          {card.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="mkt-why-need-rev-kpi"
              data-kpi={kpi.label === "Current ADR" ? "adr" : undefined}
            >
              <span className="mkt-why-need-rev-kpi-label">{kpi.label}</span>
              <span className="mkt-why-need-rev-kpi-value">{kpi.value}</span>
              {kpi.sparkPoints ? <KpiSparkline points={kpi.sparkPoints} /> : null}
              {kpi.delta ? (
                <span className="mkt-why-need-rev-kpi-delta">{kpi.delta}</span>
              ) : null}
            </div>
          ))}
        </div>

        <span className="mkt-why-need-rev-connector" aria-hidden="true" />

        <div className="mkt-why-need-ai-panel">
          <div className="mkt-why-need-ai-panel-head">
            <span className="mkt-why-need-ai-badge">
              <Sparkles size={9} />
              {card.recommendationLabel}
            </span>
            <span
              className="mkt-why-need-demand-chip"
              data-fresh={updating ? "true" : undefined}
            >
              {card.demandLabel}
            </span>
          </div>
          <div className="mkt-why-need-ai-panel-prices">
            <span className="mkt-why-need-price-old">{card.adrCurrent}</span>
            <span className="mkt-why-need-rev-arrow">→</span>
            <span className="mkt-why-need-price-new-wrap">
              <span
                className="mkt-why-need-price-new"
                data-fresh={updating ? "true" : undefined}
              >
                {card.adrRecommended}
              </span>
            </span>
          </div>
          {card.confidencePercent > 0 ? (
            <div className="mkt-why-need-confidence">
              <span className="mkt-why-need-confidence-label">{card.confidenceLabel}</span>
              <span className="mkt-why-need-confidence-bar">
                <span
                  className="mkt-why-need-confidence-fill"
                  style={{ width: `${card.confidencePercent}%` }}
                />
              </span>
              <span className="mkt-why-need-confidence-value">
                {card.confidencePercent}%
              </span>
            </div>
          ) : null}
        </div>

        <span className="mkt-why-need-rev-connector" aria-hidden="true" />

        <div className="mkt-why-need-impact-panel" data-fresh={updating ? "true" : undefined}>
          <div className="mkt-why-need-impact-head">
            <span className="mkt-why-need-impact-label">{card.impactLabel}</span>
            <span className="mkt-why-need-impact-value">{card.impactValue}</span>
          </div>
          <div className="mkt-why-need-chart-frame">
            <RevenueSparkline points={card.chartPoints} />
          </div>
          <span className="mkt-why-need-impact-delta">{card.impactDelta}</span>
        </div>
      </div>

      <div className="mkt-why-need-action-row">
        <span className="mkt-why-need-action-dot" />
        <span className="mkt-why-need-action-label">{card.actionLabel}</span>
        <span
          className="mkt-why-need-action-timer"
          data-fresh={updating ? "true" : undefined}
        >
          {card.actionTimer}
        </span>
      </div>
    </DemoCardShell>
  );
}
