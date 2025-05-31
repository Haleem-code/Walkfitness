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

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Check if request is FormData (with file upload) or JSON
    const contentType = req.headers.get('content-type');
    let gameData;
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await req.formData();
      const dataString = formData.get('data');
      gameData = JSON.parse(dataString);
      
      // Handle file upload if present
      const bannerFile = formData.get('banner');
      if (bannerFile) {
        // Here you would typically upload the file to your storage service
        // For now, we'll just store the filename or skip it
        gameData.image = bannerFile.name; // Or upload to cloud storage and get URL
      }
    } else {
      // Handle regular JSON
      gameData = await req.json();
    }
    
    console.log("Received game data:", gameData);
    const result = await createGame(gameData);
    
    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 });
    }
    
    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/games:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}