import { getGamesByType } from '@/backend/action';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getGamesByType("sponsored");
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }
    
    const games = result.games || [];
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sponsored Games</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460); min-height: 100vh; }
    </style>
</head>
<body class="text-white">
    <div class="container mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-center">Sponsored Games</h2>
        ${games.length === 0 ? 
          '<p class="text-center text-gray-400">No sponsored games available</p>' :
          games.map(game => `
            <div class="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm rounded-lg p-4 mb-4 border border-purple-500/30">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg font-semibold">${game.name}</h3>
                    <span class="bg-gradient-to-r from-purple-600 to-pink-600 text-xs px-2 py-1 rounded">Sponsored</span>
                </div>
                ${game.image ? `<img src="${game.image}" alt="${game.name}" class="w-full h-32 object-cover rounded mb-3">` : ''}
                <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
                    <div>Target: ${game.gameSteps.toLocaleString()} steps</div>
                    <div>Duration: ${game.duration} days</div>
                    <div>Entry Fee: $${game.entryPrice}</div>
                    <div>Participants: ${game.participants.length}</div>
                </div>
                <div class="mt-3 text-xs text-gray-400">
                    Starts: ${new Date(game.startDate).toLocaleDateString()}
                </div>
                <button 
                    onclick="joinGame('${game._id}')" 
                    class="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded text-sm w-full"
                >
                    Join Sponsored Game
                </button>
            </div>
          `).join('')
        }
    </div>
    <script>
        function joinGame(gameId) {
            window.parent.postMessage({type: 'joinGame', gameId: gameId}, '*');
        }
    </script>
</body>
</html>`;
    
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error("Error in GET /api/games/sponsored:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}