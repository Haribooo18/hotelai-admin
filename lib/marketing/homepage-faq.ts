export const HOMEPAGE_FAQ_SECTION_ID = "homepage-faq";

export type HomepageFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HOMEPAGE_FAQ_CONTENT = {
  sectionId: HOMEPAGE_FAQ_SECTION_ID,
  headline: "Frequently Asked Questions",
} as const;

export const HOMEPAGE_FAQ_ITEMS: HomepageFaqItem[] = [
  {
    id: "why-monavel-not-pms",
    question: "Why Monavel instead of another PMS?",
    answer:
      "Most PMS platforms manage reservations and room inventory. Monavel sits above the PMS and connects every operational system into one intelligent workspace. It combines PMS, AI Reception, guest communication, knowledge, automation, revenue, and analytics into one operating system.",
  },
  {
    id: "why-not-chatgpt",
    question: "Why not just use ChatGPT?",
    answer:
      "ChatGPT doesn't know your hotel. It has no access to bookings, rooms, housekeeping, pricing, guest history, or operational knowledge. Monavel connects directly to your hotel's systems, understands operational context, and can automate real hotel workflows.",
  },
  {
    id: "why-not-cloudbeds-whatsapp",
    question: "Why not use Cloudbeds + WhatsApp + Booking.com?",
    answer:
      "Hotels already use these tools. The problem is they remain disconnected. Employees constantly switch between applications, duplicate work, and manually coordinate operations. Monavel connects every system into one intelligent platform.",
  },
  {
    id: "why-not-opera-crm",
    question: "Why not Opera + CRM + other hotel software?",
    answer:
      "Adding more software usually creates more complexity. Every new tool becomes another source of information. Monavel becomes the intelligent operational layer above your existing software, synchronizing everything into one workspace.",
  },
  {
    id: "replace-pms",
    question: "Do I need to replace my PMS?",
    answer:
      "No. Monavel integrates with your existing hotel infrastructure. Your PMS remains the system of record while Monavel becomes the intelligent operating layer.",
  },
  {
    id: "large-hotels-only",
    question: "Is Monavel only for large hotels?",
    answer:
      "No. Monavel works for boutique hotels, independent properties, hotel groups, resorts, serviced apartments, and growing hospitality businesses. It scales with your operations.",
  },
  {
    id: "implementation-time",
    question: "How long does implementation take?",
    answer:
      "Most hotels can begin using Monavel within days. Connect your PMS, communication channels, and knowledge base. The AI continuously learns your operations over time.",
  },
  {
    id: "data-security",
    question: "Is my hotel data secure?",
    answer:
      "Yes. Enterprise-grade security, encrypted infrastructure, role-based permissions, audit logs, and secure cloud architecture protect your operational data.",
  },
];
