import fixturesJson from "../../public/data/fixtures.json";
import { FixtureList } from "@/components/FixtureList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MatchCard } from "@/components/MatchCard";
import { selectNextFiveFixtures, selectNextFixture } from "@/lib/fixtures";
import type { Fixture } from "@/types/fixture";

const fixtures = fixturesJson as Fixture[];

export default function Home() {
  const nextFixture = selectNextFixture(fixtures);
  const nextFiveFixtures = selectNextFiveFixtures(fixtures);

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-950 text-white">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(185,28,28,0.24),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]">
          <div className="mx-auto w-full max-w-6xl px-5 py-12 pt-2">

            <div className="mt-10">
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
          <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-300">
                  Upcoming
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Next five fixtures
                </h2>
              </div>
            </div>

            <FixtureList fixtures={nextFiveFixtures} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
