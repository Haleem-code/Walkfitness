import { NextResponse } from "next/server"
import { auth } from "@/backend/auth"

export const dynamic = "force-dynamic"; // Mark the route as dynamic

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ email: session.user.email }, { status: 200 })
  } catch (error) {
    console.error("Error getting email:", error)
    return NextResponse.json(
      { error: "Failed to get user email" },
      { status: 500 }
    )
  }
}