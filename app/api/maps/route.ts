import { NextResponse } from "next/server"

export async function GET() {
  // Only use the server-side environment variable
  const apiKey = process.env.AIzaSyDSWcmCab4FnRYdf7eMaQbwgCSRcVDZPv4

  if (!apiKey) {
    return NextResponse.json({ error: "Maps API key not configured" }, { status: 500 })
  }

  return NextResponse.json({ apiKey })
}
