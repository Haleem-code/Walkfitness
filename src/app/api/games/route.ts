import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { Game } from "@/backend/models"
import { nanoid } from "nanoid"

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// GET - Fetch games
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const code = searchParams.get("code")

    const query: any = { status: "active" }

    if (type && type !== "all") {
      query.type = type
    }

    if (code) {
      query.code = code.toUpperCase()
    }

    const game = await Game.findOne

    return NextResponse.json({
      success: true,
      game,
    })
  } catch (error) {
    console.error("Error fetching games:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch games" }, { status: 500 })
  }
}

// POST - Create new game
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { name, description, image, type, days, steps, maxPlayers, entryFee, reward, createdBy, createdByEmail } =
      body

    // Validation
    if (
      !name ||
      !description ||
      !type ||
      !days ||
      !steps ||
      !maxPlayers ||
      entryFee === undefined ||
      !createdBy ||
      !createdByEmail
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    if (!["public", "private", "sponsored"].includes(type)) {
      return NextResponse.json({ success: false, error: "Invalid game type" }, { status: 400 })
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)

    // Create game object
    const gameData: any = {
      _id: nanoid(10),
      name: name.trim(),
      description: description.trim(),
      image: image || "",
      type,
      days: Number.parseInt(days),
      steps: Number.parseInt(steps),
      maxPlayers: Number.parseInt(maxPlayers),
      entryFee: Number.parseFloat(entryFee),
      reward: reward ? Number.parseFloat(reward) : 0,
      createdBy,
      createdByEmail,
      startDate,
      endDate,
      participants: [
        {
          email: createdByEmail,
          username: createdBy,
          joinedAt: new Date(),
        },
      ],
    }

    // Generate code for private games
    if (type === "private") {
      gameData.code = nanoid(8).toUpperCase()
    }

    const game = new Game(gameData)
    await game.save()

    return NextResponse.json({
      success: true,
      game,
      message: "Game created successfully",
    })
  } catch (error: any) {
    console.error("Error creating game:", error)

    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Game code already exists" }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to create game" }, { status: 500 })
  }
}
