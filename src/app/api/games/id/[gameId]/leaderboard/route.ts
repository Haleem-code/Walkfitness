import { connectToDb } from "@/backend/utils"
import { Game, Steps, User } from "@/backend/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { gameId: string } }) {
  const { gameId } = params

  if (!gameId) {
    console.error("API Error: Game ID is required")
    return NextResponse.json({ error: "Game ID is required" }, { status: 400 })
  }

  console.log(`Leaderboard API called with gameId: ${gameId}`)

  try {
    await connectToDb()

    // Try to find the game by ID, code, or other identifiers
    let game = null

    // First try to find by MongoDB ObjectId (if it looks like one)
    if (gameId.match(/^[0-9a-fA-F]{24}$/)) {
      game = await Game.findById(gameId)
    }

    // If not found, try by code
    if (!game) {
      game = await Game.findOne({ code: gameId })
    }

    // If still not found, try as a string ID
    if (!game) {
      game = await Game.findOne({ _id: gameId })
    }

    if (!game) {
      console.error(`Game not found with ID/code: ${gameId}`)
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    console.log(`Found game: ${game.name} with ${game.participants?.length || 0} participants`)

    // Get all participants
    const participants = game.participants || []

    if (participants.length === 0) {
      return NextResponse.json({
        success: true,
        leaderboard: [],
      })
    }

    // Get steps data for all participants
    const stepsData = await Steps.find({
      email: { $in: participants },
    })

    console.log(`Found steps data for ${stepsData.length} participants`)

    // Get user data for all participants
    const userData = await User.find({
      email: { $in: participants },
    }).select("username email img")

    console.log(`Found user data for ${userData.length} participants`)

    // Combine data and create leaderboard
    const leaderboard = participants.map((email) => {
      const steps = stepsData.find((s) => s.email === email)
      const user = userData.find((u) => u.email === email)

      return {
        email,
        name: user?.username || email.split("@")[0],
        img: user?.img || null,
        steps: steps?.stepsForLastUpdate || 0,
      }
    })

    // Sort by steps in descending order
    leaderboard.sort((a, b) => b.steps - a.steps)

    // Add rank property
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1
    })

    console.log(`Returning leaderboard with ${leaderboard.length} entries`)

    return NextResponse.json({
      success: true,
      leaderboard,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
