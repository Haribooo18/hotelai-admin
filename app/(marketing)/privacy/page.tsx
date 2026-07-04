import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности HotelAI.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 prose prose-invert">
      <h1 className="text-4xl font-bold not-prose">Политика конфиденциальности</h1>
      <p className="mt-4 text-zinc-400 not-prose">
        Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
      </p>

      <section className="mt-8 space-y-4 text-sm text-zinc-300">
        <p>
          HotelAI обрабатывает персональные данные гостей и сотрудников отелей
          исключительно для предоставления сервиса AI-ресепшна и панели
          администратора.
        </p>
        <p>
          Данные хранятся в Supabase с изоляцией по hotel_id и защитой Row Level
          Security. Доступ имеют только авторизованные сотрудники отеля.
        </p>
        <p>
          Для вопросов о данных обращайтесь:{" "}
          <a href="mailto:privacy@hotelai.com" className="text-emerald-400">
            privacy@hotelai.com
          </a>
        </p>
      </section>
    </div>
  );
}
