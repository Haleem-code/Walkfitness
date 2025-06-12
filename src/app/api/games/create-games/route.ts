// import {createGame } from '@/backend/action';

// export const dynamic = "force-dynamic";


// export async function POST(req) {
//   try {
//     const gameData = await req.json();
//     console.log("Received game data:", gameData);
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


import { createGame } from '@/backend/action';
import { nanoid } from 'nanoid';

export const dynamic = "force-dynamic";



export async function POST(req) {
  try {
    // Check if request is FormData (with file upload) or JSON
    const contentType = req.headers.get('content-type') || '';
    let gameData;
    
    console.log("Content-Type:", contentType); // Debug log
    
    if (contentType.startsWith('multipart/form-data')) {
      // Handle FormData (with file upload)
      console.log("Processing FormData request");
      const formData = await req.formData();
      const dataString = formData.get('data');
      
      if (!dataString) {
        console.error("No 'data' field found in FormData");
        return Response.json({ error: "No game data provided" }, { status: 400 });
      }
      
      try {
        gameData = JSON.parse(dataString);
        console.log("Parsed game data from FormData:", gameData);
      } catch (parseError) {
        console.error("Failed to parse game data JSON:", parseError);
        return Response.json({ error: "Invalid game data format" }, { status: 400 });
      }
      
      // Handle file upload if present
      const bannerFile = formData.get('banner');
      if (bannerFile && bannerFile.size > 0) {
        console.log("Banner file received:", bannerFile.name, bannerFile.size);
        // Here you would typically upload the file to your storage service
        // For now, we'll just store the filename or skip it
        gameData.image = bannerFile.name; // Or upload to cloud storage and get URL
      }
    } else {
      // Handle regular JSON
      console.log("Processing JSON request");
      gameData = await req.json();
    }
    
    // Generate unique code if not provided or null
    if (!gameData.code) {
      gameData.code = nanoid(6);
    }
    
    // Calculate end date if not provided
    if (!gameData.endDate && gameData.startDate && gameData.duration) {
      const startDate = new Date(gameData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + gameData.duration);
      gameData.endDate = endDate.toISOString();
    }
    
    console.log("Final game data before createGame:", gameData);
    
    // Validate required fields
    if (!gameData.name || !gameData.creator || !gameData.gameSteps || !gameData.maxPlayers) {
      console.error("Missing required fields:", gameData);
      return Response.json({ 
        error: "Missing required fields: name, creator, gameSteps, maxPlayers" 
      }, { status: 400 });
    }
    
    const result = await createGame(gameData);
    console.log("createGame result:", result);
    
    if (result.error) {
      console.error("createGame returned error:", result.error);
      return Response.json({ error: result.error }, { status: 400 });
    }
    
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/games:", error);
    console.error("Error stack:", error.stack);
    return Response.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}