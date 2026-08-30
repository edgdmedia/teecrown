import { NextRequest, NextResponse } from "next/server"

const CMS_URL = process.env.PAYLOAD_URL || "https://dash.teecrownconsult.org"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, email, message } = body as {
      name?: string
      email?: string
      message?: string
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required" },
        { status: 400 },
      )
    }

    const url = new URL(`${CMS_URL}/my-route`)
    url.searchParams.set("name", name)
    url.searchParams.set("email", email)
    url.searchParams.set("message", message)

    const res = await fetch(url, { method: "GET" })

    if (!res.ok) {
      const text = await res.text()
      console.error("CMS contact submission failed:", res.status, text)
      return NextResponse.json(
        { ok: false, error: text || "Submission failed" },
        { status: 502 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Contact API error:", err)
    return NextResponse.json(
      { ok: false, error: "Internal error" },
      { status: 500 },
    )
  }
}
