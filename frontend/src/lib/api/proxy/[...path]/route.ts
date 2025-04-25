import { NextRequest, NextResponse } from "next/server";
import { allPlayers, teams, users } from "@/lib/data/mockData";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true" || true; //fallback to mock data for demo purpposes

//get mock data based on the endpoint
const getMockData = (path: string, queryParams: URLSearchParams) => {
  if (path === "players") {
    const page = parseInt(queryParams.get("page") || "1", 10);
    const position = queryParams.get("position");
    const pageSize = 10;

    let filteredPlayers = [...allPlayers];
    if (position && position !== "all") {
      filteredPlayers = filteredPlayers.filter(
        (player) => player.position === position
      );
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredPlayers.slice(startIndex, endIndex);
  }

  // player endpoint
  if (path.startsWith("players/")) {
    const playerId = parseInt(path.split("/")[1], 10);
    return allPlayers.find((player) => player.id === playerId) || null;
  }

  // Teams endpoint
  if (path === "teams") {
    return teams;
  }

  // User endpoint
  if (path.startsWith("users/")) {
    const username = path.split("/")[1];
    const user = users.find((u) => u.username === username);

    if (user) {
      const favorites = user.favorites
        .map((id) => allPlayers.find((player) => player.id === id))
        .filter(Boolean);

      return { ...user, favorites };
    }

    return null;
  }

  return null;
};

//handles all API requests as a proxy to the backend
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const queryString = request.nextUrl.search || "";
  const url = `${BACKEND_URL}/${path}${queryString}`;

  try {
    //fetch from the backend first
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    // if fetch fails and mock data is enabled, return mock data
    if (USE_MOCK_DATA) {
      const queryParams = new URLSearchParams(queryString);
      const mockData = getMockData(path, queryParams);

      if (mockData) {
        console.log(`Using mock data for ${path}`);
        return NextResponse.json(mockData);
      }
    }

    // should never get here but just in case :skull:
    return NextResponse.json(
      { error: `Resource not found: ${path}` },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);

    if (USE_MOCK_DATA) {
      const queryParams = new URLSearchParams(queryString);
      const mockData = getMockData(path, queryParams);

      if (mockData) {
        console.log(`Using mock data for ${path} due to backend error`);
        return NextResponse.json(mockData);
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch data from backend" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  try {
    const body = await request.json();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    }

    if (USE_MOCK_DATA) {
      if (path === "users") {
        const username = body.username;
        return NextResponse.json({ username, success: true });
      }

      if (path.includes("favorites")) {
        const username = path.split("/")[1];
        const playerID = body.playerID;
        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Backend operation failed" },
      { status: response.status }
    );
  } catch (error) {
    console.error(`Error posting to ${url}:`, error);

    if (USE_MOCK_DATA) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to post data to backend" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      if (response.status === 204) {
        return new NextResponse(null, { status: 204 });
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    if (USE_MOCK_DATA) {
      if (path.includes("favorites")) {
        return NextResponse.json({ success: true });
      }

      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(
      { error: "Backend operation failed" },
      { status: response.status }
    );
  } catch (error) {
    console.error(`Error deleting at ${url}:`, error);

    if (USE_MOCK_DATA) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to delete data from backend" },
      { status: 500 }
    );
  }
}
