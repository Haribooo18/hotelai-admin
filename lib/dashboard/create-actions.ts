export const CREATE_QUERY_PARAM = "create";

export const CREATE_QUERY_VALUE = "1";

export type CreateActionKey =
  | "reservation"
  | "guest"
  | "room"
  | "conversation"
  | "article";

export const CREATE_ACTION_ROUTES: Record<CreateActionKey, string> = {
  reservation: `/bookings?${CREATE_QUERY_PARAM}=${CREATE_QUERY_VALUE}`,
  guest: `/guests?${CREATE_QUERY_PARAM}=${CREATE_QUERY_VALUE}`,
  room: `/rooms?${CREATE_QUERY_PARAM}=${CREATE_QUERY_VALUE}`,
  conversation: `/ai?${CREATE_QUERY_PARAM}=${CREATE_QUERY_VALUE}`,
  article: `/knowledge?${CREATE_QUERY_PARAM}=${CREATE_QUERY_VALUE}`,
};
