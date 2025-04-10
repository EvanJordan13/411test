import { useState, useEffect, useCallback } from "react";
import { userAPI } from "@/lib/api/apiClient";
import { adaptPlayerData } from "@/lib/adapters/playerAdapter";
import { Player } from "@/types";

interface UseFavoritesOptions {
  username: string;
  initialFavorites?: Player[];
}

export function useFavorites({
  username,
  initialFavorites = [],
}: UseFavoritesOptions) {
  const [favorites, setFavorites] = useState<Player[]>(initialFavorites);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [playerNotes, setPlayerNotes] = useState<Record<number, string>>({});

  const fetchFavorites = useCallback(async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await userAPI.getUserProfile(username);
      if (userData && userData.favorites) {
        const adaptedFavorites = userData.favorites.map(adaptPlayerData);
        setFavorites(adaptedFavorites);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      const storedFavorites = localStorage.getItem(`favorites_${username}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  const addFavorite = useCallback(
    async (player: Player) => {
      setLoading(true);
      setError(null);

      try {
        if (username) {
          await userAPI.addFavorite(username, player.id.toString());
        }

        setFavorites((prev) => {
          const newFavorites = [...prev, player];
          localStorage.setItem(
            `favorites_${username}`,
            JSON.stringify(newFavorites)
          );
          return newFavorites;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  const removeFavorite = useCallback(
    async (playerId: number) => {
      setLoading(true);
      setError(null);

      try {
        if (username) {
          await userAPI.removeFavorite(username, playerId.toString());
        }

        setFavorites((prev) => {
          const newFavorites = prev.filter((p) => p.id !== playerId);
          localStorage.setItem(
            `favorites_${username}`,
            JSON.stringify(newFavorites)
          );
          return newFavorites;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  const toggleFavorite = useCallback(
    (player: Player) => {
      const isFavorite = favorites.some((f) => f.id === player.id);
      if (isFavorite) {
        removeFavorite(player.id);
      } else {
        addFavorite(player);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (playerId: number) => {
      return favorites.some((f) => f.id === playerId);
    },
    [favorites]
  );

  const updateNote = useCallback(
    (playerId: number, note: string) => {
      setPlayerNotes((prev) => {
        const newNotes = { ...prev, [playerId]: note };
        localStorage.setItem(`notes_${username}`, JSON.stringify(newNotes));
        return newNotes;
      });

      setFavorites((prev) =>
        prev.map((player) =>
          player.id === playerId
            ? {
                ...player,
                note,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : player
        )
      );
    },
    [username]
  );

  const getNote = useCallback(
    (playerId: number) => {
      return playerNotes[playerId] || "";
    },
    [playerNotes]
  );

  useEffect(() => {
    if (username) {
      fetchFavorites();

      const storedNotes = localStorage.getItem(`notes_${username}`);
      if (storedNotes) {
        setPlayerNotes(JSON.parse(storedNotes));
      }
    }
  }, [username, fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    updateNote,
    getNote,
  };
}
