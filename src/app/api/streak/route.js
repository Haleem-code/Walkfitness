import { NextResponse } from "next/server"
import { auth } from "@/backend/auth"
import { checkAndUpdateStreak, getUserStreak } from "@/backend/action"

export const dynamic = "force-dynamic"

export async function GET(req) {
  try {
    const session = await auth()
    console.log("Session:", session)
    const email = session?.user?.email || session?.userId

    if (!email) {
      return NextResponse.json({ error: "No authenticated user found" }, { status: 401 })
    }

    // Get user streak data using your existing function
    const streakData = await getUserStreak(email)

    return NextResponse.json(streakData, { status: 200 })
  } catch (error) {
    console.error("Error fetching streak data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const session = await auth()
    console.log("Session:", session)
    const email = session?.user?.email || session?.userId

    if (!email) {
      return NextResponse.json({ error: "No authenticated user found" }, { status: 401 })
    }

    // Check and update streak using your existing function
    const streakResult = await checkAndUpdateStreak(email)

    return NextResponse.json(streakResult, { status: 200 })
  } catch (error) {
    console.error("Error updating streak:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
