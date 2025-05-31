import { getGames } from '@/backend/action';

export const dynamic = "force-dynamic";

// GET /api/games - Get all active games
export async function GET() {
  try {
    const result = await getGames();
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }
    
    return Response.json(result);
  } catch (error) {
    console.error("Error in GET /api/games:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

//fkfjf


// export async function POST(request: Request) {
//   try {
//     // Check if request has body
//     const contentLength = request.headers.get('content-length');
//     if (!contentLength || contentLength === '0') {
//       return Response.json({ error: "Request body is required" }, { status: 400 });
//     }

//     // Get the raw text first to debug
//     const rawBody = await request.text();
    
//     // Check if body is empty or invalid
//     if (!rawBody || rawBody.trim() === '') {
//       return Response.json({ error: "Request body is empty" }, { status: 400 });
//     }

//     // Log the raw body for debugging
//     console.log("Raw request body:", rawBody);

//     let gameData;
//     try {
//       gameData = JSON.parse(rawBody);
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError);
//       console.error("Raw body that failed to parse:", rawBody);
//       return Response.json({ 
//         error: "Invalid JSON format in request body",
//         details: parseError.message 
//       }, { status: 400 });
//     }

//     // Validate required fields
//     const { name, gameSteps, duration, creator, startDate } = gameData;
//     if (!name || !gameSteps || !duration || !creator || !startDate) {
//       return Response.json({ 
//         error: "Missing required fields: name, gameSteps, duration, creator, startDate" 
//       }, { status: 400 });
//     }

//     const result = await createGame(gameData);
    
//     if (result.error) {
//       return Response.json({ error: result.error }, { status: 400 });
//     }
    
//     return Response.json(result, { status: 201 });
//   } catch (error) {
//     console.error("Error in POST /api/games:", error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }