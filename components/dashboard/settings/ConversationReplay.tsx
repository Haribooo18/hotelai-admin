import type { AIAction } from "@/types/ai-action";

type Props = {
  actions: AIAction[];
};

export function ConversationReplay({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Нет записей AI для этого диалога.</p>
    );
  }

  return (
    <ol className="space-y-3" aria-label="История AI-действий">
      {actions.map((action) => (
        <li
          key={action.id}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-zinc-200">
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

          <p className="mt-1 text-xs text-zinc-500">
            {new Date(action.created_at).toLocaleString("ru-RU")}
            {action.model ? ` · ${action.model}` : ""}
            {action.duration_ms ? ` · ${action.duration_ms} мс` : ""}
            {action.cost_usd != null ? ` · $${Number(action.cost_usd).toFixed(6)}` : ""}
          </p>

          {action.error_message && (
            <p className="mt-2 text-xs text-red-400">{action.error_message}</p>
          )}

          {action.token_usage &&
            typeof action.token_usage === "object" &&
            "total_tokens" in action.token_usage && (
              <p className="mt-1 text-xs text-zinc-500">
                Токены: {String((action.token_usage as { total_tokens: number }).total_tokens)}
              </p>
            )}
        </li>
      ))}
    </ol>
  );
}
