import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  GuestBookingHistory,
  GuestProfileActions,
  GuestProfileCard,
  GuestStats,
} from "@/components/dashboard/guests";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { createServerRepositoryContext } from "@/repositories/context.server";
import { computeGuestStats } from "@/lib/guest-stats";
import { getTenantContext } from "@/lib/tenant/context";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GuestProfileRoute({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantContext();
  const repositoryContext = await createServerRepositoryContext(tenant);
  const guestsRepo = createGuestsRepository(repositoryContext);
  const guest = await guestsRepo.getById(id);

  if (!guest) {
    notFound();
  }

  const [bookings, allGuests] = await Promise.all([
    guestsRepo.getBookingsForGuest(guest),
    guestsRepo.getAll(),
  ]);

  const candidates = allGuests.filter((g) => g.id !== guest.id);
  const stats = computeGuestStats(bookings);

  return (
    <div className="space-y-8">
        <Link
          href="/guests"
          className="inline-flex items-center gap-2 text-sm text-[var(--shell-muted)] transition hover:text-[var(--shell-text)]"
        >
          <ArrowLeft size={16} />
          Back to list
        </Link>

        <GuestProfileCard
          guest={guest}
          actions={
            <GuestProfileActions guest={guest} candidates={candidates} />
          }
        />

        <GuestStats stats={stats} />

        <section className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">Booking history</h2>
            <p className="mt-1 text-sm text-[var(--shell-muted)]">
              Reservations matched by guest email or name.
            </p>
          </div>

          <GuestBookingHistory bookings={bookings} />
        </section>
    </div>
  );
}
