import { connectToDb } from "@/backend/utils"
import { Game, User } from "@/backend/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { gameId: string } }) {
  const { gameId } = params

  if (!gameId) {
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
  }

  try {
    await connectToDb()

    // Find the game by ID or code
    const game = await Game.findOne({
      $or: [{ _id: gameId }, { code: gameId }],
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // Get all participants
    const participants = game.participants || []

    if (participants.length === 0) {
      return NextResponse.json({
        success: true,
        participants: [],
      })
    }

    // Get user data for all participants
    const userData = await User.find({
      email: { $in: participants },
    }).select("username email img")

    return NextResponse.json({
      success: true,
      participants: userData.map((user) => ({
        email: user.email,
        username: user.username,
        img: user.img,
      })),
    })
  } catch (error) {
    console.error("Error fetching participants:", error)
    return NextResponse.json({ error: "Failed to fetch participants" }, { status: 500 })
  }
}
