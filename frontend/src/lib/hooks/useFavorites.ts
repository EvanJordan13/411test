import { useState, useEffect, useCallback } from "react";
import { userAPI } from "@/lib/api/apiClient";
import { adaptPlayerData } from "@/lib/adapters/playerAdapter";
import { Player } from "@/types";
import { useAuth } from "@/lib/context/AuthContext";

interface UseFavoritesOptions {
  initialFavorites?: Player[];
}

export function useFavorites({ initialFavorites = [] }: UseFavoritesOptions) {
  const { username, isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState<Player[]>(initialFavorites);
  const [loading, setLoading] = useState<boolean>(isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  const [playerNotes, setPlayerNotes] = useState<Record<string, string>>({});

  const fetchFavorites = useCallback(async () => {
    if (!username) {
      setFavorites([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await userAPI.getUserProfile(username);
      if (userData && userData.favorites) {
        const adaptedFavorites = userData.favorites.map(adaptPlayerData);

        setFavorites(adaptedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "erro");
      const storedFavorites = localStorage.getItem(`favorites_${username}`);
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch {
          localStorage.removeItem(`favorites_${username}`);
        }
      } else {
        setFavorites([]);
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  const addFavorite = useCallback(
    async (player: Player) => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        await userAPI.addFavorite(username, player.id.toString());
        // Update local storage and state after successful API call
        setFavorites((prev) => {
          if (prev.some((p) => p.id === player.id)) return prev;
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
    async (playerId: string) => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        await userAPI.removeFavorite(username, playerId.toString());
        // Update local storage and state after successful API call
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
      const isCurrentlyFavorite = favorites.some((f) => f.id === player.id);
      if (isCurrentlyFavorite) {
        removeFavorite(player.id);
      } else {
        addFavorite(player);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (playerId: string) => {
      return favorites.some((f) => f.id === playerId);
    },
    [favorites]
  );

  const updateNote = useCallback(
    (playerId: string, note: string) => {
      if (!username) return;

      setPlayerNotes((prev) => {
        const newNotes = { ...prev, [playerId]: note };
        localStorage.setItem(`notes_${username}`, JSON.stringify(newNotes));
        return newNotes;
      });

      // note in the favorites state as well
      setFavorites((prev) =>
        prev.map((p) =>
          p.id === playerId
            ? {
                ...p,
                note,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : p
        )
      );
    },
    [username]
  );

  const getNote = useCallback(
    (playerId: string) => {
      return playerNotes[playerId] || "";
    },
    [playerNotes]
  );

  useEffect(() => {
    if (username) {
      fetchFavorites();
      const storedNotes = localStorage.getItem(`notes_${username}`);
      if (storedNotes) {
        try {
          setPlayerNotes(JSON.parse(storedNotes));
        } catch {
          localStorage.removeItem(`notes_${username}`);
        }
      } else {
        setPlayerNotes({});
      }
    } else {
      setFavorites([]);
      setPlayerNotes({});
      setLoading(false);
      setError(null);
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
