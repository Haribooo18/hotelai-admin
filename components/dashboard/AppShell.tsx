"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Wallet,
  BookOpen,
  Settings,
  Bell,
  Hotel,
  ClipboardList,
  Users,
  Bot,
} from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";

type Props = {
  children: ReactNode;
  hotel?: {
    id: string;
    name: string;
  };
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Заявки",
    href: "/dashboard",
    icon: ClipboardList,
  },
  {
    label: "Бронирования",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Номера",
    href: "/rooms",
    icon: BedDouble,
  },
  {
    label: "Гости",
    href: "/guests",
    icon: Users,
  },
  {
    label: "AI Receptionist",
    href: "/ai",
    icon: Bot,
  },
  {
    label: "Календарь",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Цены",
    href: "/rates",
    icon: Wallet,
  },
  {
    label: "FAQ",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    label: "Настройки",
    href: "/settings",
    icon: Settings,
  },
];

export function AppShell({ children, hotel }: Props) {
  const pathname = usePathname();

  const hotelName = hotel?.name ?? "Aurora Hotel";
  const hotelId = hotel?.id ?? "hotel_aurora";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
          <div className="border-b border-zinc-800 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
                <Hotel className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-xl font-bold">Monavel</h1>

                <p className="text-sm text-zinc-400">
                  AI Receptionist
                </p>
              </div>
            </div>
          </div>

          <div className="m-5 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              Workspace
            </p>

            <p className="mt-3 text-lg font-semibold">
              {hotelName}
            </p>

            <p className="text-sm text-zinc-500">
              {hotelId}
            </p>
          </div>

          <nav className="flex-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon size={20} />

                  <span className="font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-zinc-800 p-5">
            <div className="flex items-center gap-3 rounded-xl bg-zinc-900 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-700 font-bold">
                A
              </div>

              <div>
                <div className="font-medium">
                  Admin
                </div>

                <div className="text-sm text-zinc-500">
                  Owner
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
            <div className="flex h-20 items-center justify-between px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  HOTELAI ADMIN
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  {hotelName}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <button className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:bg-zinc-800">
                  <Bell size={18} />
                </button>

                <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-600" />

                  <div>
                    <p className="font-medium">
                      Admin
                    </p>

                    <p className="text-xs text-zinc-500">
                      Owner
                    </p>
                  </div>
                </div>

                <SignOutButton />
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}