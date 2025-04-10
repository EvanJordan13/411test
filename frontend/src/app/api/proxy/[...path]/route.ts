// File: src/lib/api/proxy/[...path]/route.ts
import type { NextRequest } from "next/server";

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return new Response("Internal Server Error: Backend URL not configured.", {
      status: 500,
    });
  }

  // Reconstruct the backend path from the captured segments
  const apiPath = params.path.join("/");

  // Get the query string from the original request URL
  const queryString = req.nextUrl.search; // Includes '?' if query params exist

  // Construct the full target URL for the backend
  const targetUrl = `${backendUrl}/${apiPath}${queryString}`;

  try {
    // Make the request to the backend, forwarding method, headers, and body
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers, // Forward incoming headers
      body: req.body, // Stream request body
      // Required for POST/PUT/PATCH requests with bodies in newer Node/Next.js fetch
      duplex: "half",
      // Prevent caching of API responses by Next.js fetch
      cache: "no-store",
    } as any);

    // Return the response from the backend directly to the client
    return backendResponse;
  } catch (error) {
    // Provide a generic error message to the client
    return new Response(
      "Proxy error: Could not connect to the backend service.",
      {
        status: 502, // Bad Gateway status
      }
    );
  }
}

// Export the single handler for all common HTTP methods
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS,
};
