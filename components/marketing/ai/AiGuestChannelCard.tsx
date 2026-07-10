import type { AiPageChannel } from "@/lib/marketing/ai-page";

type Props = {
  channel: AiPageChannel;
};

export function AiGuestChannelCard({ channel }: Props) {
  const Icon = channel.icon;

  return (
    <li className="mkt-features-integration-card">
      <div className="mkt-features-workspace-icon" aria-hidden>
        <Icon className="size-5" strokeWidth={1.5} />
      </div>
      <div className="mkt-features-integration-header">
        <h3 className="mkt-features-card-title">{channel.title}</h3>
        {channel.status === "planned" ? (
          <span className="mkt-features-integration-badge">Planned</span>
        ) : null}
      </div>
      <p className="mkt-features-card-description mt-2">{channel.description}</p>
    </li>
  );
}
