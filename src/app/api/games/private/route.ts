import { joinGame } from '@/backend/action';

export const dynamic = "force-dynamic";

// POST /api/games/private - Join private game by code
export async function POST(req) {
  try {
    const { email, gameCode } = await req.json();
    
    if (!email || !gameCode) {
      return Response.json({ error: "Email and game code are required" }, { status: 400 });
    }
    
    const result = await joinGame(email, gameCode);
    
    if (result.error) {
      const statusCode = result.error === "Game not found" ? 404 : 400;
      return Response.json({ error: result.error }, { status: statusCode });
    }
    
    return Response.json(result);
  } catch (error) {
    console.error("Error in POST /api/games/private:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
