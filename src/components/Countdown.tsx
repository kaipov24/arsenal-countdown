"use client";

import { useEffect, useState } from "react";
import {
  getRemainingTime,
  hasKickoffPassed,
  type RemainingTime,
} from "@/lib/dates";

type CountdownProps = {
  kickoffUtc: string;
};

type CountdownUnit = {
  label: string;
  value: number;
};

export function Countdown({ kickoffUtc }: CountdownProps) {
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    function updateCountdown() {
      setRemaining(getRemainingTime(kickoffUtc));
      setStarted(hasKickoffPassed(kickoffUtc));
    }

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [kickoffUtc]);

  if (!remaining) {
    return (
      <p
        className="rounded-md border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-slate-200"
        aria-live="polite"
      >
        Countdown loading
      </p>
    );
  }

  if (started) {
    return (
      <p
        className="rounded-md border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-100"
        aria-live="polite"
      >
        Kickoff has started
      </p>
    );
  }

  const units: CountdownUnit[] = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      aria-label="Time remaining until kickoff"
      aria-live="polite"
    >
      {units.map((unit) => (
        <div
          className="rounded-lg border border-white/10 bg-white/8 p-4 text-center shadow-sm"
          key={unit.label}
        >
          <div className="text-3xl font-bold tabular-nums text-white">
            {unit.value.toString().padStart(2, "0")}
          </div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-300">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
