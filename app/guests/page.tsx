import { AppShell } from "@/components/dashboard/AppShell";
import { GuestsPage } from "@/components/dashboard/guests";
import { getGuests } from "@/lib/services/guests.service";
import { getCurrentHotel } from "@/lib/tenant";

export default async function GuestsRoute() {
  const [hotel, guests] = await Promise.all([getCurrentHotel(), getGuests()]);

  return (
    <AppShell hotel={hotel}>
      <GuestsPage guests={guests} />
    </AppShell>
  );
}
