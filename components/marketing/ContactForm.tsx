"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
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
      <Button type="submit" className="w-full">
        Send
      </Button>
    </form>
  );
}
