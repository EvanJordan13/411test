import { useState, useEffect, useCallback } from "react";
import { userAPI } from "@/lib/api/apiClient"; // Adjust path if needed
import { adaptPlayerData } from "@/lib/adapters/playerAdapter"; // Adjust path if needed
import { Player, User } from "@/types"; // Adjust path if needed
import { useAuth } from "@/lib/context/AuthContext"; // Adjust path if needed

interface UseFavoritesOptions {
  initialFavorites?: Player[];
}

export function useFavorites({ initialFavorites = [] }: UseFavoritesOptions) {
  // Correctly destructure username directly from useAuth() based on AuthContextType
  const { username, isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState<Player[]>(initialFavorites);
  // Initialize loading based on whether we expect to fetch (i.e., user is authenticated)
  const [loading, setLoading] = useState<boolean>(isAuthenticated);
  const [error, setError] = useState<string | null>(null);

  const [playerNotes, setPlayerNotes] = useState<Record<string, string>>({});

  const fetchFavorites = useCallback(async () => {
    // Use the username from context
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
      setError(err instanceof Error ? err.message : "An error occurred");
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

      // Optimistic update removed for simplicity, relying on fetch/storage
      setLoading(true); // Indicate loading during API call
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
        // Optionally revert optimistic update here if implemented
      } finally {
        setLoading(false);
      }
    },
    [username]
  );

  const removeFavorite = useCallback(
    async (playerId: string) => {
      if (!username) return;

      // Optimistic update removed for simplicity
      setLoading(true); // Indicate loading during API call
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
        // Optionally revert optimistic update here if implemented
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
    [favorites, addFavorite, removeFavorite] // Keep dependencies
  );

  const isFavorite = useCallback(
    (playerId: string) => {
      return favorites.some((f) => f.id === playerId);
    },
    [favorites] // Keep dependency
  );

  const updateNote = useCallback(
    (playerId: string, note: string) => {
      if (!username) return;

      setPlayerNotes((prev) => {
        const newNotes = { ...prev, [playerId]: note };
        localStorage.setItem(`notes_${username}`, JSON.stringify(newNotes));
        return newNotes;
      });

      // Update note in the favorites state as well
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
    [username] // Keep dependency
  );

  const getNote = useCallback(
    (playerId: string) => {
      return playerNotes[playerId] || "";
    },
    [playerNotes] // Keep dependency
  );

  useEffect(() => {
    // Fetch or clear based on authentication status / username presence

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
        setPlayerNotes({}); // Ensure notes are cleared if nothing in storage
      }
    } else {
      setFavorites([]);
      setPlayerNotes({});
      setLoading(false); // Ensure loading is false if not authenticated
      setError(null);
    }
  }, [username, fetchFavorites]); // Keep dependencies

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
