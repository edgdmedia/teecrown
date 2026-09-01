import { NextRequest, NextResponse } from "next/server"

const CMS_URL = process.env.PAYLOAD_URL || "https://dash.teecrownconsult.org"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { name, email, phone, service, message, referral } = body as {
      name?: string
      email?: string
      phone?: string
      service?: string
      message?: string
      referral?: string
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Name, email and message are required" },
        { status: 400 },
      )
    }

    const res = await fetch(`${CMS_URL}/api/contact-submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, service, message, referral }),
    })

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
