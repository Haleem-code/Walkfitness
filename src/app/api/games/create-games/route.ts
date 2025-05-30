import {createGame } from '@/backend/action';

export const dynamic = "force-dynamic";


export async function POST(req) {
  try {
    const gameData = await req.json();
    const result = await createGame(gameData);
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/games:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}