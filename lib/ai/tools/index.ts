import { cancelBookingTool } from "./cancel-booking";
import { checkAvailabilityTool } from "./check-availability";
import { createBookingTool } from "./create-booking";
import { getGuestTool } from "./get-guest";
import { getRoomTool } from "./get-room";
import { searchKnowledgeTool } from "./search-knowledge";
import { updateBookingTool } from "./update-booking";
import { requestHumanHandoffTool } from "./request-human-handoff";

import type { AITool } from "../tools";

/** All built-in tools — auto-discovered by ToolRegistry. */
export const discoveredTools: AITool[] = [
  checkAvailabilityTool,
  createBookingTool,
  updateBookingTool,
  cancelBookingTool,
  searchKnowledgeTool,
  getGuestTool,
  getRoomTool,
  requestHumanHandoffTool,
];

export {
  checkAvailabilityTool,
  createBookingTool,
  updateBookingTool,
  cancelBookingTool,
  searchKnowledgeTool,
  getGuestTool,
  getRoomTool,
  requestHumanHandoffTool,
};
