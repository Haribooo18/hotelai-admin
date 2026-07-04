import type { Metadata } from "next";

import { ContactForm } from "@/components/marketing";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с командой Monavel.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl font-bold">Контакты</h1>
      <p className="mt-4 text-zinc-400">
        Оставьте сообщение — мы ответим на вопросы о внедрении Monavel.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
      <p className="mt-8 text-sm text-zinc-500">
        Демо:{" "}
        <a
          href="mailto:hello@monavel.app?subject=Monavel Demo"
          className="text-emerald-400 hover:underline"
        >
          hello@monavel.app
        </a>
      </p>
    </div>
  );
}
