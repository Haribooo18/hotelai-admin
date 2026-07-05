import { MessageSquare } from "lucide-react";

export function EmptyConversation() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[var(--ds-radius)] bg-[var(--shell-surface-raised)]">
        <MessageSquare className="h-8 w-8 text-[var(--shell-muted)]" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--shell-text)]">
          Select a conversation
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[var(--shell-muted)]">
          Choose a conversation from the list on the left to view messages and
          manage the guest inquiry.
        </p>
      </div>
    </div>
  );
}
