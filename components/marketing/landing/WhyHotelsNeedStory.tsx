"use client";

import type { CSSProperties } from "react";

import { mktMotionRevealClass, mktSectionBodyClass } from "@/lib/marketing/design";
import type { WhyNeedCardId } from "@/lib/marketing/why-hotels-need-story";
import { cn } from "@/lib/utils";

import {
  CommunicationDemoCard,
  HotelDataDemoCard,
  OperationsDemoCard,
  RevenueDemoCard,
} from "./WhyHotelsNeedCards";
import { useWhyHotelsNeedStory } from "./useWhyHotelsNeedStory";

const CARD_ORDER: Record<WhyNeedCardId, number> = {
  communication: 1,
  operations: 2,
  "hotel-data": 3,
  revenue: 4,
};

function isLiveActive(role: string, phase: string): boolean {
  if (phase === "runtimeMoment" || phase === "synchronized") return true;
  if (phase === "crossfade") return true;
  return role === "active" || role === "related" || role === "aligned" || role === "synced";
}

/**
 * Client scene: shared reservation reality across four systems.
 */
export function WhyHotelsNeedStory() {
  const snapshot = useWhyHotelsNeedStory(true);
  const allowUpdates =
    snapshot.phase === "propagating" && !snapshot.still && !snapshot.runtimeMoment;

  const identityProps = {
    identity: snapshot.identity,
    identityVisible: snapshot.identityVisible,
    identityOpacity: snapshot.identityOpacity,
  };

  return (
    <div
      className={cn(mktSectionBodyClass, "mkt-why-need-body", "mkt-why-need-body--story")}
      data-story-phase={snapshot.phase}
      data-event-id={snapshot.eventId}
      data-active-card={snapshot.activeCard ?? "none"}
      data-runtime-moment={snapshot.runtimeMoment ? "true" : undefined}
      data-still={snapshot.still ? "true" : undefined}
      style={
        {
          "--mkt-why-need-identity-opacity": String(snapshot.identityOpacity),
        } as CSSProperties
      }
    >
      <ul className="mkt-why-need-problems" role="list">
        <CommunicationDemoCard
          card={snapshot.communication}
          orderIndex={CARD_ORDER.communication}
          cardRole={snapshot.cardRoles.communication}
          updating={allowUpdates && snapshot.activeCard === "communication"}
          liveActive={isLiveActive(snapshot.cardRoles.communication, snapshot.phase)}
          className={mktMotionRevealClass}
          {...identityProps}
        />
        <OperationsDemoCard
          card={snapshot.operations}
          orderIndex={CARD_ORDER.operations}
          cardRole={snapshot.cardRoles.operations}
          updating={allowUpdates && snapshot.activeCard === "operations"}
          liveActive={isLiveActive(snapshot.cardRoles.operations, snapshot.phase)}
          className={mktMotionRevealClass}
          {...identityProps}
        />
        <HotelDataDemoCard
          card={snapshot.hotelData}
          orderIndex={CARD_ORDER["hotel-data"]}
          cardRole={snapshot.cardRoles["hotel-data"]}
          updating={allowUpdates && snapshot.activeCard === "hotel-data"}
          liveActive={isLiveActive(snapshot.cardRoles["hotel-data"], snapshot.phase)}
          className={mktMotionRevealClass}
          {...identityProps}
        />
        <RevenueDemoCard
          card={snapshot.revenue}
          orderIndex={CARD_ORDER.revenue}
          cardRole={snapshot.cardRoles.revenue}
          updating={allowUpdates && snapshot.activeCard === "revenue"}
          liveActive={isLiveActive(snapshot.cardRoles.revenue, snapshot.phase)}
          className={mktMotionRevealClass}
          {...identityProps}
        />
      </ul>
      <p className="sr-only" aria-live="polite">
        {snapshot.phase === "propagating"
          ? `${snapshot.identity.guestName}, reservation ${snapshot.identity.reservationId}. Updating ${snapshot.activeCard ?? "systems"}.`
          : snapshot.phase === "runtimeMoment"
            ? `${snapshot.identity.guestName}, reservation ${snapshot.identity.reservationId}, room ${snapshot.identity.room}. All systems aligned.`
            : snapshot.phase === "synchronized"
              ? `${snapshot.identity.guestName}, reservation ${snapshot.identity.reservationId}. Hotel systems operating as one.`
              : snapshot.phase === "crossfade"
                ? "Reservation context fading."
                : "Hotel systems are fragmented."}
      </p>
    </div>
  );
}
