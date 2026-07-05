import type { AIAction } from "@/types/ai-action";

type Props = {
  actions: AIAction[];
};

export function ConversationReplay({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <p className="text-sm text-[var(--shell-muted)]">No AI records for this conversation.</p>
    );
  }

  return (
    <ol className="space-y-3" aria-label="AI action history">
      {actions.map((action) => (
        <li
          key={action.id}
          className="rounded-lg border border-[var(--shell-border)] bg-[var(--shell-surface-raised)] p-3 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-[var(--shell-text)]">
              {action.action_type}
              {action.tool_name ? ` · ${action.tool_name}` : ""}
            </span>
            <span
              className={
                action.status === "completed"
                  ? "text-emerald-400"
                  : action.status === "failed"
                    ? "text-red-400"
                    : "text-amber-400"
              }
            >
              {action.status}
            </span>
          </div>

          <p className="mt-1 text-xs text-[var(--shell-muted)]">
            {new Date(action.created_at).toLocaleString("en-US")}
            {action.model ? ` · ${action.model}` : ""}
            {action.duration_ms ? ` · ${action.duration_ms} ms` : ""}
            {action.cost_usd != null ? ` · $${Number(action.cost_usd).toFixed(6)}` : ""}
          </p>

          {action.error_message && (
            <p className="mt-2 text-xs text-red-400">{action.error_message}</p>
          )}

          {action.token_usage &&
            typeof action.token_usage === "object" &&
            "total_tokens" in action.token_usage && (
              <p className="mt-1 text-xs text-[var(--shell-muted)]">
                Tokens: {String((action.token_usage as { total_tokens: number }).total_tokens)}
              </p>
            )}
        </li>
      ))}
    </ol>
  );
}
