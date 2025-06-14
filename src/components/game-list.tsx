"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
      const response = await fetch("/api/games/join", {
        method: "POST",
        body: JSON.stringify({ gameId }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && !data.error) {
        router.push(`/game/id/${gameId}`)
      } else {
        alert(data.error || "Failed to join game")
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    }
  }

  // Helper function to safely get image source
  const getImageSrc = (banner: string) => {
    // Always return default image for now to prevent errors
    return "/images/sneaker.svg"
  }

  // Helper function to check if we should show an image
  const shouldShowImage = (banner: string) => {
    // Only show image if it's a known safe path
    const safePaths = [
      "/images/sneaker.svg",
      "/images/blue-sneak.png", 
      "/images/footer-sneak.png"
    ]
    return banner && safePaths.some(path => banner.includes(path.split('/').pop() || ''))
  }

  if (games.length === 0) {
    return (
      <Card className="bg-[#D9D9D91A] border-gray-700/50">
        <CardContent className="p-6 text-center text-gray-400">No {type} games available</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 gap-2 text-xs text-gray-400 font-semibold uppercase tracking-wider px-4">
        <div className="col-span-4">Game Name</div>
        <div className="col-span-2">Days</div>
        <div className="col-span-2">Steps</div>
        <div className="col-span-2">Players</div>
        <div className="col-span-1">Entry</div>
        <div className="col-span-1"/>
      </div>

      {/* Games */}
      {games.map((game) => (
        <Card
          key={game.id}
          className="bg-[#D9D9D91A] border-gray-700/50 hover:bg-[#D9D9D925] transition-all duration-300 hover:border-green-400/30"
        >
          <CardContent className="p-4">
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-12 gap-2 items-center">
              {/* Game Name with Icon */}
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-green-400 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                  {shouldShowImage(game.banner) ? (
                    <Image
                      src={getImageSrc(game.banner)}
                      alt={game.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg object-cover"
                      priority={false}
                      unoptimized={true}
                    />
                  ) : (
                    <span className="text-white">{game.name.charAt(0)}</span>
                  )}
                </div>
                <div className="text-sm font-medium truncate text-white">{game.name}</div>
              </div>

              {/* Days */}
              <div className="col-span-2 text-sm">
                <div className="text-white">{game.days} Days</div>
                <div className="text-xs text-gray-400">2025</div>
              </div>

              {/* Steps */}
              <div className="col-span-2 text-sm">
                <div className="text-white">{game.steps.toLocaleString()}</div>
              </div>

              {/* Players */}
              <div className="col-span-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    {[...Array(Math.min(3, game.players))].map((_, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 bg-gradient-to-br from-green-400 to-purple-400 rounded-full border border-gray-800"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white">
                    {game.players}/{game.maxPlayers}
                  </span>
                </div>
              </div>

              {/* Entry Fee */}
              <div className="col-span-1">
                {type === "sponsored" ? (
                  <Badge className="bg-green-400 text-black text-xs px-2 py-1 font-semibold">FREE</Badge>
                ) : (
                  <Badge className="bg-purple-600 text-white text-xs px-2 py-1">{game.entryFee} ETH</Badge>
                )}
              </div>

              {/* Join Button */}
              <div className="col-span-1">
                <Button
                  size="sm"
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.players >= game.maxPlayers}
                  className="bg-green-400 hover:bg-green-500 text-black font-semibold px-3 py-1 text-xs rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
                >
                  {game.players >= game.maxPlayers ? "Full" : "Join"}
                </Button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-3">
              {/* Game Name and Join Button Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-green-400 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                    {shouldShowImage(game.banner) ? (
                      <Image
                        src={getImageSrc(game.banner)}
                        alt={game.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-lg object-cover"
                        priority={false}
                        unoptimized={true}
                      />
                    ) : (
                      <span className="text-white">{game.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-white truncate">{game.name}</div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleJoinGame(game.id)}
                  disabled={game.players >= game.maxPlayers}
                  className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-1.5 text-xs rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 flex-shrink-0"
                >
                  {game.players >= game.maxPlayers ? "Full" : "Join"}
                </Button>
              </div>

              {/* Game Details Row */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                {/* Days */}
                <div className="text-center">
                  <div className="text-gray-400 mb-1">Days</div>
                  <div className="text-white font-medium">{game.days}</div>
                </div>

                {/* Steps */}
                <div className="text-center">
                  <div className="text-gray-400 mb-1">Steps</div>
                  <div className="text-white font-medium">{game.steps.toLocaleString()}</div>
                </div>

                {/* Players */}
                <div className="text-center">
                  <div className="text-gray-400 mb-1">Players</div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="flex -space-x-1">
                      {[...Array(Math.min(2, game.players))].map((_, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 bg-gradient-to-br from-green-400 to-purple-400 rounded-full border border-gray-800"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-white ml-1">
                      {game.players}/{game.maxPlayers}
                    </span>
                  </div>
                </div>

                {/* Entry Fee */}
                <div className="text-center">
                  <div className="text-gray-400 mb-1">Entry</div>
                  <div>
                    {type === "sponsored" ? (
                      <Badge className="bg-green-400 text-black text-xs px-2 py-0.5 font-semibold">FREE</Badge>
                    ) : (
                      <Badge className="bg-purple-600 text-white text-xs px-2 py-0.5">{game.entryFee} ETH</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reward for sponsored games */}
            {type === "sponsored" && game.reward && (
              <div className="mt-3 md:mt-2 md:pl-10">
                <Badge className="bg-gradient-to-r from-purple-500 to-green-400 text-white text-xs px-2 py-1">
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