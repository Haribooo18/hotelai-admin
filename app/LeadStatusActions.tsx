"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateLeadStatus } from "@/lib/services/leads.mutations";
import type { LeadStatus } from "@/types/lead";

import { Button } from "@/components/ui/button";

type Props = {
  leadId: string;
  currentStatus: string | null;
};

export function LeadStatusActions({ leadId, currentStatus }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const status = currentStatus ?? "new";

  function handleUpdate(nextStatus: LeadStatus) {
    startTransition(async () => {
      try {
        await updateLeadStatus({ leadId, status: nextStatus });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update request status");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        disabled={pending || status === "contacted"}
        onClick={() => handleUpdate("contacted")}
        className="px-3 py-1 text-xs"
      >
        Contacted
      </Button>

      <Button
        disabled={pending || status === "confirmed"}
        onClick={() => handleUpdate("confirmed")}
        className="bg-emerald-700 px-3 py-1 text-xs text-white hover:bg-emerald-600"
      >
        Confirm
      </Button>

      <Button
        variant="destructive"
        disabled={pending || status === "cancelled"}
        onClick={() => handleUpdate("cancelled")}
        className="px-3 py-1 text-xs"
      >
        Cancel
      </Button>
    </div>
  );
}
