// app/api/games/join/route.js
import { NextResponse } from "next/server";
import { auth } from "@/backend/auth";
import { joinGame, joinGameById } from "@/backend/action";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    console.log("Session:", session);
    const email = session?.user?.email;
    console.log("User email:", email);
    
    if (!email) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      );
    }

    const { gameCode, gameId } = await req.json();
    
    if (!gameCode && !gameId) {
      return NextResponse.json(
        { error: "Game code or game ID is required" },
        { status: 400 }
      );
    }

    let result;
    
    if (gameCode) {
      // Join private game with code
      result = await joinGame(email, gameCode);
    } else {
      // Join public/sponsored game with ID
      result = await joinGameById(email, gameId);
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/games/join:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}