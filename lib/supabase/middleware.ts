import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // For now, just pass through all requests
  // We can add proper auth checking later once the basic setup works
  return NextResponse.next()
}
