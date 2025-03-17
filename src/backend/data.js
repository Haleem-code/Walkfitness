
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

import { Steps, User, Point, Tournament } from "./models"
import { connectToDb } from "./utils"
import { unstable_noStore as noStore } from "next/cache"
import { auth } from "./auth"

export const getSteps = async (email) => {
  noStore()
  try {
    await connectToDb()

    let steps = await Steps.findOne({ email })

    // If no steps found, create a new entry instead of throwing an error
    if (!steps) {
      console.log(`No steps found for email: ${email}. Creating new entry.`)
      steps = new Steps({
        email,
        totalSteps: 0,
        lastSevenDaysSteps: [],
        stepsForLastUpdate: 0,
      })
      await steps.save()
    }

    return {
      stepsForLastUpdate: steps.stepsForLastUpdate,
      totalSteps: steps.totalSteps,
      lastSevenDaysSteps: steps.lastSevenDaysSteps || [],
    }
  } catch (err) {
    console.log("Error in getSteps:", err)
    throw new Error("Failed to fetch steps!")
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

export async function getTournaments() {
  await connectToDb()

  try {
    // Find all tournaments
    const tournamentDocuments = await Tournament.find({})

    // Flatten the tournaments array from all documents
    const allTournaments = tournamentDocuments.flatMap((doc) =>
      doc.tournaments.map((t) => ({
        _id: t._id.toString(),
        name: t.name,
        tournamentsteps: t.tournamentsteps,
        duration: t.duration,
        amount: t.amount,
        code: t.code,
        createdBy: t.createdBy,
        participants: t.participants,
      })),
    )

    return allTournaments
  } catch (error) {
    console.error("Error getting tournaments:", error)
    return []
  }
}

export async function getUserTournaments() {
  await connectToDb()

  try {
    const session = await auth()
    if (!session?.user?.email) return []

    // Find tournaments where the user is a participant
    const tournamentDocuments = await Tournament.find({})

    // Flatten and filter tournaments where user is a participant
    const userTournaments = tournamentDocuments.flatMap((doc) =>
      doc.tournaments
        .filter((t) => t.participants.includes(session.user.email))
        .map((t) => ({
          _id: t._id.toString(),
          name: t.name,
          tournamentsteps: t.steps,
          duration: t.duration,
          amount: t.amount,
          code: t.code,
          createdBy: t.createdBy,
          participants: t.participants,
        })),
    )

    return userTournaments
  } catch (error) {
    console.error("Error getting user tournaments:", error)
    return []
  }
}

