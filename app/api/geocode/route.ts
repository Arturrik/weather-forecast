import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    name: name.trim(),
    count: "10",
    format: "json",
  });

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Geocoding failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Geocoding unavailable" }, { status: 502 });
  }
}
