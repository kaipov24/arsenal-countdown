import fixturesJson from "../../public/data/fixtures.json";
import { FixtureList } from "@/components/FixtureList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import {
  filterFutureFixtures,
  selectNextFixture,
  sortFixturesByKickoff,
} from "@/lib/fixtures";
import type { Fixture, FixtureData } from "@/types/fixture";

function getFixtures(data: Fixture[] | FixtureData): Fixture[] {
  return Array.isArray(data) ? data : data.fixtures;
}

const fixtures = getFixtures(fixturesJson as Fixture[] | FixtureData);

export default function Home() {
  const now = new Date();
  const nextFixture = selectNextFixture(fixtures, now);
  const followingFixtures = nextFixture
    ? sortFixturesByKickoff(
        filterFutureFixtures(fixtures, now).filter(
          (fixture) => fixture.id !== nextFixture.id,
        ),
      )
    : [];

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.24),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]">
          <div className="mx-auto w-full max-w-5xl px-5 py-8">
            <p className="sr-only">
              See when Arsenal play next, with kickoff automatically converted
              to your local timezone.
            </p>
            <p className="mb-5 text-sm leading-6 text-slate-300 sm:text-base">
              Kickoff times are shown in your local timezone and update as the
              next match approaches.
            </p>

            <div>
              {nextFixture ? (
                <MatchCard fixture={nextFixture} />
              ) : (
                <div className="rounded-lg border border-white/10 bg-slate-950/80 p-8 text-slate-100">
                  <h2 className="text-2xl font-bold">No upcoming fixtures</h2>
                  <p className="mt-3 text-slate-300">
                    There are no upcoming Arsenal fixtures available right now.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-900" id="fixtures">
          <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-12">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
                  Upcoming
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Upcoming fixtures
                </h2>
              </div>
            </div>

            <FixtureList fixtures={followingFixtures} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
