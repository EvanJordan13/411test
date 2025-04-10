import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true" || true;

export async function GET() {
  try {
    // fetch something simple from the backend to check connectivity
    const response = await fetch(`${BACKEND_URL}/teams`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const usingMockData = !response.ok || USE_MOCK_DATA;

    return NextResponse.json({
      connected: response.ok,
      usingMockData,
      status: response.ok ? "connected" : "disconnected",
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      usingMockData: true,
      status: "disconnected",
    });
  }
}
