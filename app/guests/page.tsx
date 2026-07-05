import { AppShell } from "@/components/dashboard/AppShell";
import { GuestsPage } from "@/components/dashboard/guests";
import { createGuestsRepository } from "@/repositories/guests.repository.server";
import { getCurrentHotel } from "@/lib/tenant";

export default async function GuestsRoute() {
  const [hotel, guestsRepo] = await Promise.all([
    getCurrentHotel(),
    createGuestsRepository(),
  ]);
  const guests = await guestsRepo.getAll();

  return (
    <AppShell hotel={hotel}>
      <GuestsPage guests={guests} />
    </AppShell>
  );
}
