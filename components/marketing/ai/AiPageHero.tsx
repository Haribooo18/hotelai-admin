"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import {
  mktMotionRevealClass,
  mktPageHeroHeadlineClass,
} from "@/lib/marketing/design";
import {
  AI_PAGE_HERO,
  type AiHeroConversation,
} from "@/lib/marketing/ai-page";
import { cn } from "@/lib/utils";

type ChatPhase = "guest" | "typing" | "reply" | "outcome" | "revenue";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);

  media.addEventListener("change", onStoreChange);

  return () => {
    media.removeEventListener("change", onStoreChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function buildPhases(conversation: AiHeroConversation): ChatPhase[] {
  const phases: ChatPhase[] = ["guest", "typing", "reply", "outcome"];

  if (conversation.revenue) {
    phases.push("revenue");
  }

  return phases;
}

const HOLD_MS: Record<ChatPhase, number> = {
  guest: 1100,
  typing: 800,
  reply: 1200,
  outcome: 900,
  revenue: 1600,
};

const PHASE_RANK: Record<ChatPhase, number> = {
  guest: 0,
  typing: 1,
  reply: 2,
  outcome: 3,
  revenue: 4,
};

export function AiPageHero() {
  const events = AI_PAGE_HERO.liveEvents;
  const conversations = AI_PAGE_HERO.conversations;

  const [activeIndex, setActiveIndex] = useState(0);
  const [conversationIndex, setConversationIndex] = useState(0);
  const [animatedPhase, setAnimatedPhase] =
    useState<ChatPhase>("guest");

  const reduceMotion = useReducedMotion();

  const conversation =
    conversations[conversationIndex] ?? conversations[0];

  const phase: ChatPhase = reduceMotion
    ? conversation.revenue
      ? "revenue"
      : "outcome"
    : animatedPhase;

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const liveTimer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length);
    }, 1600);

    return () => {
      window.clearInterval(liveTimer);
    };
  }, [events.length, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const phases = buildPhases(conversation);
    let step = 0;
    let timer: number | undefined;

    const scheduleNextPhase = () => {
      const currentPhase = phases[step] ?? "guest";

      timer = window.setTimeout(() => {
        if (step >= phases.length - 1) {
          setAnimatedPhase("guest");
          setConversationIndex(
            (current) => (current + 1) % conversations.length
          );
          return;
        }

        step += 1;
        setAnimatedPhase(phases[step] ?? "guest");
        scheduleNextPhase();
      }, HOLD_MS[currentPhase]);
    };

    scheduleNextPhase();

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [
    conversation,
    conversationIndex,
    conversations.length,
    reduceMotion,
  ]);

  const visibleEvents = [
    events[(activeIndex + events.length - 1) % events.length],
    events[activeIndex],
    events[(activeIndex + 1) % events.length],
  ];

  const rank = PHASE_RANK[phase];
  const showTyping = phase === "typing";
  const showReply = rank >= PHASE_RANK.reply;
  const showOutcome = rank >= PHASE_RANK.outcome;
  const showRevenue =
    phase === "revenue" && Boolean(conversation.revenue);
  const showAiSlot = showTyping || showReply;

  const timeline = [
    {
      id: "reply",
      label: conversation.replyMeta,
      revealed: showTyping || showReply,
      active: phase === "typing" || phase === "reply",
      typing: showTyping,
    },
    {
      id: "approved",
      label: conversation.reply.replace(/\.$/, ""),
      revealed: showOutcome,
      active: phase === "outcome",
    },
    {
      id: "revenue",
      label: conversation.revenue
        ? `${conversation.revenue} Revenue`
        : "Revenue",
      revealed: showRevenue,
      active: phase === "revenue",
      money: true,
    },
  ];

  return (
    <section
      className="mkt-page-hero mkt-page-hero--ai"
      aria-labelledby="ai-page-hero-heading"
    >
      <div className="mkt-container-wide">
        <div className="mkt-ai-hero-grid">
          <div className="mkt-ai-hero-copy">
            <h1
              id="ai-page-hero-heading"
              className={cn(
                mktPageHeroHeadlineClass,
                "mkt-ai-hero-headline",
                mktMotionRevealClass
              )}
              data-order="0"
            >
              {AI_PAGE_HERO.headline}

              <span className="mkt-ai-hero-accent">
                {AI_PAGE_HERO.headlineAccent}
              </span>
            </h1>

            <ul
              className={cn(
                "mkt-ai-hero-lines",
                mktMotionRevealClass
              )}
              data-order="1"
              role="list"
            >
              {AI_PAGE_HERO.lines.map((line) => (
                <li key={line} role="listitem">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={cn(
              "mkt-ai-hero-stage",
              mktMotionRevealClass
            )}
            data-order="2"
          >
            <div
              className="mkt-ai-hero-canvas"
              aria-label="Monavel AI at work"
            >
              <article
                key={conversation.id}
                className="mkt-ai-hero-chat"
                aria-live="polite"
                data-phase={phase}
              >
                <div
                  className="mkt-ai-hero-chat-slot mkt-ai-hero-chat-slot--guest"
                  data-visible="true"
                >
                  <div className="mkt-ai-hero-chat-bubble mkt-ai-hero-chat-bubble--guest">
                    <p className="mkt-ai-hero-chat-role">Guest</p>

                    <p className="mkt-ai-hero-chat-text">
                      {conversation.guest}
                    </p>
                  </div>
                </div>

                <div
                  className="mkt-ai-hero-chat-slot mkt-ai-hero-chat-slot--ai"
                  data-visible={showAiSlot ? "true" : "false"}
                >
                  {showTyping ? (
                    <div
                      className="mkt-ai-hero-chat-bubble mkt-ai-hero-chat-bubble--ai"
                      aria-label="Monavel AI is typing"
                    >
                      <p className="mkt-ai-hero-chat-role">
                        Monavel AI
                      </p>

                      <p
                        className="mkt-ai-hero-typing"
                        aria-hidden
                      >
                        <span />
                        <span />
                        <span />
                      </p>
                    </div>
                  ) : (
                    <div className="mkt-ai-hero-chat-bubble mkt-ai-hero-chat-bubble--ai">
                      <p className="mkt-ai-hero-chat-role">
                        Monavel AI
                      </p>

                      <p className="mkt-ai-hero-chat-text">
                        {conversation.reply}
                      </p>
                    </div>
                  )}
                </div>

                <div
                  className="mkt-ai-hero-chat-slot mkt-ai-hero-chat-slot--result"
                  data-visible={showOutcome ? "true" : "false"}
                >
                  <div className="mkt-ai-hero-result">
                    <p className="mkt-ai-hero-result-outcome">
                      {conversation.outcome}
                    </p>

                    {showRevenue && conversation.revenue ? (
                      <p className="mkt-ai-hero-result-revenue">
                        {conversation.revenue}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>

              <ol
                className="mkt-ai-hero-progress"
                role="list"
                aria-label="Result timeline"
              >
                {timeline.map((step, index) => (
                  <li
                    key={step.id}
                    className={cn(
                      "mkt-ai-hero-progress-step",
                      step.revealed &&
                        "mkt-ai-hero-progress-step--revealed",
                      step.active &&
                        "mkt-ai-hero-progress-step--active",
                      step.money &&
                        "mkt-ai-hero-progress-step--money"
                    )}
                    data-revealed={
                      step.revealed ? "true" : "false"
                    }
                    role="listitem"
                  >
                    {index > 0 ? (
                      <span
                        className="mkt-ai-hero-progress-sep"
                        aria-hidden
                      >
                        •
                      </span>
                    ) : null}

                    <span className="mkt-ai-hero-progress-label">
                      {step.typing ? (
                        <span
                          className="mkt-ai-hero-workflow-typing"
                          aria-hidden
                        >
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        step.label
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <aside
              className="mkt-ai-hero-live"
              aria-label="Live hotel activity"
            >
              <p className="mkt-ai-hero-live-label">
                <span
                  className="mkt-ai-hero-live-dot"
                  aria-hidden
                />
                Live
              </p>

              <ul
                className="mkt-ai-hero-live-list"
                role="list"
              >
                {visibleEvents.map((event, index) => (
                  <li
                    key={`${event.id}-${activeIndex}-${index}`}
                    className={cn(
                      "mkt-ai-hero-live-item",
                      index === 1 &&
                        "mkt-ai-hero-live-item--active",
                      event.kind === "revenue" ||
                        event.kind === "booking"
                        ? "mkt-ai-hero-live-item--money"
                        : null
                    )}
                    data-kind={event.kind}
                    role="listitem"
                  >
                    <span className="mkt-ai-hero-live-title">
                      {event.label}
                    </span>

                    <span className="mkt-ai-hero-live-detail">
                      {event.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}