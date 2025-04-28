"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, ShieldCheck, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { usePlayers } from "@/lib/hooks/usePlayers"; // Reusing hook for team fetching part
import PlayerCard from "@/components/ui/PlayerCard"; // Reuse player card for top players
import { Player, Team } from "@/types";
import { useFavorites } from "@/lib/hooks/useFavorites"; // Needed for favorite toggle on player cards

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId
    ? parseInt(params.teamId as string, 10)
    : undefined;

  const {
    team, // Get team details from the hook
    loading: teamLoading,
    error: teamError,
    fetchTeamById,
  } = usePlayers({ teamId: teamId }); // Use the hook configured for fetching a team

  // Use favorites hook to manage favorite status on displayed player cards
  const { favorites, toggleFavorite } = useFavorites({});

  useEffect(() => {
    if (teamId && !isNaN(teamId)) {
      fetchTeamById(teamId);
    } else {
      // Handle invalid or missing ID
      console.error("Invalid team ID");
      // Optionally redirect or show an error message
    }
  }, [teamId, fetchTeamById]);

  const topPlayers = [
    { position: "QB", player: team?.topQB },
    { position: "RB", player: team?.topRB },
    { position: "WR", player: team?.topWR },
    { position: "TE", player: team?.topTE },
  ].filter((p) => p.player) as { position: string; player: Player }[]; // Filter out undefined players

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="text-gray-500 text-lg">Loading team details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (teamError || !team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="text-red-600 mb-6 font-medium">
              {teamError || "Could not load team details."}
            </div>
            <Button
              onClick={() => router.push("/teams")}
              variant="primary"
              icon={<ArrowLeft size={20} />}
            >
              Back to Teams
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push("/teams")}
            variant="outline"
            className="inline-flex items-center"
            icon={<ArrowLeft size={16} className="mr-1" />}
          >
            Back to Teams
          </Button>
        </div>

        {/* Team Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-1">{team.name}</h1>
            <span className="text-xl font-medium opacity-90">
              ({team.code})
            </span>
          </div>
          <div className="text-right">
            <p className="text-lg opacity-80">Team Strength</p>
            <p className="text-5xl font-bold">{team.strength ?? "N/A"}</p>
          </div>
        </div>

        {/* Top Players Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Top Players by Position
          </h2>
          {topPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlayers.map(({ position, player }) => (
                <div key={player.id}>
                  <div className="text-center mb-2 font-semibold text-gray-700">
                    {position}
                  </div>
                  <PlayerCard
                    player={player}
                    favorites={favorites.map((f) => f.id)}
                    onToggleFavorite={toggleFavorite}
                    showStats={false} // Keep card simple
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              No top player information available for this team.
            </div>
          )}
        </div>

        {/* Placeholder for more team stats or info if added later */}
        {/* <div className="bg-white rounded-xl shadow p-6">
             <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Team Info</h3>
             <p className="text-gray-600">More team details could go here...</p>
         </div> */}
      </main>
    </div>
  );
}
