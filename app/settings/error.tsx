"use client";

import { SettingsError } from "@/components/dashboard/settings/SettingsError";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SettingsErrorRoute({ error, reset }: Props) {
  return (
    <SettingsError
      message={error.message || "Failed to load settings"}
      reset={reset}
    />
  );
}
