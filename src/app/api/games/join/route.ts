
import { joinGame } from '@/backend/action';

export const dynamic = "force-dynamic";

// POST /api/games/join - Join a game
export async function POST(req: Request): Promise<Response> {
  try {
    const { userId, gameCode } = await req.json();
    
    if (!userId || !gameCode) {
      return new Response(
        JSON.stringify({ error: "User ID and game code are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    const result = await joinGame(userId, gameCode);
    
    if (result.error) {
      const statusCode = result.error === "Game not found" ? 404 : 400;
      return new Response(
        JSON.stringify({ error: result.error }),
        {
          status: statusCode,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/games/join:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}