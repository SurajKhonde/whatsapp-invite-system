// app/api/health/route.ts
// OfflineBanner pings this endpoint every 30s when offline
// Also useful for uptime monitoring (UptimeRobot, BetterStack etc)

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Optionally ping your Express backend here too
    // const res = await fetch(`${process.env.BACKEND_URL}/health`, { cache: "no-store" });
    // if (!res.ok) return NextResponse.json({ status: "backend-down" }, { status: 503 });

    return NextResponse.json(
      { status: "ok", time: new Date().toISOString() },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "error" },
      { status: 503 }
    );
  }
}