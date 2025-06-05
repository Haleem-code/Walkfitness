import { NextResponse } from "next/server"
import { connectToDb } from "@/backend/utils"
import { Waitlist } from "@/backend/models"

export async function GET() {
  try {
    // Connect to the database
    await connectToDb()

    // Fetch all waitlist users and sort by creation date (newest first)
    const users = await Waitlist.find().sort({ createdAt: -1 })

    return NextResponse.json({ success: true, users }, { status: 200 })
  } catch (error) {
    console.error("Error fetching waitlist users:", error)
    return NextResponse.json({ success: false, message: "Server error, please try again later" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email")

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ success: false, message: "Please provide a valid email address" }, { status: 400 })
    }

    // Connect to the database
    await connectToDb()

    // Check if user already exists
    const existingUser = await Waitlist.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "You're already on our waitlist! We'll notify you when we launch." },
        { status: 409 },
      )
    }

    // Create new waitlist entry
    await Waitlist.create({
      email: email.toLowerCase(),
      source: "landing-page",
    })

    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist! We'll keep you updated." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error in waitlist API:", error)
    return NextResponse.json({ success: false, message: "Server error, please try again later" }, { status: 500 })
  }
}
