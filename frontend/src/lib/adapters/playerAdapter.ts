import { Player } from "@/types";

//THis is an adapter to use the data coming from the backend to be usable in the frontend
// We may want to just change how we do things in the backend, but for the demo this is fine
export function adaptPlayerData(backendPlayer: any): Player {
  // Map position from the backend format to the frontend enum
  const positionMap: Record<string, string> = {
    QB: "QB",
    RB: "RB",
    WR: "WR",
    TE: "TE",
  };

  // Extract stats from the backend format
  //backed stats have avg before the name
  const stats: Record<string, number> = {};
  for (const [key, value] of Object.entries(backendPlayer.stats)) {
    if (key.startsWith("avg")) {
      // Remove the avg
      const statName = key.substring(3);

      // Format conversion
      const formattedName =
        statName.charAt(0).toUpperCase() + statName.slice(1);

      const displayName = formatStatName(formattedName);

      stats[displayName] = value as number;
    }
  }

  // trend for now TODO figure out what this really should be
  const trend = backendPlayer.score > 85 ? "up" : "down";

  return {
    id: backendPlayer.playerID,
    name: backendPlayer.playerName,
    team: backendPlayer.teamName || "UNK",
    position: positionMap[backendPlayer.position] || "QB",
    stats: stats,
    mlScore: Math.round(backendPlayer.score || 50),
    trend: trend,
    lastUpdated: new Date().toISOString().split("T")[0],
    note: "",
    recentNews: [],
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
export function adaptTeamData(backendTeam: any) {
  return {
    id: backendTeam.teamID,
    name: backendTeam.teamName,
    code: getTeamCode(backendTeam.teamName),
    strength: backendTeam.teamStrength,
  };
}

//team code from name
function getTeamCode(teamName: string): string {
  const words = teamName.split(" ");
  if (words.length === 1) return teamName.substring(0, 3).toUpperCase();

  const teamCodes: Record<string, string> = {
    "Kansas City Chiefs": "KC",
    "Buffalo Bills": "BUF",
    "San Francisco 49ers": "SF",
    "Dallas Cowboys": "DAL",
    "Philadelphia Eagles": "PHI",
    //TODO need to add the rest
  };

  return (
    teamCodes[teamName] ||
    words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  );
}
