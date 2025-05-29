import { type NextRequest, NextResponse } from "next/server"
import { getGames } from "@/backend/data"

export async function GET(req: NextRequest) {
  const games = await getGames("sponsored")

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sponsored Games</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-transparent text-white">
        <div id="content">
          ${
            games.length === 0
              ? '<div class="text-center py-8 text-gray-400"><p>No sponsored games available.</p></div>'
              : renderGames(games)
          }
        </div>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}

function renderGames(games: any[]) {
  return `
    <div class="space-y-4">
      <div class="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 px-4 py-2 text-xs text-gray-400 uppercase">
        <div>Game Name</div>
        <div>Days</div>
        <div>Steps</div>
        <div>Players</div>
        <div>Entry</div>
        <div>Reward</div>
      </div>
      
      ${games
        .map(
          (game) => `
        <div class="grid grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-2 px-4 py-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span class="text-xs">🏆</span>
            </div>
            <span class="font-medium truncate">${game.name}</span>
          </div>
          <div class="text-sm">${game.duration} Days</div>
          <div class="text-sm">${game.gameSteps.toLocaleString()}</div>
          <div class="text-sm">${game.participants.length}</div>
          <div class="text-sm ${game.entryPrice > 0 ? "text-purple-400" : "text-green-400"}">
            ${game.entryPrice > 0 ? `$${game.entryPrice}` : "FREE"}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-yellow-400">$${(game.entryPrice * game.participants.length * 0.8).toFixed(2)}</span>
            <form action="/api/games/${game._id}/join" method="POST">
              <button 
                type="submit"
                class="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1 text-xs"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `
}
