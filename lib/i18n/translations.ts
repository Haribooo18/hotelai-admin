import type { AdminLocale } from "./locales";

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};

export type AdminTranslations = {
  nav: {
    dashboard: string;
    reservations: string;
    guests: string;
    rooms: string;
    calendar: string;
    revenue: string;
    reports: string;
    messages: string;
    settings: string;
  };
  pages: {
    dashboard: { title: string; subtitle: string };
    reservations: { title: string; subtitle: string };
    guests: { title: string; subtitle: string };
    rooms: { title: string; subtitle: string };
    calendar: { title: string; subtitle: string };
    revenue: { title: string; subtitle: string };
    reports: { title: string; subtitle: string };
    messages: { title: string; subtitle: string };
    settings: { title: string; subtitle: string };
  };
  profile: {
    profile: string;
    switchProperty: string;
    language: string;
    appearance: string;
    signOut: string;
    signingOut: string;
  };
  settings: {
    ai: string;
    billing: string;
    appearance: string;
    appearanceSubtitle: string;
    theme: string;
    language: string;
    languageHint: string;
    subscription: string;
    subscriptionSubtitle: string;
  };
  common: {
    newReservation: string;
  };
};

const EN: AdminTranslations = {
  nav: {
    dashboard: "Dashboard",
    reservations: "Reservations",
    guests: "Guests",
    rooms: "Rooms",
    calendar: "Calendar",
    revenue: "Revenue",
    reports: "Reports",
    messages: "Messages",
    settings: "Settings",
  },
  pages: {
    dashboard: {
      title: "Dashboard",
      subtitle: "Operational overview and live hotel metrics",
    },
    reservations: {
      title: "Reservations",
      subtitle: "Manage all reservations",
    },
    guests: {
      title: "Guests",
      subtitle: "Guest CRM, stay history, and VIP statuses",
    },
    rooms: {
      title: "Rooms",
      subtitle: "Manage room inventory",
    },
    calendar: {
      title: "Calendar",
      subtitle: "Room occupancy timeline and scheduling",
    },
    revenue: {
      title: "Revenue",
      subtitle: "Hotel financial analytics",
    },
    reports: {
      title: "Knowledge base",
      subtitle: "Articles for the AI receptionist",
    },
    messages: {
      title: "Messages",
      subtitle: "Guest conversations across all channels",
    },
    settings: {
      title: "Settings",
      subtitle: "AI receptionist, billing, and workspace preferences",
    },
  },
  profile: {
    profile: "Profile",
    switchProperty: "Switch property",
    language: "Language",
    appearance: "Appearance",
    signOut: "Sign out",
    signingOut: "Signing out...",
  },
  settings: {
    ai: "AI Receptionist",
    billing: "Billing",
    appearance: "Appearance",
    appearanceSubtitle: "Theme and language preferences",
    theme: "Theme",
    language: "Language",
    languageHint: "More languages will roll out incrementally",
    subscription: "Subscription",
    subscriptionSubtitle: "Plan, status, and payment management",
  },
  common: {
    newReservation: "New reservation",
  },
};

export const translations: Record<AdminLocale, AdminTranslations> = {
  en: EN,
  uk: EN,
  ru: EN,
  pl: EN,
  de: EN,
};

export type TranslationPath =
  | `nav.${keyof AdminTranslations["nav"]}`
  | `pages.${keyof AdminTranslations["pages"]}.${"title" | "subtitle"}`
  | `profile.${keyof AdminTranslations["profile"]}`
  | `settings.${keyof AdminTranslations["settings"]}`
  | `common.${keyof AdminTranslations["common"]}`;

export function getTranslation(
  locale: AdminLocale,
  path: TranslationPath
): string {
  const parts = path.split(".");
  let cursor: TranslationTree | string | undefined = translations[locale];

  for (const part of parts) {
    if (!cursor || typeof cursor === "string") break;
    cursor = cursor[part];
  }

  if (typeof cursor === "string") return cursor;
  return getTranslation("en", path);
}
