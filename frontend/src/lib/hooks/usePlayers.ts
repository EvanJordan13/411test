import { useState, useEffect, useCallback } from "react";
import { playerAPI } from "@/lib/api/apiClient";
import { adaptPlayerData } from "@/lib/adapters/playerAdapter";
import { Player, Position } from "@/types";

interface UsePlayersOptions {
  initialPage?: number;
  position?: Position | "all";
  playerId?: string;
}

export function usePlayers({
  initialPage = 1,
  position = "all",
  playerId,
}: UsePlayersOptions = {}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPlayers = useCallback(
    async (pageNum: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (position !== "all") {
          data = await playerAPI.getPlayersByPosition(position, pageNum);
        } else {
          data = await playerAPI.getPlayers(pageNum);
        }

        const adaptedPlayers = data.map(adaptPlayerData);

        setPlayers((prev) =>
          pageNum === 1 ? adaptedPlayers : [...prev, ...adaptedPlayers]
        );
        setHasMore(adaptedPlayers.length === 10);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [position]
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
      setError(err instanceof Error ? err.message : "An error occurred");
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
        return [adaptPlayerData(player1Data), adaptPlayerData(player2Data)];
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPlayers(page + 1);
    }
  }, [fetchPlayers, loading, hasMore, page]);

  useEffect(() => {
    if (playerId) {
      fetchPlayerById(playerId);
    } else {
      fetchPlayers(initialPage);
    }
  }, [fetchPlayers, fetchPlayerById, initialPage, playerId]);

  return {
    players,
    player,
    loading,
    error,
    hasMore,
    loadMore,
    fetchPlayers,
    fetchPlayerById,
    comparePlayers,
  };
}
