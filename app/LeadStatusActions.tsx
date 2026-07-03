"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type Props = {
  leadId: string;
  currentStatus: string | null;
};

export function LeadStatusActions({ leadId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "new");
  const [loading, setLoading] = useState(false);

  async function updateStatus(nextStatus: string) {
    setLoading(true);

    const { error } = await supabase.rpc("update_lead_status", {
      p_lead_id: leadId,
      p_status: nextStatus,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setStatus(nextStatus);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="secondary"
        disabled={loading || status === "contacted"}
        onClick={() => updateStatus("contacted")}
        className="px-3 py-1 text-xs"
      >
        Связались
      </Button>

      <Button
        disabled={loading || status === "confirmed"}
        onClick={() => updateStatus("confirmed")}
        className="bg-emerald-700 px-3 py-1 text-xs text-white hover:bg-emerald-600"
      >
        Подтвердить
      </Button>

      <Button
        variant="destructive"
        disabled={loading || status === "cancelled"}
        onClick={() => updateStatus("cancelled")}
        className="px-3 py-1 text-xs"
      >
        Отменить
      </Button>
    </div>
  );
}