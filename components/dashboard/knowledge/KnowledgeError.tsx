"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  reset?: () => void;
};

export function KnowledgeError({
  message = "Failed to load knowledge base",
  reset,
}: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 px-6 py-12 text-center"
      role="alert"
    >
      <AlertTriangle className="mb-3 text-red-400" size={32} />
      <p className="text-sm text-red-300">{message}</p>
      {reset && (
        <Button variant="outline" className="mt-4" onClick={reset}>
          Retry
        </Button>
      )}
    </div>
  );
}
