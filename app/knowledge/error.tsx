"use client";

import { KnowledgeError } from "@/components/dashboard/knowledge";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function KnowledgeErrorRoute({ error, reset }: Props) {
  return (
    <KnowledgeError
      message={error.message || "Failed to load knowledge base"}
      reset={reset}
    />
  );
}
