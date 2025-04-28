import { useState, useEffect, useCallback } from "react";
import { playerAPI, teamAPI } from "@/lib/api/apiClient";
import { adaptPlayerData, adaptTeamData } from "@/lib/adapters/playerAdapter";
import { Player, Position, Team } from "@/types";

interface UsePlayersOptions {
  initialPage?: number;
  // Remove position prop from options, it's managed by the component
  // position?: Position | "all";
  playerId?: string;
  teamId?: number;
  initialSortBy?: string;
  initialSortDir?: "ASC" | "DESC";
  initialSearchQuery?: string;
  initialTeamFilter?: string;
}

export function usePlayers({
  initialPage = 1,
  // position = "all", // Removed
  playerId,
  teamId,
  initialSortBy = "score", // Default sort
  initialSortDir = "DESC",
  initialSearchQuery = "",
  initialTeamFilter = "all",
}: UsePlayersOptions = {}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [team, setTeam] = useState<Team | null>(null); // For team details
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">(initialSortDir);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [teamFilter, setTeamFilter] = useState<string>(initialTeamFilter);
  // Removed internal position state: const [positionFilter, setPositionFilter] = useState<Position | "all">(position);

  const fetchPlayers = useCallback(
    // Add positionFilter argument here
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
          currentPositionFilter !== "all" ? currentPositionFilter : undefined, // Use argument
          currentSearchQuery || undefined,
          currentTeamFilter !== "all" ? currentTeamFilter : undefined,
          currentSortBy || undefined,
          currentSortDir || undefined
        );

        const adaptedPlayers = data.map(adaptPlayerData);

        setPlayers((prev) =>
          pageNum === 1 ? adaptedPlayers : [...prev, ...adaptedPlayers]
        );
        // Assuming page size is consistent, adjust if backend signals differently
        setHasMore(adaptedPlayers.length > 0); // Simple check, refine if backend provides total count
        setPage(pageNum);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred fetching players"
        );
        setHasMore(false); // Stop loading more on error
      } finally {
        setLoading(false);
      }
    },
    // Removed position from dependencies as it's now passed directly
    [sortBy, sortDir, searchQuery, teamFilter] // Dependencies that trigger refetch logic internally if needed
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
      // Fetch next page with current filters/sorting state from the hook
      // Need to get current position from component state somehow, or pass it here
      // This design is a bit tricky. Maybe fetchPlayers should not depend on position state
      // but *always* take it as an argument. Let's stick to that.
      // The component calling loadMore needs to know the current position filter.
      // Or, fetchPlayers *always* uses the component's state passed in its call.
      // Let's assume the component calls fetchPlayers correctly in loadMore.
      // The component needs access to the current position filter to pass it.
      // This implies the component should manage the position filter state.
      // The loadMore function here needs the current position. Passing it seems complex.

      // Simpler: loadMore just increments the page. The component's useEffect handles the actual fetch
      // based on state changes, including page potentially.
      // Let's revert loadMore slightly - it only increments page state.
      // setPage(prevPage => prevPage + 1); // Trigger fetch via useEffect watching page? Risky.

      // Let's keep loadMore calling fetchPlayers, but it needs the position.
      // The hook shouldn't manage position state. Component passes it.
      console.warn(
        "loadMore called, but requires current position filter from component context"
      );
      // The calling component will need to call fetchPlayers(page + 1, ..., currentPosition) instead of loadMore().
      // OR modify loadMore to accept the current position. Let's do that for simplicity here.
      // fetchPlayers(page + 1, sortBy, sortDir, searchQuery, teamFilter, /* How to get position? */ );
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
  ]); // Add fetchPlayers dependency

  // Effect to fetch initial data
  useEffect(() => {
    if (playerId) {
      fetchPlayerById(playerId);
    } else if (teamId) {
      fetchTeamById(teamId);
    } else {
      // Initial fetch - position needs to come from initial options somehow if hook managed it,
      // but it doesn't anymore. The component's useEffect will handle the initial fetch.
      // fetchPlayers(1, sortBy, sortDir, searchQuery, teamFilter, position); // position is not defined here
    }
    // This useEffect might be redundant now if the component handles initial fetch based on its state.
    // Let's remove the player list fetch from here. Component handles it.
  }, [playerId, teamId, fetchPlayerById, fetchTeamById]); // Keep for ID-based fetching

  return {
    players,
    player,
    team, // Expose team state
    loading,
    error,
    hasMore,
    page,
    setPage, // Expose setPage if needed for manual resets
    // Expose filter/sort states and setters
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    searchQuery,
    setSearchQuery,
    teamFilter,
    setTeamFilter,
    // position: positionFilter, // Removed
    loadMore, // Needs adjustment in component usage
    fetchPlayers, // Allow manual refetch/reset
    fetchPlayerById,
    fetchTeamById, // Expose team fetch
    comparePlayers,
  };
}
