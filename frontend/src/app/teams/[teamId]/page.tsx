"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, ShieldCheck, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { usePlayers } from "@/lib/hooks/usePlayers";
import TopPlayerCard from "@/components/ui/TopPlayerCard";
import { Player, Team } from "@/types";
import { useFavorites } from "@/lib/hooks/useFavorites";

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId
    ? parseInt(params.teamId as string, 10)
    : undefined;

  const {
    team,
    loading: teamLoading,
    error: teamError,
    fetchTeamById,
  } = usePlayers({ teamId: teamId });

  // Use favorites hook to manage favorite status on displayed player cards
  const { favorites, toggleFavorite, isFavorite } = useFavorites({});

  useEffect(() => {
    if (teamId && !isNaN(teamId)) {
      fetchTeamById(teamId);
    } else {
      console.error("Invalid team ID");
    }
  }, [teamId, fetchTeamById]);

  const topPlayers = [
    { positionLabel: "Quarterback", player: team?.topQB },
    { positionLabel: "Running Back", player: team?.topRB },
    { positionLabel: "Wide Receiver", player: team?.topWR },
    { positionLabel: "Tight End", player: team?.topTE },
  ].filter((p) => !!p.player) as { positionLabel: string; player: Player }[];

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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold mb-1">{team.name}</h1>
            <span className="text-xl font-medium opacity-90">
              ({team.code})
            </span>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-lg opacity-80">Team Strength</p>
            <p className="text-5xl font-bold">{team.strength ?? "N/A"}</p>
          </div>
        </div>

        {/* Top Players Section*/}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
            Top Players by Position
          </h2>
          {topPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topPlayers.map(({ positionLabel, player }) => (
                <TopPlayerCard
                  key={player.id}
                  player={player}
                  positionLabel={positionLabel}
                  isFavorite={isFavorite(player.id)}
                  onToggleFavorite={() => toggleFavorite(player)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              No top player information available for this team.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
