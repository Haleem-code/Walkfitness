    import { type NextRequest, NextResponse } from "next/server"
    import mongoose from "mongoose"
    import { Game } from"@/backend/models"

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

    // POST - Join a game
    export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const body = await request.json()
        const { gameId, userEmail, username, code } = body

        if (!userEmail || !username) {
        return NextResponse.json({ success: false, error: "User email and username are required" }, { status: 400 })
        }

        const query: any = { status: "active" }

        if (gameId) {
        query._id = gameId
        } else if (code) {
        query.code = code.toUpperCase()
        } else {
        return NextResponse.json({ success: false, error: "Game ID or code is required" }, { status: 400 })
        }

        const game = await Game.findOne(query);

        if (!game) {
        return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    
        }

        // Check if user is already a participant
        const isAlreadyParticipant = game.participants.some(participant => participant.email === userEmail);

        if (isAlreadyParticipant) {
        return NextResponse.json({ success: false, error: "You are already a participant in this game" }, { status: 400 });
        }

        // Check if game is full
        if (game.participants.length >= game.maxPlayers) {
        return NextResponse.json({ success: false, error: "Game is full" }, { status: 400 });
        }

        // Add user to participants
        game.participants.push({
        email: userEmail,
        username,
        joinedAt: new Date(),
        });

        await game.save();

        return NextResponse.json({
        success: true,
        game,
        message: "Successfully joined the game",
        });
    } catch (error) {
        console.error("Error joining game:", error)
        return NextResponse.json({ success: false, error: "Failed to join game" }, { status: 500 })
    }
    }
