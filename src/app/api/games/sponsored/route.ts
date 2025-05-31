import { NextResponse } from "next/server";
import { getGamesByType } from "@/backend/action";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Fetching sponsored games...");
    
    const result = await getGamesByType("sponsored");
    
    if (result.error) {
      console.error("Error from getGamesByType:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    console.log("Sponsored games fetched successfully:", result.games?.length || 0, "games");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching sponsored games:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}