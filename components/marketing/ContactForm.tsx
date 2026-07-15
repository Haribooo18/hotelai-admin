"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMarketingLead } from "@/components/marketing/hooks/useMarketingLead";

export function ContactForm() {
  const { submit, error, isSubmitting, isSuccess } =
    useMarketingLead("contact");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit(event.currentTarget);
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-800 bg-emerald-950/30 p-6 text-center">
        <p className="font-medium text-emerald-300">Thank you for reaching out!</p>
        <p className="mt-2 text-sm text-zinc-400">
          We will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div aria-hidden="true" className="hidden">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="text-sm text-zinc-400">
          Name
        </label>
        <Input id="name" name="name" required className="mt-1" />
      </div>

      <div>
        <label htmlFor="email" className="text-sm text-zinc-400">
          Email
        </label>
        <Input id="email" name="email" type="email" required className="mt-1" />
      </div>

      <div>
        <label htmlFor="hotel" className="text-sm text-zinc-400">
          Hotel
        </label>
        <Input id="hotel" name="hotel" className="mt-1" />
      </div>

      <div>
        <label htmlFor="message" className="text-sm text-zinc-400">
          Message
        </label>
        <Textarea id="message" name="message" required rows={4} className="mt-1" />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
