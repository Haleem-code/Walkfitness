import { connectToDb } from '@/backend/utils'
import { Tournament } from '@/backend/models'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * GET handler for fetching a tournament by its unique code
 * 
 * @param req - The incoming request
 * @param params - Contains the dynamic [code] path parameter
 * @returns JSON response with tournament data or error message
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase()
    
    if (!code) {
      return NextResponse.json({ message: 'Tournament code is required' }, { status: 400 })
    }
    
    await connectToDb()
    
    const tournament = await Tournament.findOne({ "tournaments.code": code })
    
    if (!tournament) {
      return NextResponse.json({ message: "Tournament not found" }, { status: 404 })
    }
    
    const tournamentData = tournament.tournaments.find((t: { code: string }) => t.code === code)
    
    if (!tournamentData) {
      return NextResponse.json({ message: "Tournament not found" }, { status: 404 })
    }
    
    // Format the tournament data for response
    const formattedData = {
      ...(tournamentData.toObject ? tournamentData.toObject() : tournamentData),
      code, // Include the code in the response
      walletId: tournamentData.walletId || "",
      participants: Array.isArray(tournamentData.participants)
        ? tournamentData.participants.map((p: unknown) => 
            (typeof p === "string" ? { email: p, tournamentsteps: 0 } : p))
        : [],
    }
    
    console.log("Returning tournament data with walletId:", formattedData.walletId);
    
    // Validate walletId - it should be a valid Solana public key
    if (!formattedData.walletId || formattedData.walletId.trim() === "") {
      console.warn("Tournament has no walletId. This will cause problems with blockchain interactions.");
    }
    
    return NextResponse.json(formattedData, { status: 200 })
  } catch (error) {
    console.error('Error getting tournament:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
