
// import { Steps, User, Point, Tournament } from "./models"; 
// import { connectToDb } from "./utils"; 
// import { unstable_noStore as noStore } from "next/cache"; 
// import { auth } from "./auth";  

// export const getSteps = async (email) => {
//   noStore();
//   try {
//     await connectToDb();
    
//     const steps = await Steps.findOne({ email });
//     if (!steps) {
//       throw new Error("No steps found for this email!");
//     }
//     return {
//       stepsForLastUpdate: steps.stepsForLastUpdate,
//     };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch steps!");
//   }
// };

// export const getPoint = async (email) => {
//   noStore();
//   try {
//     await connectToDb();
    
//     const point = await Point.findOne({ email });
//     if (!point) {
//       throw new Error("No points found for this email!");
//     }
//     return {
//       totalPoint: point.totalPoint,
//     };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch point");
//   }
// };

// export const getUser = async (email) => {
//   noStore();
//   try {
//     await connectToDb();
//     const user = await User.findOne({ email });
//     return {
//       username: user.username,
//     };
//   } catch (err) {
//     console.log(err);
//     throw new Error("Failed to fetch user!");
//   }
// };

// export const getSession = async () => {
//   const session = await auth();
//   console.log("Session:", session);
  
//   if (!session) {
//     return new Response(JSON.stringify({ message: "Unauthorized" }), {
//       status: 401,
//     });
//   }
  
//   if (session) {
//     const email = session.user.email;
//     console.log("User email:", email);
//     return email;
//   }
// };
 
// export async function getTournaments() {
//   await connectToDb()
  
//   try {
//     // Find all tournaments
//     const tournamentDocuments = await Tournament.find({})
    
//     // Flatten the tournaments array from all documents
//     const allTournaments = tournamentDocuments.flatMap(doc =>
//       doc.tournaments.map(t => ({
//         _id: t._id.toString(),
//         name: t.name,
//         tournamentsteps: t.tournamentsteps,
//         duration: t.duration,
//         amount: t.amount,
//         code: t.code,
//         createdBy: t.createdBy,
//         participants: t.participants,
//       }))
//     )
    
//     return allTournaments
//   } catch (error) {
//     console.error('Error getting tournaments:', error)
//     return []
//   }
// }

// export async function getUserTournaments() {
//   await connectToDb()
  
//   try {
//     const session = await auth()
//     if (!session?.user?.email) return []
    
//     // Find tournaments where the user is a participant
//     const tournamentDocuments = await Tournament.find({})
    
//     // Flatten and filter tournaments where user is a participant
//     const userTournaments = tournamentDocuments.flatMap(doc =>
//       doc.tournaments.filter(t =>
//         t.participants.includes(session.user.email)
//       ).map(t => ({
//         _id: t._id.toString(),
//         name: t.name,
//         tournamentsteps: t.steps,
//         duration: t.duration,
//         amount: t.amount,
//         code: t.code,
//         createdBy: t.createdBy,
//         participants: t.participants,
//       }))
//     )
    
//     return userTournaments
//   } catch (error) {
//     console.error('Error getting user tournaments:', error)
//     return []
//   }
// }

import { User, Point,Game } from "./models"
import { connectToDb } from "./utils"
import { unstable_noStore as noStore } from "next/cache"
import { auth } from "./auth"

export const getSteps = async (email) => {
  noStore()
  try {
    await connectToDb()
    
    console.log(`Searching for user with email: ${email}`)

    const user = await User.findOne({ email })
    console.log(`User found:`, user)
    // Handle case where user is not found
    if (!user) {
      console.log(`No user found for email: ${email}`)
      return {
        stepsForLastUpdate: 0,
        totalSteps: 0,
        error: "User not found"
      }
    }
    
    console.log(`Found user:`, user)
    
    return {
      stepsForLastUpdate: user.stepsForLastUpdate || 0,
      totalSteps: user.totalSteps || 0,
    }
  } catch (err) {
    console.log("Error in getSteps:", err)
    console.log("Error details:", err.message)
    console.log("Stack trace:", err.stack)
    throw new Error(`Failed to fetch steps: ${err.message}`)
  }
}

// Rest of your code remains unchanged
export const getPoint = async (email) => {
  noStore()
  try {
    await connectToDb()

    const point = await Point.findOne({ email })
    if (!point) {
      throw new Error("No points found for this email!")
    }
    return {
      totalPoint: point.totalPoint,
    }
  } catch (err) {
    console.log(err)
    throw new Error("Failed to fetch point")
  }
}

export const getUser = async (email) => {
  noStore()
  try {
    await connectToDb()
    const user = await User.findOne({ email })
    return {
      username: user.username,
    }
  } catch (err) {
    console.log(err)
    throw new Error("Failed to fetch user!")
  }
}

export const getSession = async () => {
  const session = await auth()
  console.log("Session:", session)

  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    })
  }

  if (session) {
    const email = session.user.email
    console.log("User email:", email)
    return email
  }
}


export async function getGames(type = "public") {
  try {
    await connectToDb()

    const games = await Game.find({
      gameType: type,
      endDate: { $gt: new Date() }, // Only return active games
    })
      .sort({ createdAt: -1 })
      .limit(50)

    return JSON.parse(JSON.stringify(games))
  } catch (error) {
    console.error("Error fetching games:", error)
    return []
  }
}

export async function getGameByCode(code) {
  try {
    await connectToDb()

    const game = await Game.findOne({ code })

    if (!game) {
      return null
    }

    return JSON.parse(JSON.stringify(game))
  } catch (error) {
    console.error("Error fetching game by code:", error)
    return null
  }
}

export async function joinGame(code, userEmail) {
  try {
    await connectToDb()

    const game = await Game.findOne({ code })

    if (!game) {
      throw new Error("Game not found")
    }

    if (new Date() > game.endDate) {
      throw new Error("This game has ended")
    }

    if (game.participants.includes(userEmail)) {
      throw new Error("You are already a participant in this game")
    }

    game.participants.push(userEmail)
    await game.save()

    return true
  } catch (error) {
    console.error("Error joining game:", error)
    throw error
  }
}
