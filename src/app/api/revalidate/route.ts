import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const { tag } = await req.json()
  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400 })
  }

  revalidateTag(tag, 'max')
  return NextResponse.json({ revalidated: true, tag, now: Date.now() })
}
