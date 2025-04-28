"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import PlayerSearchResult from "@/components/ui/PlayerSearchResult";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { Player, Position } from "@/types";
import { teamAPI } from "@/lib/api/apiClient";
import { adaptTeamData } from "@/lib/adapters/playerAdapter";

export default function PlayersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [teams, setTeams] = useState<
    { id: number; code: string; name: string }[]
  >([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const initialQuery = searchParams.get("q") || "";
  const initialSortBy = searchParams.get("sortBy") || "score";
  const initialSortDir =
    (searchParams.get("sortDir") as "ASC" | "DESC") || "DESC";
  const initialPos = (searchParams.get("pos") as Position | "all") || "all";
  const initialTeam = searchParams.get("team") || "all";

  const [currentPosition, setCurrentPosition] = useState<Position | "all">(
    initialPos
  );
  const [currentTeam, setCurrentTeam] = useState<string>(initialTeam);

  const {
    players,
    loading,
    error,
    fetchPlayers,
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
  } = usePlayers({
    initialSortBy: initialSortBy,
    initialSortDir: initialSortDir,
    initialSearchQuery: initialQuery,
    initialTeamFilter: initialTeam,
  });

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "score") params.set("sortBy", sortBy);
    if (sortDir !== "DESC") params.set("sortDir", sortDir);
    if (currentPosition !== "all") params.set("pos", currentPosition);
    if (currentTeam !== "all") params.set("team", currentTeam);
    router.replace(`/players?${params.toString()}`, { scroll: false });
  }, [searchQuery, sortBy, sortDir, currentPosition, currentTeam, router]);

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

  useEffect(() => {
    setPage(1);
    fetchPlayers(
      1,
      sortBy,
      sortDir,
      debouncedSearchQuery,
      currentTeam,
      currentPosition
    );
    updateURL();
  }, [
    sortBy,
    sortDir,
    debouncedSearchQuery,
    currentTeam,
    currentPosition,
    fetchPlayers,
    updateURL,
    setPage,
  ]);

  useEffect(() => {
    setTeamFilter(currentTeam);
  }, [currentTeam, setTeamFilter]);

  useEffect(() => {}, [teamFilter]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPlayers(
        page + 1,
        sortBy,
        sortDir,
        debouncedSearchQuery,
        currentTeam,
        currentPosition
      );
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortDir((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(newSortBy);
      setSortDir("DESC");
    }
  };

  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NFL Players</h1>
          <p className="mt-2 text-gray-600">
            Browse, search, and sort players.
          </p>
          {error && (
            <p className="text-red-500 mt-2">Error fetching players: {error}</p>
          )}
        </div>

        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label
                htmlFor="player-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  id="player-search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by player name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="position-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position
              </label>
              <select
                id="position-filter"
                className="w-full p-2 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={currentPosition}
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

            <div>
              <label
                htmlFor="team-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Team
              </label>
              <select
                id="team-filter"
                className="w-full p-2 rounded-md border border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={currentTeam}
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

            <div className="md:col-span-4">
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <div className="flex">
                <select
                  id="sort-by"
                  className="flex-grow p-2 rounded-l-md border border-r-0 border-gray-300 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                  onClick={() => setSortDir(sortDir === "ASC" ? "DESC" : "ASC")}
                  className="p-2 border border-gray-300 rounded-r-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

        {loading && page === 1 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading players...</p>
          </div>
        ) : players.length > 0 ? (
          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow sm:rounded-md overflow-hidden"
              >
                <PlayerSearchResult player={p} onSelect={() => {}} />
              </div>
            ))}

            {hasMore && (
              <div className="pt-6 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="secondary"
                  size="md"
                >
                  {loading && page > 1 ? "Loading..." : "Load More Players"}
                </Button>
              </div>
            )}
          </div>
        ) : !loading ? (
          <div className="text-center py-10 bg-white rounded-md shadow">
            <p className="text-gray-500">
              No players found matching your criteria.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
