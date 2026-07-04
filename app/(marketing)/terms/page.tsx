import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Условия использования",
  description: "Условия использования сервиса Monavel.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">Условия использования</h1>
      <p className="mt-4 text-zinc-400">
        Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
      </p>

      <section className="mt-8 space-y-4 text-sm text-zinc-300">
        <p>
          Используя Monavel, вы соглашаетесь с условиями предоставления сервиса
          AI-ресепшна и панели управления отелем.
        </p>
        <p>
          Подписка оформляется через Stripe. Отмена и управление тарифом
          доступны в разделе Биллинг панели администратора.
        </p>
        <p>
          Сервис предоставляется «как есть». Для юридических вопросов:{" "}
          <a href="mailto:legal@monavel.app" className="text-emerald-400">
            legal@monavel.app
          </a>
        </p>
      </section>
    </div>
  );
}
