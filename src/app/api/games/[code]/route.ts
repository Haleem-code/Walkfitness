import { type NextRequest, NextResponse } from "next/server"
import { connectToDb } from "@/backend/utils"
import { Game } from "@/backend/models"

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const code = params.code

    // Connect to database
    await connectToDb()

    // Find game by code
    const game = await Game.findOne({ code }).exec()

    if (!game) {
      return NextResponse.json({ message: "Game not found" }, { status: 404 })
    }

    return NextResponse.json(game)
  } catch (error: any) {
    console.error("Error fetching game:", error)
    return NextResponse.json({ message: error.message || "Failed to fetch game" }, { status: 500 })
  }
}
