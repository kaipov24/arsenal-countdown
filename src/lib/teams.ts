import type { Fixture } from "@/types/fixture";

const ARSENAL_TEAM_IDS = new Set(["57", "arsenal"]);
const NEUTRAL_COMPETITION_IDS = new Set(["friendly", "community-shield"]);

type FixtureTeam = Fixture["homeTeam"] | Fixture["awayTeam"];

export function isArsenalTeam(team: FixtureTeam): boolean {
  return (
    ARSENAL_TEAM_IDS.has(team.id.toLowerCase()) ||
    team.name.toLowerCase() === "arsenal fc" ||
    team.shortName.toLowerCase() === "arsenal"
  );
}

export function isNeutralFixture(fixture: Fixture): boolean {
  const competitionId = fixture.competition.id.toLowerCase();
  const competitionName = fixture.competition.name.toLowerCase();

  return (
    NEUTRAL_COMPETITION_IDS.has(competitionId) ||
    competitionName.includes("friendly") ||
    competitionName.includes("community shield")
  );
}
