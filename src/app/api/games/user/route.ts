import { getUserGames } from '@/backend/action';

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    
    const result = await getUserGames(email);
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }
    
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/games/user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
