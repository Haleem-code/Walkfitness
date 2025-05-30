import { NextResponse } from "next/server"
import { getUserGames } from '@/backend/action';
import { auth } from "@/backend/auth"
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth()
      console.log("Session:", session)
      const email =  session?.user?.email
      console.log("User ID:", email)
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const result = await getUserGames(email);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/games/user:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
