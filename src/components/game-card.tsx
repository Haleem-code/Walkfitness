"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface GameCardProps {
  game: {
    _id: string
    name: string
    description: string
    image?: string
    type: "public" | "private" | "sponsored"
    days: number
    steps: number
    maxPlayers: number
    entryFee: number
    reward?: number
    participants: any[]
    createdBy: string
  }
  userEmail: string
  username: string
  onJoinGame: (game: any) => void
}

export default function GameCard({ game, userEmail, username, onJoinGame }: GameCardProps) {
  const isParticipant = game.participants.some((p) => p.email === userEmail)
  const isFull = game.participants.length >= game.maxPlayers

  const handleJoin = async () => {
    if (isParticipant) {
      toast({
        title: "Already Joined",
        description: "You are already a participant in this game",
      })
      return
    }

    if (isFull) {
      toast({
        title: "Game Full",
        description: "This game has reached its maximum number of players",
    
      })
      return
    }

    try {
      const response = await fetch("/api/games/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: game._id,
          userEmail,
          username,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Joined Game!",
          description: `You have successfully joined ${game.name}`,
        })
        onJoinGame(data.game)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to join game",
        
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join game",
       
      })
    }
  }

  const getTypeColor = () => {
    switch (game.type) {
      case "public":
        return "bg-green-500"
      case "private":
        return "bg-purple-500"
      case "sponsored":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = () => {
    switch (game.type) {
      case "public":
        return "🌍"
      case "private":
        return "🔒"
      case "sponsored":
        return "💎"
      default:
        return "🎮"
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">
            {game.image ? (
              <Image
                src={game.image || "/placeholder.svg"}
                alt={game.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              getTypeIcon()
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{game.name}</h3>
            <p className="text-xs text-gray-400">{game.createdBy}</p>
          </div>
        </div>
        <Badge className={`${getTypeColor()} text-white text-xs`}>{game.type.toUpperCase()}</Badge>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
        <div className="text-center">
          <div className="text-gray-400">DAYS</div>
          <div className="text-white font-medium">{game.days}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">STEPS</div>
          <div className="text-white font-medium">{game.steps.toLocaleString()}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">PLAYERS</div>
          <div className="text-white font-medium">
            {game.participants.length}/{game.maxPlayers}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">ENTRY</div>
          <div className="text-white font-medium">{game.entryFee === 0 ? "FREE" : `$${game.entryFee}`}</div>
        </div>
      </div>

      {game.type === "sponsored" && game.reward && (
        <div className="flex items-center justify-center mb-3 p-2 bg-blue-500/20 rounded-lg">
          <Gift className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-blue-400 text-sm font-medium">Reward: ${game.reward}</span>
        </div>
      )}

      <Button
        onClick={handleJoin}
        disabled={isParticipant || isFull}
        className={`w-full text-sm font-medium ${
          isParticipant
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : isFull
              ? "bg-red-500 hover:bg-red-600 text-white cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {isParticipant ? "Joined" : isFull ? "Full" : "Join"}
      </Button>
    </div>
  )
}
