import { NextResponse } from "next/server";
import { auth } from "@/backend/auth";
import { getGameByCode } from "@/backend/action";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { code: string } }) {
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

    const { code } = params;
    
    // Get game by code using your existing function
    const gameResult = await getGameByCode(code);
    
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
      participants: game.participants // Just return the basic participant list for now
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}