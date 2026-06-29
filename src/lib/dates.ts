export type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = SECOND_IN_MS * 60;
const HOUR_IN_MS = MINUTE_IN_MS * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

export function hasKickoffPassed(kickoffUtc: string, now = new Date()): boolean {
  return new Date(kickoffUtc).getTime() <= now.getTime();
}

export function getRemainingTime(
  kickoffUtc: string,
  now = new Date(),
): RemainingTime {
  const difference = Math.max(0, new Date(kickoffUtc).getTime() - now.getTime());

  const days = Math.floor(difference / DAY_IN_MS);
  const hours = Math.floor((difference % DAY_IN_MS) / HOUR_IN_MS);
  const minutes = Math.floor((difference % HOUR_IN_MS) / MINUTE_IN_MS);
  const seconds = Math.floor((difference % MINUTE_IN_MS) / SECOND_IN_MS);

  return { days, hours, minutes, seconds };
}

export function getVisitorTimeZoneName(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatUtcKickoffInLocalTime(kickoffUtc: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    hour12: false,
    timeStyle: "short",
  }).format(new Date(kickoffUtc));
}
