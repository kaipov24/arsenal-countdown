import Image from "next/image";
import { Countdown } from "@/components/Countdown";
import {
  formatUtcKickoffInLocalTime,
  getVisitorTimeZoneName,
} from "@/lib/dates";
import { isArsenalTeam, isNeutralFixture } from "@/lib/teams";
import type { Fixture } from "@/types/fixture";

type MatchCardProps = {
  fixture: Fixture;
};

type TeamPanelProps = {
  crestUrl?: string;
  label: string;
  shortName: string;
};

function getArsenalStatus(fixture: Fixture): string {
  if (isNeutralFixture(fixture)) {
    return "Neutral fixture";
  }

  if (isArsenalTeam(fixture.homeTeam)) {
    return "Home fixture";
  }

  if (isArsenalTeam(fixture.awayTeam)) {
    return "Away fixture";
  }

  return "Neutral fixture";
}

function TeamPanel({ crestUrl, label, shortName }: TeamPanelProps) {
  return (
    <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-lg border border-white/10 bg-white/8 px-4 py-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white p-2">
        {crestUrl ? (
          <Image
            alt={`${shortName} crest`}
            className="h-full w-full object-contain"
            height={40}
            src={crestUrl}
            width={40}
          />
        ) : (
          <span className="text-base font-bold text-slate-950">
            {shortName.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <h2 className="mt-3 text-2xl font-bold text-white">{shortName}</h2>
    </div>
  );
}

export function MatchCard({ fixture }: MatchCardProps) {
  const localKickoff = formatUtcKickoffInLocalTime(fixture.kickoffUtc);
  const timeZone = getVisitorTimeZoneName();
  const arsenalStatus = getArsenalStatus(fixture);

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
            {fixture.competition.name}
          </p>
          <p className="mt-2 text-lg font-semibold text-white">Next match</p>
        </div>
        <span className="w-fit rounded-md border border-red-300/30 bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-100">
          {arsenalStatus}
        </span>
      </div>

      <div className="mt-5 grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
        <TeamPanel
          crestUrl={fixture.homeTeam.crestUrl}
          label="Home"
          shortName={fixture.homeTeam.shortName}
        />
        <div className="flex items-center justify-center">
          <span className="rounded-md border border-white/10 bg-slate-900 px-3 py-1.5 text-sm font-black tracking-wide text-slate-200 sm:px-4 sm:py-2">
            VS
          </span>
        </div>
        <TeamPanel
          crestUrl={fixture.awayTeam.crestUrl}
          label="Away"
          shortName={fixture.awayTeam.shortName}
        />
      </div>

      <dl className="mt-5 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
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

      <div className="mt-7">
        <Countdown kickoffUtc={fixture.kickoffUtc} />
      </div>
    </article>
  );
}
