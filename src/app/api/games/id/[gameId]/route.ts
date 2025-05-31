import { NextResponse } from "next/server";
import { auth } from "@/backend/auth";
import { getGameById } from "@/backend/action";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { gameId: string } }) {
  try {
    const session = await auth();
    console.log("Session:", session);
    const email = session?.user?.email;
    
    if (!email) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    const { gameId } = params;
    
    // Get game by ID using your existing function
    const gameResult = await getGameById(gameId);
    
    if (gameResult.error) {
      return NextResponse.json(
        { error: gameResult.error },
        { status: 404 }
      );
    }

    const game = gameResult.game;
    
    // Check if user is a participant
    if (!game.participants.includes(email)) {
      return NextResponse.json(
        { error: "You are not a participant in this game" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ 
      game,
      participants: game.participants
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}