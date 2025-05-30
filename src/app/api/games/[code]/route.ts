import { getGameByCode } from '@/backend/action';

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    const { code } = params;
    
    const result = await getGameByCode(code);
    
    if (result.error) {
      const statusCode = result.error === "Game not found" ? 404 : 500;
      return Response.json({ error: result.error }, { status: statusCode });
    }
    
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/games/[code]:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}