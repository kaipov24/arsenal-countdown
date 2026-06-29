import { formatUtcKickoffInLocalTime } from "@/lib/dates";
import type { Fixture } from "@/types/fixture";

type FixtureListProps = {
  fixtures: Fixture[];
};

function getOpponent(fixture: Fixture): string {
  return fixture.homeTeam.id === "arsenal"
    ? fixture.awayTeam.shortName
    : fixture.homeTeam.shortName;
}

function getHomeAwayStatus(fixture: Fixture): string {
  if (fixture.homeTeam.id === "arsenal") {
    return "Home";
  }

  if (fixture.awayTeam.id === "arsenal") {
    return "Away";
  }

  return "Neutral";
}

export function FixtureList({ fixtures }: FixtureListProps) {
  if (fixtures.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/8 p-5 text-slate-200">
        No upcoming Arsenal fixtures are available right now.
      </p>
    );
  }

  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {fixtures.map((fixture) => (
        <li
          className="rounded-lg border border-white/10 bg-white/8 p-4 text-slate-100"
          key={fixture.id}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold">
                Arsenal vs {getOpponent(fixture)}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {fixture.competition.name}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
              {getHomeAwayStatus(fixture)}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-200">
            {formatUtcKickoffInLocalTime(fixture.kickoffUtc)}
          </p>
        </li>
      ))}
    </ul>
  );
}
