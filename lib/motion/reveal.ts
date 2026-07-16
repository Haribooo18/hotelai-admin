export type MotionRevealOrder = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const MOTION_REVEAL_DURATION_MS = 180;
export const MOTION_REVEAL_STAGGER_MS = 50;
export const MOTION_REVEAL_OFFSET_PX = 8;

export const motionRevealDelayClass = (order: MotionRevealOrder) =>
  `ds-motion-reveal-${order}`;
