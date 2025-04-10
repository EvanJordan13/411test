"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocus, setSearchFocus] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<(Player | null)[]>([
    null,
    null,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<Position | "all">(
    "all"
  );
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [teams, setTeams] = useState<{ code: string; name: string }[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Use custom hooks
  const { players, loading, error, fetchPlayers } = usePlayers({
    position: selectedPosition,
  });
  const { favorites, toggleFavorite, isFavorite } = useFavorites({
    username: "currentUser",
    initialFavorites: [],
  });

  //search query from URL if present
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Fetch teams for the dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const teamsData = await teamAPI.getTeams();
        const adaptedTeams = teamsData.map(adaptTeamData);
        setTeams(adaptedTeams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // refetch players when filters change
  useEffect(() => {
    fetchPlayers(1);
  }, [selectedPosition, fetchPlayers]);

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
      //both slots are filled  replace the first one
      const newPlayers = [...selectedPlayers];
      newPlayers[0] = player;
      setSelectedPlayers(newPlayers);
    }
    setSearchQuery("");
  };

  // Filter players based on search query and team
  const filteredPlayers = players.filter((player) => {
    const matchesTeam = selectedTeam === "all" || player.team === selectedTeam;
    const matchesSearch =
      !searchQuery ||
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTeam && matchesSearch;
  });

  const EmptyPlayerCard = () => (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200 p-8 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus size={24} className="text-blue-500" />
        </div>
        <p className="text-gray-600 mb-2">Select a player to compare</p>
        <p className="text-sm text-gray-400">
          Search or choose from your favorites
        </p>
      </div>
    </div>
  );

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
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search players by name, team, or position..."
            value={searchQuery}
            onChange={setSearchQuery}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          >
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-2">
                Filters
              </div>
              <div className="flex space-x-4">
                <select
                  className="p-2 rounded-lg border text-sm"
                  value={selectedPosition}
                  onChange={(e) =>
                    setSelectedPosition(e.target.value as Position | "all")
                  }
                >
                  <option value="all">All Positions</option>
                  <option value="QB">QB</option>
                  <option value="RB">RB</option>
                  <option value="WR">WR</option>
                  <option value="TE">TE</option>
                </select>
                <select
                  className="p-2 rounded-lg border text-sm"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  disabled={teamsLoading}
                >
                  <option value="all">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.code} value={team.code}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading players...</p>
              </div>
            ) : filteredPlayers.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredPlayers.map((player) => (
                  <PlayerSearchResult
                    key={player.id}
                    player={player}
                    onSelect={handleSelectPlayer}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No players found matching your criteria
              </div>
            )}
          </SearchBar>
        </div>

        {/* Comparison Section */}
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
                  showNews={true}
                />
              ) : (
                <EmptyPlayerCard />
              )}
            </div>
          ))}
        </div>

        {/* Compare Button */}
        <div className="text-center">
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
      </main>
    </div>
  );
}
