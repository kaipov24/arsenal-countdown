export type Fixture = {
  id: string;
  kickoffUtc: string;
  status: "SCHEDULED" | "TIMED" | "POSTPONED" | "CANCELLED" | "FINISHED";
  competition: {
    id: string;
    name: string;
  };
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    crestUrl?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    crestUrl?: string;
  };
  venue?: string;
};
