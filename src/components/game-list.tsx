import { Button } from "@/components/ui/button"
import { getGames } from "@/backend/data"

interface Game {
  _id: string
  name: string
  gameSteps: number
  duration: number
  entryPrice: number
  gameType: "public" | "private" | "sponsored"
  participants: string[]
  image?: string
  code?: string
}

interface GameListProps {
  type: "public" | "sponsored"
}

export default async function GameList({ type }: GameListProps) {
  try {
    const games = await getGames(type)

    if (!games || games.length === 0) {
      return (
        <div className="text-center py-8 text-gray-400">
          <p>No {type} games available.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-4 py-2 text-xs text-gray-400 uppercase">
          <div>Game Name</div>
          <div>Days</div>
          <div>Steps</div>
          <div>Players</div>
          <div>Entry</div>
        </div>

        {games.map((game) => (
          <div
            key={game._id}
            className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 px-4 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-3">
              {game.image ? (
                <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                  <img src={game.image || "/placeholder.svg"} alt={game.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-xs">🎮</span>
                </div>
              )}
              <span className="font-medium truncate">{game.name}</span>
            </div>
            <div className="text-sm">{game.duration} Days</div>
            <div className="text-sm">{game.gameSteps.toLocaleString()}</div>
            <div className="text-sm">{game.participants.length}</div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${game.entryPrice > 0 ? "text-purple-400" : "text-green-400"}`}>
                {game.entryPrice > 0 ? `$${game.entryPrice}` : "FREE"}
              </span>
              <form action={`https://walkfit.vercel.app/api/games/${game._id}/join`} method="POST">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1 text-xs"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error: any) {
    return <p className="text-red-500">Error loading games: {error.message}</p>
  }
}
