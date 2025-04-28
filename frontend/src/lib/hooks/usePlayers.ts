import { useState, useEffect, useCallback } from "react";
import { playerAPI, teamAPI } from "@/lib/api/apiClient";
import { adaptPlayerData, adaptTeamData } from "@/lib/adapters/playerAdapter";
import { Player, Position, Team } from "@/types";

interface UsePlayersOptions {
  initialPage?: number;

  playerId?: string;
  teamId?: number;
  initialSortBy?: string;
  initialSortDir?: "ASC" | "DESC";
  initialSearchQuery?: string;
  initialTeamFilter?: string;
}

export function usePlayers({
  initialPage = 1,
  playerId,
  teamId,
  initialSortBy = "score",
  initialSortDir = "DESC",
  initialSearchQuery = "",
  initialTeamFilter = "all",
}: UsePlayersOptions = {}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">(initialSortDir);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [teamFilter, setTeamFilter] = useState<string>(initialTeamFilter);

  const fetchPlayers = useCallback(
    async (
      pageNum: number = 1,
      currentSortBy = sortBy,
      currentSortDir = sortDir,
      currentSearchQuery = searchQuery,
      currentTeamFilter = teamFilter,
      currentPositionFilter: Position | "all" = "all"
    ) => {
      setLoading(true);
      setError(null);

      try {
        const data = await playerAPI.getPlayers(
          pageNum,
          currentPositionFilter !== "all" ? currentPositionFilter : undefined,
          currentSearchQuery || undefined,
          currentTeamFilter !== "all" ? currentTeamFilter : undefined,
          currentSortBy || undefined,
          currentSortDir || undefined
        );

        const adaptedPlayers = data.map(adaptPlayerData);

        setPlayers((prev) =>
          pageNum === 1 ? adaptedPlayers : [...prev, ...adaptedPlayers]
        );
        setHasMore(adaptedPlayers.length > 0);
        setPage(pageNum);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred fetching players"
        );
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [sortBy, sortDir, searchQuery, teamFilter]
  );

  const fetchPlayerById = useCallback(async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await playerAPI.getPlayerById(id);
      const adaptedPlayer = adaptPlayerData(data);
      setPlayer(adaptedPlayer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred fetching player details"
      );
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamById = useCallback(async (id: number) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await teamAPI.getTeamById(id);
      const adaptedTeam = adaptTeamData(data);
      setTeam(adaptedTeam);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred fetching team details"
      );
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const comparePlayers = useCallback(
    async (player1Id: string, player2Id: string) => {
      setLoading(true);
      setError(null);

      try {
        const [player1Data, player2Data] = await playerAPI.comparePlayers(
          player1Id,
          player2Id
        );
        // Check if data is valid before adapting
        if (!player1Data || !player2Data) {
          throw new Error("Could not fetch data for one or both players.");
        }
        return [adaptPlayerData(player1Data), adaptPlayerData(player2Data)];
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during comparison"
        );
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      console.warn(
        "loadMore called, but requires current position filter from component context"
      );
    }
  }, [
    loading,
    hasMore,
    page,
    sortBy,
    sortDir,
    searchQuery,
    teamFilter,
    fetchPlayers,
  ]);

  // Effect to fetch initial data
  useEffect(() => {
    if (playerId) {
      fetchPlayerById(playerId);
    } else if (teamId) {
      fetchTeamById(teamId);
    } else {
    }
  }, [playerId, teamId, fetchPlayerById, fetchTeamById]);

  return {
    players,
    player,
    team,
    loading,
    error,
    hasMore,
    page,
    setPage,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    searchQuery,
    setSearchQuery,
    teamFilter,
    setTeamFilter,
    loadMore,
    fetchPlayers,
    fetchPlayerById,
    fetchTeamById,
    comparePlayers,
  };
}
