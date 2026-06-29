"use client";

import { useState } from "react";
import { formatUtcKickoffInLocalTime } from "@/lib/dates";
import { isArsenalTeam, isNeutralFixture } from "@/lib/teams";
import type { Fixture } from "@/types/fixture";

const FIXTURES_PER_PAGE = 5;

type FixtureListProps = {
  fixtures: Fixture[];
};

function getHomeAwayStatus(fixture: Fixture): string {
  if (isNeutralFixture(fixture)) {
    return "Neutral";
  }

  if (isArsenalTeam(fixture.homeTeam)) {
    return "Home";
  }

  if (isArsenalTeam(fixture.awayTeam)) {
    return "Away";
  }

  return "Neutral";
}

export function FixtureList({ fixtures }: FixtureListProps) {
  const [visibleCount, setVisibleCount] = useState(FIXTURES_PER_PAGE);
  const visibleFixtures = fixtures.slice(0, visibleCount);
  const hasMoreFixtures = visibleCount < fixtures.length;

  if (fixtures.length === 0) {
    return (
      <p className="rounded-lg border border-white/10 bg-white/8 p-5 text-slate-200">
        No upcoming Arsenal fixtures are available right now.
      </p>
    );
  }

  return (
    <div>
      <ul className="grid gap-4">
        {visibleFixtures.map((fixture) => (
          <li
            className="rounded-lg border border-white/10 bg-white/8 p-5 text-slate-100"
            key={fixture.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xl font-bold leading-tight sm:text-2xl">
                  {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}
                </p>
                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  {fixture.competition.name}
                </p>
              </div>
              <span className="shrink-0 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
                {getHomeAwayStatus(fixture)}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-200 sm:text-base">
              {formatUtcKickoffInLocalTime(fixture.kickoffUtc)}
            </p>
          </li>
        ))}
      </ul>

      {hasMoreFixtures ? (
        <button
          className="mt-5 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-300/40 hover:bg-slate-900"
          onClick={() => {
            setVisibleCount((count) => count + FIXTURES_PER_PAGE);
          }}
          type="button"
        >
          Show more
        </button>
      ) : null}
    </div>
  );
}
