export const LANDING_FEATURES = [
  {
    title: "AI-ресепшн 24/7",
    description:
      "Мгновенные ответы гостям на русском языке с учётом политик отеля и базы знаний.",
  },
  {
    title: "Единый inbox",
    description:
      "Telegram, Website Chat и другие каналы в одной панели для команды ресепшна.",
  },
  {
    title: "База знаний",
    description:
      "Публикуйте статьи для AI — ответы всегда согласованы с актуальной информацией отеля.",
  },
  {
    title: "Аналитика",
    description:
      "Статус диалогов, журнал AI-действий и диагностика в настройках отеля.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Подключите каналы",
    description: "Настройте Telegram-бота и виджет Website Chat за несколько минут.",
  },
  {
    step: "2",
    title: "Заполните базу знаний",
    description: "Добавьте FAQ, правила и услуги отеля для точных ответов AI.",
  },
  {
    step: "3",
    title: "AI отвечает гостям",
    description: "Гости получают ответы в реальном времени, команда видит всё в inbox.",
  },
] as const;

export const AI_CHANNELS = [
  {
    title: "Telegram",
    description: "Входящие сообщения гостей через Bot API с автоответом AI.",
  },
  {
    title: "Website Chat",
    description: "Виджет на сайте отеля с потоковой SSE-перепиской.",
  },
  {
    title: "Knowledge Base",
    description: "Контекст для AI из опубликованных статей базы знаний.",
  },
  {
    title: "Analytics",
    description: "Метрики диалогов, журнал AI-действий и диагностика платформы.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Нужен ли отдельный сервер?",
    answer:
      "Нет. HotelAI разворачивается на Vercel, данные хранятся в Supabase с изоляцией по отелю.",
  },
  {
    question: "Какие каналы поддерживаются?",
    answer:
      "Сейчас Telegram и Website Chat. Архитектура готова к добавлению WhatsApp и email.",
  },
  {
    question: "Как начать пробный период?",
    answer:
      "Нажмите «Начать пробный период», войдите в панель и оформите подписку в разделе Биллинг.",
  },
  {
    question: "Можно ли отключить AI?",
    answer:
      "Да. AI-ресепшн включается и настраивается в панели администратора для каждого отеля.",
  },
] as const;

export const FEATURE_SECTIONS = [
  {
    title: "Управление бронированиями",
    description: "Бронирования, номера, календарь и гости в единой PMS-панели.",
  },
  {
    title: "AI Receptionist",
    description: "Inbox диалогов, streaming-ответы, инструменты и observability.",
  },
  {
    title: "Мультитенантность",
    description: "Каждый отель изолирован через hotel_id и Row Level Security.",
  },
  {
    title: "Биллинг Stripe",
    description: "Тарифы Starter, Pro и Enterprise с Checkout и Billing Portal.",
  },
] as const;
