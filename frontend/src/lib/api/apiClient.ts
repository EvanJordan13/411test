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
  getPlayers: (page: number = 1) => fetchAPI<any[]>(`/players?page=${page}`),

  getPlayerById: (playerId: string) => fetchAPI<any>(`/players/${playerId}`),

  getPlayersByPosition: (position: string, page: number = 1) =>
    fetchAPI<any[]>(`/players?position=${position}&page=${page}`),

  comparePlayers: (player1Id: string, player2Id: string) => {
    return Promise.all([
      fetchAPI<any>(`/players/${player1Id}`),
      fetchAPI<any>(`/players/${player2Id}`),
    ]);
  },
};

// Team API methods
export const teamAPI = {
  getTeams: () => fetchAPI<any[]>("/teams"),
};

// User API methods
export const userAPI = {
  getUserProfile: (username: string) => fetchAPI<any>(`/users/${username}`),

  createUser: (username: string) =>
    fetchAPI<any>("/users", {
      method: "POST",
      body: JSON.stringify({ username }),
    }),

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
};

export default {
  player: playerAPI,
  team: teamAPI,
  user: userAPI,
};
