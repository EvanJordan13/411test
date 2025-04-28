"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowDownUp,
  SortAsc,
  SortDesc,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import { teamAPI } from "@/lib/api/apiClient";
import { adaptTeamData } from "@/lib/adapters/playerAdapter";
import { Team } from "@/types";

export default function TeamsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "teamStrength"
  );
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">(
    (searchParams.get("sortDir") as "ASC" | "DESC") || "DESC"
  );

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchTeams = useCallback(
    async (query = debouncedSearchQuery, sort = sortBy, dir = sortDir) => {
      setLoading(true);
      setError(null);
      try {
        const data = await teamAPI.getTeams(
          query || undefined,
          sort || undefined,
          dir || undefined
        );
        const adaptedTeams = data.map(adaptTeamData);
        setTeams(adaptedTeams);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred fetching teams"
        );
        setTeams([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchQuery, sortBy, sortDir]
  );

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (sortBy !== "teamStrength") params.set("sortBy", sortBy);
    if (sortDir !== "DESC") params.set("sortDir", sortDir);
    router.replace(`/teams?${params.toString()}`, { scroll: false });
  }, [searchQuery, sortBy, sortDir, router]);

  useEffect(() => {
    fetchTeams(debouncedSearchQuery, sortBy, sortDir);
    updateURL();
  }, [debouncedSearchQuery, sortBy, sortDir, fetchTeams, updateURL]);

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortDir((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(newSortBy);
      setSortDir("DESC");
    }
  };

  const sortOptions = [
    { value: "teamName", label: "Team Name" },
    { value: "teamStrength", label: "Team Strength" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NFL Teams</h1>
          <p className="mt-2 text-gray-600">
            Browse teams and view their details.
          </p>
          {error && (
            <p className="text-red-500 mt-2">Error fetching teams: {error}</p>
          )}
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="team-search" className="sr-only">
              Search Teams
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="team-search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by team name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sort-by" className="sr-only">
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

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading teams...</p>
          </div>
        ) : teams.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {teams.map((team) => (
                <li key={team.id}>
                  <Link
                    href={`/teams/${team.id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                      <div className="flex-1 truncate">
                        <p className="text-lg font-medium text-blue-600 truncate">
                          {team.name}
                        </p>
                        <p className="text-sm text-gray-500">{team.code}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0 text-right">
                        <p className="text-sm text-gray-500">Strength</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {team.strength ?? "N/A"}
                        </p>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <ChevronRight
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-md shadow">
            <p className="text-gray-500">
              No teams found matching your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
