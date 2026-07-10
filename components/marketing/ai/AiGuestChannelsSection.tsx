import { AiGuestChannelCard } from "@/components/marketing/ai/AiGuestChannelCard";
import {
  mktOverlineClass,
  mktSectionBodyClass,
  mktSectionHeadlineClass,
  mktSectionHeaderClass,
  mktSectionSubheadClass,
} from "@/lib/marketing/design";
import { AI_PAGE_GUEST_CHANNELS } from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

export function AiGuestChannelsSection() {
  return (
    <section
      id={AI_PAGE_GUEST_CHANNELS.sectionId}
      className="mkt-features-section"
      aria-labelledby="ai-channels-heading"
    >
      <div className="mkt-container-wide">
        <header className={mktSectionHeaderClass}>
          <p className={mktOverlineClass}>{AI_PAGE_GUEST_CHANNELS.overline}</p>
          <h2 id="ai-channels-heading" className={mktSectionHeadlineClass}>
            {AI_PAGE_GUEST_CHANNELS.headline}
          </h2>
          <p className={mktSectionSubheadClass}>{AI_PAGE_GUEST_CHANNELS.subhead}</p>
        </header>

        <ul
          className={cn(mktSectionBodyClass, "mkt-ai-page-channels-grid")}
          aria-label="Guest messaging channels"
        >
          {AI_PAGE_GUEST_CHANNELS.channels.map((channel) => (
            <AiGuestChannelCard key={channel.id} channel={channel} />
          ))}
        </ul>
      </div>
    </section>
  );
}
