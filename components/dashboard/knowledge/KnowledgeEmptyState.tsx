import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DashboardEmptyState } from "@/components/dashboard/home/DashboardPrimitives";

type Props = {
  onCreate?: () => void;
};

export function KnowledgeEmptyState({ onCreate }: Props) {
  return (
    <DashboardEmptyState
      title="Knowledge base is empty"
      description="Create articles with answers to common questions — the AI receptionist will use them when talking to guests."
      icon={<BookOpen size={20} />}
      action={
        onCreate ? (
          <Button size="sm" onClick={onCreate}>
            Create article
          </Button>
        ) : undefined
      }
    />
  );
}
