"use client";

import { useCallback, useState } from "react";

type LeadSource = "contact" | "demo";
type SubmitState = "idle" | "submitting" | "success" | "error";

type LeadPayload = {
  source: LeadSource;
  name: string;
  email: string;
  hotel?: string;
  country?: string;
  rooms?: string;
  preferredDate?: string;
  message?: string;
  website?: string;
};

type SubmitResult = {
  success: boolean;
  error?: string;
};

export function useMarketingLead(source: LeadSource) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (form: HTMLFormElement): Promise<SubmitResult> => {
      if (state === "submitting") {
        return { success: false, error: "Submission already in progress." };
      }

      setState("submitting");
      setError(null);

      const formData = new FormData(form);
      const payload: LeadPayload = {
        source,
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        hotel: String(formData.get("hotel") ?? ""),
        country: String(formData.get("country") ?? ""),
        rooms: String(formData.get("rooms") ?? ""),
        preferredDate: String(formData.get("preferred-date") ?? ""),
        message: String(formData.get("message") ?? ""),
        website: String(formData.get("website") ?? ""),
      };

      try {
        const response = await fetch("/api/marketing/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = (await response.json().catch(() => null)) as
          | { success?: boolean; error?: string }
          | null;

        if (!response.ok || !data?.success) {
          const message =
            data?.error ?? "We could not submit your request. Please try again.";
          setError(message);
          setState("error");
          return { success: false, error: message };
        }

        setState("success");
        form.reset();
        return { success: true };
      } catch {
        const message =
          "We could not connect to the server. Please check your connection and try again.";
        setError(message);
        setState("error");
        return { success: false, error: message };
      }
    },
    [source, state]
  );

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  return {
    submit,
    reset,
    state,
    error,
    isSubmitting: state === "submitting",
    isSuccess: state === "success",
  };
}
