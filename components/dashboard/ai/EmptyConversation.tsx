import { MessageSquare, Sparkles } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";

export function EmptyConversation() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center bg-[var(--shell-surface)]/50 p-8">
      <DashboardEmptyState
        title="Select a conversation"
        description="Choose a thread from the inbox to review messages, AI analysis, and guest context."
        icon={<MessageSquare size={18} />}
      />

      <div className="mt-6 flex items-center gap-2 rounded-full bg-[var(--shell-accent-muted)]/50 px-3 py-1.5 text-[11px] text-[var(--shell-accent)]">
        <Sparkles size={12} />
        AI Operations Center
      </div>
    </div>
  );
}
