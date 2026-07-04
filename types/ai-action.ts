export type AIActionStatus = "pending" | "completed" | "failed";

export type AIAction = {
  id: string;
  hotel_id: string;

  conversation_id: string | null;
  message_id: string | null;

  action_type: string;
  tool_name: string | null;

  input: Record<string, unknown>;
  output: Record<string, unknown> | null;

  status: AIActionStatus;
  error_message: string | null;

  created_at: string;
  completed_at: string | null;
};
