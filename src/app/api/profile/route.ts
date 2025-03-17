import { NextResponse } from "next/server"
import { auth } from "@/backend/auth"
import { User } from "@/backend/models"
import { connectToDb } from "@/backend/utils"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const session = await auth()
  const email = session?.user?.email

  if (!session || !email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const queryEmail = searchParams.get("email")

  if (queryEmail !== email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    await connectToDb()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      twitterUsername: user.twitterUsername || "",
      telegramId: user.telegramId || "",
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (email !== session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    await connectToDb()

    const result = await User.deleteOne({ email })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Profile deleted successfully" })
  } catch (error) {
    console.error("Error deleting user profile:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

