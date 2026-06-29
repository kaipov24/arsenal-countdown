import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ARSENAL_TEAM_ID = 57;
const PROVIDER = "football-data.org";
const FIXTURES_PATH = path.join(process.cwd(), "public", "data", "fixtures.json");
const UPCOMING_STATUSES = new Set(["SCHEDULED", "TIMED"]);
const VALID_FIXTURE_STATUSES = new Set([
  "SCHEDULED",
  "TIMED",
  "POSTPONED",
  "CANCELLED",
  "FINISHED",
]);

function assertToken() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    throw new Error(
      "FOOTBALL_DATA_API_TOKEN is not set. Existing fixtures were preserved.",
    );
  }

  return token;
}

function readRateLimitHeaders(headers) {
  return {
    availableMinute: headers.get("X-Requests-Available-Minute"),
    reset: headers.get("X-RequestCounter-Reset"),
  };
}

function logRateLimitHeaders(headers) {
  const { availableMinute, reset } = readRateLimitHeaders(headers);

  console.log("football-data.org rate limit headers:");
  console.log(`X-Requests-Available-Minute: ${availableMinute ?? "not provided"}`);
  console.log(`X-RequestCounter-Reset: ${reset ?? "not provided"}`);
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asOptionalString(value) {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asRequiredString(value, fieldName) {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid API response: ${fieldName} is missing.`);
  }

  return value;
}

function asRequiredId(value, fieldName) {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new Error(`Invalid API response: ${fieldName} is missing.`);
  }

  return String(value);
}

function normalizeStatus(status) {
  if (status === "CANCELED") {
    return "CANCELLED";
  }

  if (typeof status !== "string" || !VALID_FIXTURE_STATUSES.has(status)) {
    throw new Error(`Invalid API response: unsupported fixture status.`);
  }

  return status;
}

function toTeam(team, fieldName) {
  if (!isRecord(team)) {
    throw new Error(`Invalid API response: ${fieldName} is missing.`);
  }

  return {
    id: asRequiredId(team.id, `${fieldName}.id`),
    name: asRequiredString(team.name, `${fieldName}.name`),
    shortName:
      asOptionalString(team.shortName) ??
      asRequiredString(team.name, `${fieldName}.name`),
    ...(asOptionalString(team.crest) ? { crestUrl: team.crest } : {}),
  };
}

function toCompetition(competition) {
  if (!isRecord(competition)) {
    throw new Error("Invalid API response: competition is missing.");
  }

  return {
    id: asRequiredId(competition.id, "competition.id"),
    name: asRequiredString(competition.name, "competition.name"),
  };
}

function toFixture(match) {
  if (!isRecord(match)) {
    throw new Error("Invalid API response: match is malformed.");
  }

  const kickoffUtc = asRequiredString(match.utcDate, "utcDate");
  const kickoffTime = new Date(kickoffUtc).getTime();

  if (Number.isNaN(kickoffTime)) {
    throw new Error("Invalid API response: utcDate is not a valid date.");
  }

  return {
    id: asRequiredId(match.id, "id"),
    kickoffUtc,
    status: normalizeStatus(match.status),
    competition: toCompetition(match.competition),
    homeTeam: toTeam(match.homeTeam, "homeTeam"),
    awayTeam: toTeam(match.awayTeam, "awayTeam"),
    ...(isRecord(match.venue) && asOptionalString(match.venue.name)
      ? { venue: match.venue.name }
      : {}),
  };
}

function isUpcomingFixture(fixture, now = new Date()) {
  return (
    UPCOMING_STATUSES.has(fixture.status) &&
    new Date(fixture.kickoffUtc).getTime() > now.getTime()
  );
}

function sortByKickoff(fixtures) {
  return [...fixtures].sort(
    (first, second) =>
      new Date(first.kickoffUtc).getTime() -
      new Date(second.kickoffUtc).getTime(),
  );
}

function parseMatches(payload) {
  if (!isRecord(payload) || !Array.isArray(payload.matches)) {
    throw new Error("Invalid API response: matches array is missing.");
  }

  return payload.matches;
}

async function fetchArsenalMatches(token) {
  const searchParams = new URLSearchParams({
    status: "SCHEDULED",
    limit: "50",
  });
  const url = `https://api.football-data.org/v4/teams/${ARSENAL_TEAM_ID}/matches?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": token,
    },
  });

  logRateLimitHeaders(response.headers);

  if (response.status === 429) {
    throw new Error(
      "football-data.org rate limit reached (HTTP 429). Existing fixtures were preserved.",
    );
  }

  if (!response.ok) {
    throw new Error(
      `football-data.org request failed with HTTP ${response.status}. Existing fixtures were preserved.`,
    );
  }

  return response.json();
}

async function preserveExistingFile() {
  await readFile(FIXTURES_PATH, "utf8");
}

async function syncFixtures() {
  await preserveExistingFile();

  const token = assertToken();
  const payload = await fetchArsenalMatches(token);
  const fixtures = sortByKickoff(
    parseMatches(payload).map(toFixture).filter((fixture) => isUpcomingFixture(fixture)),
  );

  if (fixtures.length === 0) {
    throw new Error(
      "football-data.org returned no upcoming Arsenal fixtures. Existing fixtures were preserved.",
    );
  }

  const output = {
    provider: PROVIDER,
    updatedAt: new Date().toISOString(),
    fixtures,
  };

  await mkdir(path.dirname(FIXTURES_PATH), { recursive: true });
  await writeFile(FIXTURES_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  console.log(`Synced ${fixtures.length} upcoming Arsenal fixtures from ${PROVIDER}.`);
}

syncFixtures().catch((error) => {
  const message =
    error instanceof Error
      ? error.message
      : "Fixture sync failed. Existing fixtures were preserved.";

  console.error(message);
  process.exitCode = 1;
});
