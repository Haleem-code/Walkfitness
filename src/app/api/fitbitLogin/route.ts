// app/api/auth/fitbitLogin/route.ts

import { FITBIT_ID, FITBIT_SECRET, NEXTAUTH_URI } from "@/backend/config"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get Fitbit authentication credentials from environment variables
    const client_id = FITBIT_ID
    const client_secret = FITBIT_SECRET

    if (!client_id || !client_secret) {
      return NextResponse.json({ error: "Missing Fitbit API credentials" }, { status: 500 })
    }

    const redirect_uri = `${NEXTAUTH_URI}/api/auth/callback/fitbit`


    console.log("NEXTAUTH_URI:", NEXTAUTH_URI);
    console.log("Redirect URI:", redirect_uri);
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
