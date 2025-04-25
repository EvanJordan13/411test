import type { NextRequest } from "next/server";

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return new Response("url not configured", {
      status: 500,
    });
  }

  const apiPath = params.path.join("/");

  const queryString = req.nextUrl.search;

  const targetUrl = `${backendUrl}/${apiPath}${queryString}`;

  try {
    const backendResponse = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      duplex: "half",
      cache: "no-store",
    } as any);

    return backendResponse;
  } catch (error) {
    return new Response("couldnt connect", {
      status: 502,
    });
  }
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as DELETE,
  handler as PATCH,
  handler as OPTIONS,
};
