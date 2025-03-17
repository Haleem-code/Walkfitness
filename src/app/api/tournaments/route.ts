import { connectToDb } from '@/backend/utils'
import { Tournament } from '@/backend/models'
import { auth } from '@/backend/auth'
import { nanoid } from 'nanoid'
import type { NextRequest, NextResponse } from "next/server"

interface CreateTournamentBody {
  name: string
  tournamentsteps: number
  duration: number
  amount: number
  code?: string
  walletId?: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    await connectToDb()
    const body = (await req.json()) as CreateTournamentBody
    const { name, tournamentsteps, duration, amount, code, walletId } = body


    console.log("THE CODE IS", code)

    // Validate the required fields
    if (!name?.trim()) {
      return new Response(JSON.stringify({ message: "Tournament name is required" }), { status: 400 })
    }

    // Generate a unique code using nanoid if not provided
    const newCode = code || nanoid(8).toUpperCase()

    // Create new tournament entry
    const newTournamentData = {
      _id: new Date().getTime().toString(),
      createdBy: session.user.email,
      code: newCode,
      amount: Number(amount),
      duration: Number(duration),
      tournamentsteps: Number(tournamentsteps),
      name: name.trim(),
      participants: [session.user.email],
      createdAt: new Date(),
      walletId: walletId || ""
    }

    // Find existing user document or create new one
    const existingUser = await Tournament.findOne({ email: session.user.email })

    if (existingUser) {
      // Add new tournament to existing user
      existingUser.tournaments.push(newTournamentData)
      await existingUser.save()

      return new Response(
        JSON.stringify({
          message: "Tournament created successfully",
          tournament: newTournamentData
        }),
        { status: 201 }
      )
    }
    // Create new user with tournament
    const tournament = new Tournament({
      email: session.user.email,
      tournaments: [newTournamentData]
    })

    await tournament.save()

    return new Response(
      JSON.stringify({
        message: "Tournament created successfully",
        tournament: newTournamentData
      }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating tournament:", error)
    return new Response(
      JSON.stringify({ message: "Error creating tournament", error: error.message }),
      { status: 500 }
    )
  }
}
