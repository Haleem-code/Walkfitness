import { getGames } from '@/backend/action';

export const dynamic = "force-dynamic";

// GET /api/games - Get all active games
export async function GET() {
  try {
    const result = await getGames();
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }
    
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/games:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

