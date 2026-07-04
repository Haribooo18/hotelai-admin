"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  date: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export function CalendarToolbar({
  date,
  onPrevious,
  onNext,
  onToday,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div>
        <h2 className="text-2xl font-semibold">
          {MONTHS[date.getMonth()]} {date.getFullYear()}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Календарь бронирований
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
        >
          <ChevronLeft size={18} />
        </Button>

        <Button
          variant="outline"
          onClick={onToday}
        >
          Сегодня
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}