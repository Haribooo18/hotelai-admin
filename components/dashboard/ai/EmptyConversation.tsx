import { MessageSquare, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { Badge } from "@/components/ui/display/Badge";
import { Surface } from "@/components/ui/primitives/Surface";

export function EmptyConversation() {
  return (
    <Surface
      interactive={false}
      className="flex h-full min-h-[400px] flex-col items-center justify-center bg-[var(--shell-surface)]/50 p-8"
    >
      <EmptyState
        title="Select a conversation"
        description="Choose a thread from the inbox to review messages, AI analysis, and guest context."
        icon={<MessageSquare size={18} />}
      />

      <Badge
        variant="success"
        className="mt-6 gap-1.5 px-3 py-1.5 text-[11px] normal-case"
      >
        <Sparkles size={12} aria-hidden />
        AI Operations Center
      </Badge>
    </Surface>
  );
}
