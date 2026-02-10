import { NextResponse } from "next/server";

const PEXELS_BASE_URL = "https://api.pexels.com/v1";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const style = url.searchParams.get("style");

    if (!style) {
      return NextResponse.json(
        { error: "Missing required 'style' query parameter" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "PEXELS_API_KEY is not set" },
        { status: 500 }
      );
    }

    const query = encodeURIComponent(`${style} tattoo`);
    const perPage = 1;

    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=${query}&per_page=${perPage}`,
      {
        headers: {
          Authorization: apiKey,
        },
        // Pexels recommends GET for search; keep it simple.
        method: "GET",
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Pexels API error", response.status, text);
      return NextResponse.json(
        { error: "Failed to fetch image from Pexels", details: text },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.photos) || data.photos.length === 0) {
      return NextResponse.json(
        { error: "No photos found for this style" },
        { status: 404 },
      );
    }

    const photo = data.photos[0];

    return NextResponse.json({
      id: photo.id,
      imageUrl: photo.src?.medium || photo.src?.small || photo.src?.original,
      alt: photo.alt,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      pexelsUrl: photo.url,
    });
  } catch (error) {
    console.error("/api/pexels/photo error", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 },
    );
  }
}
