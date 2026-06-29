import type { Fixture } from "@/types/fixture";

const UPCOMING_STATUSES: ReadonlySet<Fixture["status"]> = new Set([
  "SCHEDULED",
  "TIMED",
]);

export function sortFixturesByKickoff(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort(
    (first, second) =>
      new Date(first.kickoffUtc).getTime() -
      new Date(second.kickoffUtc).getTime(),
  );
}

export function filterFutureFixtures(
  fixtures: Fixture[],
  now = new Date(),
): Fixture[] {
  return fixtures.filter(
    (fixture) =>
      UPCOMING_STATUSES.has(fixture.status) &&
      new Date(fixture.kickoffUtc).getTime() > now.getTime(),
  );
}

export function selectNextFixture(
  fixtures: Fixture[],
  now = new Date(),
): Fixture | undefined {
  return sortFixturesByKickoff(filterFutureFixtures(fixtures, now))[0];
}

export function selectNextFiveFixtures(
  fixtures: Fixture[],
  now = new Date(),
): Fixture[] {
  return sortFixturesByKickoff(filterFutureFixtures(fixtures, now)).slice(0, 5);
}
