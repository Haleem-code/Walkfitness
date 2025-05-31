"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Game {
  id: string
  name: string
  days: number
  steps: number
  players: number
  maxPlayers: number
  entryFee: number
  type: "public" | "private" | "sponsored"
  reward?: string
  isActive: boolean
  banner: string
}

interface GamesListProps {
  games: Game[]
  type: "public" | "sponsored"
}

export default function GamesList({ games, type }: GamesListProps) {
  const router = useRouter()

  const handleJoinGame = async (gameId: string) => {
    try {
      const response = await fetch(`/api/games/join`, {
        method: "POST",
        body: JSON.stringify({ gameId }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && !data.error) {
        // Redirect to the correct game page based on type
        router.push(`/game/id/${gameId}`)
      } else {
        alert(data.error || "Failed to join game")
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    }
  }

  if (games.length === 0) {
    return (
      <Card className="bg-gray-800/50 border-gray-600">
        <CardContent className="p-6 text-center text-gray-400">No {type} games available</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider px-4">
        <div className="col-span-4">Game Name</div>
        <div className="col-span-2">Days</div>
        <div className="col-span-2">Steps</div>
        <div className="col-span-2">Players</div>
        <div className="col-span-1">Entry</div>
        <div className="col-span-1"></div>
      </div>

      {/* Games */}
      {games.map((game) => (
        <Card key={game.id} className="bg-gray-800/70 border-gray-600 hover:bg-gray-800/90 transition-colors">
          <CardContent className="p-4">
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Game Name with Icon */}
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">
                  {game.banner ? (
                    <img 
                      src={game.banner} 
                      alt={game.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <span>{game.name.charAt(0)}</span>
                  )}
                </div>
                <div className="text-sm font-medium truncate">{game.name}</div>
              </div>

              {/* Days */}
              <div className="col-span-2 text-sm">
                <div>{game.days} Days</div>
                <div className="text-xs text-gray-400">2025</div>
              </div>

              {/* Steps */}
              <div className="col-span-2 text-sm">
                <div>{game.steps.toLocaleString()}</div>
              </div>

              {/* Players */}
              <div className="col-span-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {[...Array(Math.min(3, game.players))].map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-400 rounded-full border border-gray-800"
                      />
                    ))}
                  </div>
                  <span className="text-xs">{game.players}/{game.maxPlayers}</span>
                </div>
              </div>

              {/* Entry Fee */}
              <div className="col-span-1">
                {type === "sponsored" ? (
                  <Badge className="bg-blue-600 text-white text-xs px-2 py-1">FREE</Badge>
                ) : (
                  <Badge className="bg-purple-600 text-white text-xs px-2 py-1">${game.entryFee}</Badge>
                )}
              </div>

              {/* Join Button */}
              <div className="col-span-1">
                <Button
                  size="sm"
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.players >= game.maxPlayers}
                  className="bg-green-400 hover:bg-green-500 text-black font-semibold px-3 py-1 text-xs rounded-lg disabled:opacity-50"
                >
                  {game.players >= game.maxPlayers ? 'Full' : 'Join'}
                </Button>
              </div>
            </div>

            {/* Reward for sponsored games */}
            {type === "sponsored" && game.reward && (
              <div className="mt-2 pl-10">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                  🎁 {game.reward}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
