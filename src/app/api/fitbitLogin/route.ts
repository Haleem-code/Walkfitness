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

    // Redirect URI - this should match what's configured in your Fitbit Developer Dashboard
    // Make sure this is EXACTLY the same as registered in Fitbit Developer Console
    const redirect_uri = `${process.env.NEXTAUTH_URL}/api/auth/callback/fitbit`

    // Log for debugging
    console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
    console.log("Redirect URI:", redirect_uri);

    // Scope of data you want to access
    const scope = "activity profile"

    // Generate authorization URL
    const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&expires_in=604800`

    // Return the authorization URL to the client
    return NextResponse.json({ url: authUrl })
  } catch (error) {
    console.error("Error generating login URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
