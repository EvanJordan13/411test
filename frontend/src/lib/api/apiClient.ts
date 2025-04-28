// WE have to use the Next JS server as a proxy to the backend to avoid OCRS errors
const API_BASE_URL = "/api/proxy";

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Resource not found");
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    //DELETE endpoints might not return json
    if (
      response.status === 204 ||
      response.headers.get("Content-Length") === "0"
    ) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Player API methods
export const playerAPI = {
  getPlayers: (
    page: number = 1,
    position?: string,
    name?: string,
    team?: string,
    orderBy?: string,
    orderByDir?: "ASC" | "DESC"
  ) => {
    const params = new URLSearchParams({ page: page.toString() });
    if (position && position !== "all") params.append("position", position);
    if (name) params.append("name", name);
    if (team && team !== "all") params.append("team", team);
    if (orderBy) params.append("orderBy", orderBy);
    if (orderByDir) params.append("orderByDir", orderByDir);
    return fetchAPI<any[]>(`/players?${params.toString()}`);
  },

  getPlayerById: (playerId: string) => fetchAPI<any>(`/players/${playerId}`),

  comparePlayers: (player1Id: string, player2Id: string) => {
    return Promise.all([
      fetchAPI<any>(`/players/${player1Id}`),
      fetchAPI<any>(`/players/${player2Id}`),
    ]);
  },
};

// Team API methods
export const teamAPI = {
  getTeams: (name?: string, orderBy?: string, orderByDir?: "ASC" | "DESC") => {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (orderBy) params.append("orderBy", orderBy);
    if (orderByDir) params.append("orderByDir", orderByDir);
    const queryString = params.toString();
    return fetchAPI<any[]>(`/teams${queryString ? `?${queryString}` : ""}`);
  },

  getTeamById: (teamId: number) => fetchAPI<any>(`/teams/${teamId}`),
};

// User API methods
export const userAPI = {
  getUserProfile: (username: string) => fetchAPI<any>(`/users/${username}`),

  createUser: (username: string) => {
    const params = new URLSearchParams({ username: username });
    return fetchAPI<any>("/users", {
      method: "POST",
      body: params.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  },

  deleteUser: (username: string) =>
    fetchAPI<{ success: boolean }>(`/users/${username}`, {
      method: "DELETE",
    }),

  addFavorite: (username: string, playerId: string) => {
    const path = `/users/${username}/favorites?playerID=${encodeURIComponent(
      playerId
    )}`;
    return fetchAPI<any>(path, {
      method: "POST",
    });
  },

  removeFavorite: (username: string, playerId: string) =>
    fetchAPI<any>(`/users/${username}/favorites/${playerId}`, {
      method: "DELETE",
    }),

  getFavoriteSummary: (username: string, position: string, stat: string) => {
    const params = new URLSearchParams({ position, stat });
    return fetchAPI<any[]>(
      `/users/${username}/favorites/summary?${params.toString()}`
    );
  },
};

export default {
  player: playerAPI,
  team: teamAPI,
  user: userAPI,
};
