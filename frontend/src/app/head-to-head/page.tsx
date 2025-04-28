"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import StatComparison from "@/components/ui/StatComparison";
import Button from "@/components/ui/Button";
import { usePlayers } from "@/lib/hooks/usePlayers";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { Player, NewsItem } from "@/types";
import PlayerHeader from "@/components/comparison/PlayerHeader";
import ScoreDisplay from "@/components/comparison/ScoreDisplay";

export default function HeadToHeadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);

  const player1Id = searchParams.get("p1");
  const player2Id = searchParams.get("p2");

  const { comparePlayers, loading, error } = usePlayers();
  const { favorites, toggleFavorite } = useFavorites({});

  useEffect(() => {
    const loadPlayers = async () => {
      if (!player1Id || !player2Id) {
        setPlayers([]);
        return;
      }
      setPlayers([]);

      try {
        const comparedPlayers = await comparePlayers(player1Id, player2Id);
        if (comparedPlayers && comparedPlayers.length === 2) {
          setPlayers(comparedPlayers);
        } else {
          console.error(
            "Comparison did not return two players:",
            comparedPlayers
          );
          setPlayers([]);
        }
      } catch (err) {
        console.error("Error comparing players:", err);
        setPlayers([]);
      }
    };

    loadPlayers();
  }, [player1Id, player2Id, comparePlayers]);

  const isFavorite = (playerId: string): boolean => {
    return Array.isArray(favorites) && favorites.some((f) => f.id === playerId);
  };

  //loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center">
            <div className="text-gray-500 text-lg">
              Loading comparison data...
            </div>
            {/*spinner here? probs a bit extra */}
          </div>
        </div>
      </div>
    );
  }

  //error
  if (error || players.length !== 2 || !player1Id || !player2Id) {
    let errorMessage = error || "Failed to load player comparison data.";
    if (!player1Id || !player2Id) {
      errorMessage =
        "Player IDs are missing. Please select two players to compare.";
    } else if (players.length !== 2 && !error) {
      errorMessage = "Could not find data for one or both selected players.";
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-100px)]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <div className="text-red-600 mb-6 font-medium">{errorMessage}</div>
            <Button
              onClick={() => router.push("/compare")}
              variant="primary"
              icon={<ArrowLeft size={20} />}
            >
              Select Players
            </Button>
          </div>
        </div>
      </div>
    );
  }

  //success
  const commonStats =
    players[0]?.stats && players[1]?.stats
      ? Object.keys(players[0].stats).filter(
          (key) =>
            key in players[1].stats &&
            players[0].stats[key] !== undefined &&
            players[1].stats[key] !== undefined
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.push("/compare")}
            variant="outline"
            className="mb-4 inline-flex items-center"
            icon={<ArrowLeft size={16} className="mr-1" />}
          >
            Back to Selection
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Head-to-Head Comparison
          </h1>
        </div>

        {/*Comparison*/}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
          {/* Player Headers */}
          <div className="grid grid-cols-3 items-center border-b border-gray-200">
            <PlayerHeader
              player={players[0]}
              isLeft={true}
              isFavorite={isFavorite(players[0].id)}
              onToggleFavorite={() => toggleFavorite(players[0])}
            />
            <div className="p-6 text-center border-l border-r border-gray-200">
              <span className="text-lg font-bold text-gray-700">VS</span>
            </div>
            <PlayerHeader
              player={players[1]}
              isLeft={false}
              isFavorite={isFavorite(players[1].id)}
              onToggleFavorite={() => toggleFavorite(players[1])}
            />
          </div>

          {/* scores */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-blue-50 via-white to-blue-50">
            <ScoreDisplay player={players[0]} isLeft={true} />
            <div className="flex items-center justify-center border-l border-r border-gray-200">
              <div className="w-px h-16 bg-gray-300"></div>
            </div>
            <ScoreDisplay player={players[1]} isLeft={false} />
          </div>

          {/* stats*/}
          {commonStats.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Statistical Breakdown
              </h3>
              {commonStats.map((key) => (
                <StatComparison
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  player1Stat={players[0].stats[key]}
                  player2Stat={players[1].stats[key]}
                />
              ))}
            </div>
          )}
        </div>

        {/* news*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {players.map((player) => {
            const playerNews = player.recentNews;

            return (
              <div key={player.id} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Latest News: {player.name}
                </h3>
                {playerNews!.length > 0 ? (
                  playerNews!.map((news) => (
                    <div
                      key={news.id}
                      className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <h4 className="font-semibold text-gray-800 mb-1 leading-tight">
                        {news.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                        <span>{news.source}</span>
                        <span>{new Date(news.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg shadow p-4 border border-gray-100">
                    <p className="text-sm text-gray-500">
                      No recent news available for {player.name}.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
