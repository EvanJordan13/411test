"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, ArrowDownUp, SortAsc, SortDesc } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/ui/SearchBar";
import PlayerCard from "@/components/ui/PlayerCard";
import PlayerSearchResult from "@/components/ui/PlayerSearchResult";
import Button from "@/components/ui/Button";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Player, Position } from "@/types";
import { teamAPI } from "@/lib/api/apiClient";
import { adaptTeamData } from "@/lib/adapters/playerAdapter";

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchFocus, setSearchFocus] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<(Player | null)[]>([
    null,
    null,
  ]);
  const [teams, setTeams] = useState<
    { id: number; code: string; name: string }[]
  >([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Initialize filter/sort states from URL or defaults
  const initialQuery = searchParams.get("query") || "";
  const initialSortBy = searchParams.get("sortBy") || "score";
  const initialSortDir =
    (searchParams.get("sortDir") as "ASC" | "DESC") || "DESC";
  const initialPos = (searchParams.get("pos") as Position | "all") || "all";
  const initialTeam = searchParams.get("team") || "all";

  // Local state for UI control
  const [currentPosition, setCurrentPosition] = useState<Position | "all">(
    initialPos
  );
  const [currentTeam, setCurrentTeam] = useState<string>(initialTeam);

  // Use the hook, passing only relevant initial config
  const {
    players,
    loading,
    error,
    fetchPlayers,
    // loadMore, // We will call fetchPlayers directly for loading more
    hasMore,
    page,
    setPage,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
    searchQuery,
    setSearchQuery,
    teamFilter, // Keep hook's teamFilter state synced
    setTeamFilter,
    // No position or setPosition needed from hook
  } = usePlayers({
    initialSortBy: initialSortBy,
    initialSortDir: initialSortDir,
    initialSearchQuery: initialQuery,
    initialTeamFilter: initialTeam, // Sync hook's initial state
    // No initial position needed for hook
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites({});

  // Sync hook's teamFilter state when local currentTeam changes
  useEffect(() => {
    setTeamFilter(currentTeam);
  }, [currentTeam, setTeamFilter]);

  // Sync local team state if hook's teamFilter changes (e.g. back button)
  useEffect(() => {
    setCurrentTeam(teamFilter);
  }, [teamFilter]);

  // Update URL when filters/sort change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (sortBy !== "score") params.set("sortBy", sortBy);
    if (sortDir !== "DESC") params.set("sortDir", sortDir);
    if (currentPosition !== "all") params.set("pos", currentPosition);
    if (currentTeam !== "all") params.set("team", currentTeam);

    router.replace(`/compare?${params.toString()}`, { scroll: false });
  }, [searchQuery, sortBy, sortDir, currentPosition, currentTeam, router]);

  // Fetch teams for the dropdown
  useEffect(() => {
    const fetchTeamsData = async () => {
      setTeamsLoading(true);
      try {
        const teamsData = await teamAPI.getTeams(undefined, "teamName", "ASC");
        const adaptedTeams = teamsData.map(adaptTeamData);
        setTeams(adaptedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeamsData();
  }, []);

  // Effect to refetch players when filters/sort change via UI elements
  useEffect(() => {
    // Reset page to 1 when filters change
    setPage(1); // Explicitly reset page state in hook
    fetchPlayers(1, sortBy, sortDir, searchQuery, currentTeam, currentPosition);
    updateURL(); // Update URL whenever filters/sort change
  }, [
    sortBy,
    sortDir,
    searchQuery,
    currentTeam,
    currentPosition,
    fetchPlayers,
    updateURL,
    setPage,
  ]); // Removed hook setters, added setPage

  // Function to handle loading more players
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPlayers(
        page + 1,
        sortBy,
        sortDir,
        searchQuery,
        currentTeam,
        currentPosition
      );
    }
  };

  const handleCompare = () => {
    if (selectedPlayers[0] && selectedPlayers[1]) {
      router.push(
        `/head-to-head?p1=${selectedPlayers[0].id}&p2=${selectedPlayers[1].id}`
      );
    }
  };

  const handleSelectPlayer = (player: Player) => {
    const currentEmpty = selectedPlayers.findIndex((p) => !p);
    if (currentEmpty !== -1) {
      const newPlayers = [...selectedPlayers];
      newPlayers[currentEmpty] = player;
      setSelectedPlayers(newPlayers);
    } else {
      const newPlayers = [...selectedPlayers];
      newPlayers[0] = player;
      setSelectedPlayers(newPlayers);
    }
    setSearchFocus(false);
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(newSortBy);
      setSortDir("DESC");
    }
  };

  const EmptyPlayerCard = () => (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-8 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus size={24} className="text-blue-500" />
        </div>
        <p className="text-gray-600 mb-2">Select a player to compare</p>
        <p className="text-sm text-gray-400">
          Search or choose from results below
        </p>
      </div>
    </div>
  );

  const sortOptions = [
    { value: "score", label: "ML Score" },
    { value: "playerName", label: "Name" },
    { value: "playerAge", label: "Age" },
    { value: "numGames", label: "Games Played" },
    { value: "numSeasons", label: "Seasons" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compare Players</h1>
          <p className="mt-2 text-gray-600">
            Select two players to compare stats and performance
          </p>
          {error && (
            <p className="text-red-500 mt-2">Error fetching players: {error}</p>
          )}
        </div>

        {/* Comparison Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[0, 1].map((index) => (
            <div key={index}>
              {selectedPlayers[index] ? (
                <PlayerCard
                  player={selectedPlayers[index]!}
                  favorites={favorites.map((p) => p.id)}
                  onToggleFavorite={() =>
                    selectedPlayers[index] &&
                    toggleFavorite(selectedPlayers[index]!)
                  }
                  showStats={true}
                  onRemove={() => {
                    const newPlayers = [...selectedPlayers];
                    newPlayers[index] = null;
                    setSelectedPlayers(newPlayers);
                  }}
                />
              ) : (
                <EmptyPlayerCard />
              )}
            </div>
          ))}
        </div>

        {/* Compare Button - Placed above search for better flow */}
        <div className="text-center mb-8">
          <Button
            onClick={handleCompare}
            disabled={!selectedPlayers[0] || !selectedPlayers[1]}
            variant="primary"
            size="lg"
            className={
              !selectedPlayers[0] || !selectedPlayers[1]
                ? "bg-gray-300 cursor-not-allowed hover:bg-gray-300"
                : ""
            }
          >
            Compare Head-to-Head
          </Button>
        </div>

        {/* Search Section */}
        <div className="mb-8 relative">
          <SearchBar
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={setSearchQuery} // Use setter from hook directly
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          >
            {/* Filters and Sort Controls */}
            <div className="mb-4 p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                {/* Position Filter */}
                <div>
                  <label
                    htmlFor="position-filter"
                    className="block text-sm font-medium text-gray-500 mb-1"
                  >
                    Position
                  </label>
                  <select
                    id="position-filter"
                    className="w-full p-2 rounded-lg border text-sm"
                    value={currentPosition} // Use local UI state
                    onChange={(e) =>
                      setCurrentPosition(e.target.value as Position | "all")
                    }
                  >
                    <option value="all">All Positions</option>
                    <option value="QB">QB</option>
                    <option value="RB">RB</option>
                    <option value="WR">WR</option>
                    <option value="TE">TE</option>
                  </select>
                </div>

                {/* Team Filter */}
                <div>
                  <label
                    htmlFor="team-filter"
                    className="block text-sm font-medium text-gray-500 mb-1"
                  >
                    Team
                  </label>
                  <select
                    id="team-filter"
                    className="w-full p-2 rounded-lg border text-sm"
                    value={currentTeam} // Use local UI state
                    onChange={(e) => setCurrentTeam(e.target.value)}
                    disabled={teamsLoading}
                  >
                    <option value="all">All Teams</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.code}>
                        {team.name} ({team.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Control */}
                <div>
                  <label
                    htmlFor="sort-by"
                    className="block text-sm font-medium text-gray-500 mb-1"
                  >
                    Sort By
                  </label>
                  <div className="flex">
                    <select
                      id="sort-by"
                      className="flex-grow p-2 rounded-l-lg border border-r-0 text-sm"
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() =>
                        setSortDir(sortDir === "ASC" ? "DESC" : "ASC")
                      }
                      className="p-2 border rounded-r-lg text-sm bg-white hover:bg-gray-100"
                      aria-label={
                        sortDir === "ASC" ? "Sort Descending" : "Sort Ascending"
                      }
                    >
                      {sortDir === "ASC" ? (
                        <SortAsc size={16} />
                      ) : (
                        <SortDesc size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results Area */}
            <div className="mt-2 max-h-96 overflow-y-auto">
              {loading && page === 1 ? ( // Show loading only on initial page load for filters
                <div className="text-center py-4">
                  <p className="text-gray-500">Loading players...</p>
                </div>
              ) : players.length > 0 ? (
                <div className="space-y-1">
                  {players.map((player) => (
                    <PlayerSearchResult
                      key={player.id}
                      player={player}
                      onSelect={handleSelectPlayer}
                    />
                  ))}
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="pt-4 text-center">
                      <Button
                        onClick={handleLoadMore} // Use updated handler
                        disabled={loading} // Disable button while loading more
                        variant="secondary"
                        size="sm"
                      >
                        {loading && page > 1
                          ? "Loading..."
                          : "Load More Players"}{" "}
                        {/* Show loading only when loading more */}
                      </Button>
                    </div>
                  )}
                </div>
              ) : !loading ? ( // Only show "No players found" if not loading
                <div className="text-center py-6 text-gray-500">
                  No players found matching your criteria.
                </div>
              ) : null}
            </div>
          </SearchBar>
        </div>
      </main>
    </div>
  );
}
