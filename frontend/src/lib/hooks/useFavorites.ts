import { useState, useEffect, useCallback } from "react";
import { userAPI } from "@/lib/api/apiClient";
import {
  adaptPlayerData,
  adaptFavoriteSummary,
  FavoriteSummaryData,
} from "@/lib/adapters/playerAdapter";
import { Player } from "@/types";
import { useAuth } from "@/lib/context/AuthContext";

interface UseFavoritesOptions {
  initialFavorites?: Player[];
}

export function useFavorites({
  initialFavorites = [],
}: UseFavoritesOptions = {}) {
  const { username, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Player[]>(initialFavorites);
  const [loading, setLoading] = useState<boolean>(isAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [playerNotes, setPlayerNotes] = useState<Record<string, string>>({});
  const [favoriteSummary, setFavoriteSummary] = useState<FavoriteSummaryData[]>(
    []
  );
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

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

        // Load notes after favorites are fetched
        const storedNotes = localStorage.getItem(`notes_${username}`);
        let notesMap: Record<string, string> = {};
        if (storedNotes) {
          try {
            notesMap = JSON.parse(storedNotes);
          } catch {
            localStorage.removeItem(`notes_${username}`);
          }
        }
        setPlayerNotes(notesMap); // Set notes state

        // Apply stored notes to adapted favorites
        const favoritesWithNotes = adaptedFavorites.map(
          (fav: { id: string | number }) => ({
            ...fav,
            note: notesMap[fav.id] || "",
          })
        );

        setFavorites(favoritesWithNotes);
        // Persist fetched favorites locally in case backend becomes unavailable later
        localStorage.setItem(
          `favorites_${username}`,
          JSON.stringify(favoritesWithNotes)
        );
      } else {
        setFavorites([]);
        localStorage.removeItem(`favorites_${username}`); // Clear local cache if backend returns none
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching favorites");
      // Fallback to local storage if fetch fails
      const storedFavorites = localStorage.getItem(`favorites_${username}`);
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites);
          // Ensure notes are loaded even on fallback
          const storedNotes = localStorage.getItem(`notes_${username}`);
          let notesMap: Record<string, string> = {};
          if (storedNotes) {
            try {
              notesMap = JSON.parse(storedNotes);
            } catch {
              localStorage.removeItem(`notes_${username}`);
            }
          }
          setPlayerNotes(notesMap);
          const favoritesWithNotes = parsedFavorites.map((fav: Player) => ({
            ...fav,
            note: notesMap[fav.id] || "",
          }));
          setFavorites(favoritesWithNotes);
        } catch {
          localStorage.removeItem(`favorites_${username}`);
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  const fetchFavoriteSummary = useCallback(
    async (position: string, stat: string) => {
      if (!username) return;
      setSummaryLoading(true);
      setSummaryError(null);
      try {
        const summaryData = await userAPI.getFavoriteSummary(
          username,
          position,
          stat
        );
        const adaptedSummary = summaryData.map(adaptFavoriteSummary);
        setFavoriteSummary(adaptedSummary);
      } catch (err) {
        setSummaryError(
          err instanceof Error ? err.message : "Error fetching favorite summary"
        );
        setFavoriteSummary([]);
      } finally {
        setSummaryLoading(false);
      }
    },
    [username]
  );

  const addFavorite = useCallback(
    async (player: Player) => {
      if (!username) return;

      // Optimistic UI update
      const previousFavorites = favorites;
      const newOptimisticFavorites = [
        ...previousFavorites,
        { ...player, note: playerNotes[player.id] || "" },
      ];
      setFavorites(newOptimisticFavorites);

      setLoading(true); // Use main loading indicator or a specific one?
      setError(null);

      try {
        await userAPI.addFavorite(username, player.id.toString());
        // Update local storage after successful API call
        localStorage.setItem(
          `favorites_${username}`,
          JSON.stringify(newOptimisticFavorites)
        );
        // No need to setFavorites again if optimistic update worked
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred adding favorite"
        );
        // Revert optimistic update on error
        setFavorites(previousFavorites);
        localStorage.setItem(
          `favorites_${username}`,
          JSON.stringify(previousFavorites)
        );
      } finally {
        setLoading(false);
      }
    },
    [username, favorites, playerNotes] // Added dependencies
  );

  const removeFavorite = useCallback(
    async (playerId: string) => {
      if (!username) return;

      // Optimistic UI update
      const previousFavorites = favorites;
      const newOptimisticFavorites = previousFavorites.filter(
        (p) => p.id !== playerId
      );
      setFavorites(newOptimisticFavorites);

      setLoading(true); // Use main loading indicator or a specific one?
      setError(null);

      try {
        await userAPI.removeFavorite(username, playerId.toString());
        // Update local storage after successful API call
        localStorage.setItem(
          `favorites_${username}`,
          JSON.stringify(newOptimisticFavorites)
        );
        // No need to setFavorites again if optimistic update worked
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred removing favorite"
        );
        // Revert optimistic update on error
        setFavorites(previousFavorites);
        localStorage.setItem(
          `favorites_${username}`,
          JSON.stringify(previousFavorites)
        );
      } finally {
        setLoading(false);
      }
    },
    [username, favorites] // Added dependency
  );

  const toggleFavorite = useCallback(
    (player: Player) => {
      const isCurrentlyFavorite = favorites.some((f) => f.id === player.id);
      if (isCurrentlyFavorite) {
        removeFavorite(player.id);
      } else {
        // Ensure player object passed to addFavorite includes current note if any
        const playerWithNote = {
          ...player,
          note: playerNotes[player.id] || "",
        };
        addFavorite(playerWithNote);
      }
    },
    [favorites, addFavorite, removeFavorite, playerNotes] // Added dependency
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

      // Update notes state first
      const newNotes = { ...playerNotes, [playerId]: note };
      setPlayerNotes(newNotes);
      localStorage.setItem(`notes_${username}`, JSON.stringify(newNotes));

      // Update the note in the favorites state array as well
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
      // Also update the favorites in local storage to persist the note change with the favorite player data
      localStorage.setItem(
        `favorites_${username}`,
        JSON.stringify(
          favorites.map((p) =>
            p.id === playerId
              ? {
                  ...p,
                  note,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : p
          )
        )
      );
    },
    [username, playerNotes, favorites] // Added dependencies
  );

  const getNote = useCallback(
    (playerId: string) => {
      return playerNotes[playerId] || "";
    },
    [playerNotes]
  );

  // Initial fetch effect
  useEffect(() => {
    if (isAuthenticated && username) {
      fetchFavorites();
      // Notes are now loaded within fetchFavorites after successful fetch or from cache on error
    } else {
      // Clear state if not authenticated or no username
      setFavorites([]);
      setPlayerNotes({});
      setFavoriteSummary([]);
      setLoading(false);
      setError(null);
      setSummaryLoading(false);
      setSummaryError(null);
    }
  }, [username, isAuthenticated, fetchFavorites]); // Rerun if auth state changes

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
    favoriteSummary,
    summaryLoading,
    summaryError,
    fetchFavoriteSummary, // Expose the summary fetch function
  };
}
