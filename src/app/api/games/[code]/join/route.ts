import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { connectToDb } from "@/backend/utils"
import { Game } from "@/backend/models"

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    // Check if user is authenticated by fetching their email
    const emailRes = await fetch("/api/getemail", {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    })

    if (!emailRes.ok) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email: userEmail } = await emailRes.json()

    if (!userEmail) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const code = params.code

    // Connect to database
    await connectToDb()

    // Find game by code
    const game = await Game.findOne({ code })

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 })
    }

    // Check if game is still active
    if (new Date() > game.endDate) {
      return NextResponse.json({ message: "This game has ended" }, { status: 400 })
    }

    // Check if user is already a participant
    if (game.participants.includes(userEmail)) {
      return NextResponse.json({ message: "You are already a participant in this game" }, { status: 400 })
    }

    // Add user to participants
    game.participants.push(userEmail)
    await game.save()

    return NextResponse.json({ message: "Successfully joined the game" })
  } catch (error: any) {
    console.error("Error joining game:", error)
    return NextResponse.json({ message: error.message || "Failed to join game" }, { status: 500 })
  }
}
