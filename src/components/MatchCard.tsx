import { Countdown } from "@/components/Countdown";
import {
  formatUtcKickoffInLocalTime,
  getVisitorTimeZoneName,
} from "@/lib/dates";
import type { Fixture } from "@/types/fixture";

type MatchCardProps = {
  fixture: Fixture;
};

function getArsenalStatus(fixture: Fixture): string {
  if (fixture.homeTeam.id === "arsenal") {
    return "Home fixture";
  }

  if (fixture.awayTeam.id === "arsenal") {
    return "Away fixture";
  }

  return "Neutral fixture";
}

export function MatchCard({ fixture }: MatchCardProps) {
  const localKickoff = formatUtcKickoffInLocalTime(fixture.kickoffUtc);
  const timeZone = getVisitorTimeZoneName();
  const arsenalStatus = getArsenalStatus(fixture);

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
            {fixture.competition.name}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-5xl">
            {fixture.homeTeam.shortName} vs {fixture.awayTeam.shortName}
          </h2>
        </div>
        <span className="w-fit rounded-md border border-red-300/30 bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-100">
          {arsenalStatus}
        </span>
      </div>

      <dl className="mt-8 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
        <div>
          <dt className="font-semibold text-slate-400">Local kickoff</dt>
          <dd className="mt-1 text-base text-white">{localKickoff}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-400">Timezone</dt>
          <dd className="mt-1 text-base text-white">{timeZone}</dd>
        </div>
        {fixture.venue ? (
          <div>
            <dt className="font-semibold text-slate-400">Venue</dt>
            <dd className="mt-1 text-base text-white">{fixture.venue}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-8">
        <Countdown kickoffUtc={fixture.kickoffUtc} />
      </div>
    </article>
  );
}
