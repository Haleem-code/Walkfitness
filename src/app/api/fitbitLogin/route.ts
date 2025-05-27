// app/api/auth/fitbitLogin/route.ts

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get Fitbit authentication credentials from environment variables
    const client_id = process.env.FITBIT_ID
    const client_secret = process.env.FITBIT_SECRET

    if (!client_id || !client_secret) {
      return NextResponse.json({ error: "Missing Fitbit API credentials" }, { status: 500 })
    }

    const redirect_uri = `http://localhost:3000/api/auth/callback/fitbit`


    const scope = "activity profile"

    
    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&expires_in=604800`


    return NextResponse.json({ url: authUrl })
  } catch (error) {
    console.error("Error generating login URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
