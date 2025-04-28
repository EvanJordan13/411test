import { Player, Position, Team, NewsItem } from "@/types";

//THis is an adapter to use the data coming from the backend to be usable in the frontend
// We may want to just change how we do things in the backend, but for the demo this is fine
export function adaptPlayerData(backendPlayer: any): Player {
  // Map position from the backend format to the frontend enum
  const positionMap: Record<string, Position> = {
    QB: "QB",
    RB: "RB",
    WR: "WR",
    TE: "TE",
  };

  // Extract stats from the backend format
  //backed stats have avg before the name
  const stats: Record<string, number> = {};
  if (backendPlayer.stats) {
    for (const [key, value] of Object.entries(backendPlayer.stats)) {
      if (typeof key === "string" && key.startsWith("avg")) {
        // Remove the avg
        const statName = key.substring(3);
        // Format conversion
        const formattedName =
          statName.charAt(0).toUpperCase() + statName.slice(1);
        const displayName = formatStatName(formattedName);

        // Attempt to parse value as float, default to 0 if null or invalid
        const parsedValue = parseFloat(value as string);
        stats[displayName] = !isNaN(parsedValue)
          ? parseFloat(parsedValue.toFixed(1))
          : 0;
      }
    }
  }

  // trend for now TODO figure out what this really should be
  const trend = backendPlayer.score > 85 ? "up" : "down";

  // Mock recent news for now, as backend doesn't provide it
  const mockRecentNews: NewsItem[] = [
    {
      id: Math.random(),
      title: `Recent update regarding ${backendPlayer.playerName}`,
      date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Random date in last 10 days
      source: "Mock News Source",
    },
  ];

  return {
    id: backendPlayer.playerID,
    name: backendPlayer.playerName,
    team: backendPlayer.teamName || "UNK",
    position: positionMap[backendPlayer.position] || "QB",
    stats: stats,
    mlScore: Math.round(backendPlayer.score || 0), // Default score to 0
    trend: trend,
    lastUpdated: new Date().toISOString().split("T")[0],
    note: "", // Notes managed client-side for now
    recentNews: mockRecentNews, // Use mock news
    // Include additional backend fields if needed
    playerAge: backendPlayer.playerAge,
    numSeasons: backendPlayer.numSeasons,
    numGames: backendPlayer.numGames,
  };
}

//format stat names for better display
function formatStatName(statName: string): string {
  const statMap: Record<string, string> = {
    PassYds: "Passing Yards",
    PassTDs: "Passing TDs",
    Ints: "Interceptions",
    CompPct: "Completion %",
    RshAtt: "Rush Attempts",
    RshYds: "Rushing Yards",
    RshTDs: "Rushing TDs",
    Rec: "Receptions",
    RecYds: "Receiving Yards",
    RecTDs: "Receiving TDs",
  };
  return statMap[statName] || statName;
}

// transform backend team data
export function adaptTeamData(backendTeam: any): Team {
  // Adapt top players if they exist in the response (for getTeamById)
  const topQB = backendTeam.topQB
    ? adaptPlayerData(backendTeam.topQB)
    : undefined;
  const topRB = backendTeam.topRB
    ? adaptPlayerData(backendTeam.topRB)
    : undefined;
  const topWR = backendTeam.topWR
    ? adaptPlayerData(backendTeam.topWR)
    : undefined;
  const topTE = backendTeam.topTE
    ? adaptPlayerData(backendTeam.topTE)
    : undefined;

  return {
    id: backendTeam.teamID,
    name: backendTeam.teamName,
    code: getTeamCode(backendTeam.teamName),
    strength:
      backendTeam.teamStrength !== null &&
      backendTeam.teamStrength !== undefined
        ? parseFloat(backendTeam.teamStrength.toFixed(1))
        : 0,
    // Add adapted top players
    topQB,
    topRB,
    topWR,
    topTE,
  };
}

//team code from name
function getTeamCode(teamName: string): string {
  if (!teamName) return "UNK";
  const words = teamName.split(" ");
  if (words.length === 1) return teamName.substring(0, 3).toUpperCase();

  // Add more team codes as needed
  const teamCodes: Record<string, string> = {
    "Arizona Cardinals": "ARI",
    "Atlanta Falcons": "ATL",
    "Baltimore Ravens": "BAL",
    "Buffalo Bills": "BUF",
    "Carolina Panthers": "CAR",
    "Chicago Bears": "CHI",
    "Cincinnati Bengals": "CIN",
    "Cleveland Browns": "CLE",
    "Dallas Cowboys": "DAL",
    "Denver Broncos": "DEN",
    "Detroit Lions": "DET",
    "Green Bay Packers": "GB",
    "Houston Texans": "HOU",
    "Indianapolis Colts": "IND",
    "Jacksonville Jaguars": "JAX",
    "Kansas City Chiefs": "KC",
    "Las Vegas Raiders": "LV",
    "Los Angeles Chargers": "LAC",
    "Los Angeles Rams": "LAR",
    "Miami Dolphins": "MIA",
    "Minnesota Vikings": "MIN",
    "New England Patriots": "NE",
    "New Orleans Saints": "NO",
    "New York Giants": "NYG",
    "New York Jets": "NYJ",
    "Philadelphia Eagles": "PHI",
    "Pittsburgh Steelers": "PIT",
    "San Francisco 49ers": "SF",
    "Seattle Seahawks": "SEA",
    "Tampa Bay Buccaneers": "TB",
    "Tennessee Titans": "TEN",
    "Washington Commanders": "WAS",
  };
  return (
    teamCodes[teamName] ||
    words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  );
}

// Adapts favorite summary data
export interface FavoriteSummaryData {
  tier: string;
  count: number;
}

export function adaptFavoriteSummary(backendSummary: any): FavoriteSummaryData {
  return {
    tier: backendSummary.tier,
    count: backendSummary.count,
  };
}
