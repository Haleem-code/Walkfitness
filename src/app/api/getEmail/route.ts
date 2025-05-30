import { NextResponse } from "next/server"
import { auth } from "@/backend/auth"

export const dynamic = "force-dynamic"; // Mark the route as dynamic

export async function GET() {
  try {
    const session = await auth()
    console.log("Session:", session)
    const email = session?.userId || session?.user?.email
    console.log("User ID:", email)
    if (!email) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      )
    }

    return NextResponse.json({ email }, { status: 200 })
  } catch (error) {
    console.error("Error getting email:", error)
    return NextResponse.json(
      { error: "Failed to get user email" },
      { status: 500 }
    )
  }
}