import { NextRequest, NextResponse } from "next/server"

const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Forward to Payload CMS if configured
  if (PAYLOAD_URL) {
    try {
      await fetch(`${PAYLOAD_URL}/api/contact-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
    } catch (err) {
      console.error("Failed to save contact submission to Payload:", err)
    }
  }

  return NextResponse.json({ ok: true })
}
