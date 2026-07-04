type Props = {
  month: number;
  year: number;
  daysInMonth: number;
};

const WEEK_DAYS = [
  "Вс",
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
];

export function CalendarHeader({
  month,
  year,
  daysInMonth,
}: Props) {
  const days = Array.from(
    { length: daysInMonth },
    (_, i) => {
      const date = new Date(
        year,
        month,
        i + 1
      );

      return {
        day: i + 1,
        weekDay:
          WEEK_DAYS[date.getDay()],
      };
    }
  );

  return (
    <div
      className="grid border-b border-zinc-800 bg-zinc-900"
      style={{
        gridTemplateColumns: `220px repeat(${daysInMonth}, minmax(48px, 1fr))`,
      }}
    >
      <div className="border-r border-zinc-800 p-4 font-semibold">
        Номер
      </div>

      {days.map((day) => (
        <div
          key={day.day}
          className="border-r border-zinc-800 py-3 text-center"
        >
          <div className="text-xs text-zinc-500">
            {day.weekDay}
          </div>

          <div className="mt-1 font-medium">
            {day.day}
          </div>
        </div>
      ))}
    </div>
  );
}