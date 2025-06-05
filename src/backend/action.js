// import { signIn } from "./auth";
// import { Steps, Point, Game, User } from "./models";
// import { connectToDb } from "./utils";

// export const updateSteps = async (stepsData) => {
//   "use server";

//   const { totalSteps, presentDaySteps, userId } = stepsData;

//   try {
//     await connectToDb();
//     let existingUserSteps = await Steps.findOne({ userId });
//     if (!existingUserSteps) {
//       const newUserSteps = new Steps({
//         totalSteps,
//         presentDaySteps,
//         userId,
//       });
//       await newUserSteps.save();
//       console.log("saved to db");
//     } else {
//       await Steps.updateOne(
//         { userId },
//         {
//           $set: {
//             totalSteps,
//             presentDaySteps,
//           },
//         }
//       );
//     }
    
//     // Update steps in active Games
//     await updateGameSteps(userId, presentDaySteps);

//   } catch (err) {
//     console.error("Error updating steps:", err);
//     return { error: "Something went wrong" };
//   }
// };

// const updateGameSteps = async (userId, steps) => {
//   const activeGames = await Game.find({
//     "participants.userId": userId,
//     endDate: { $gt: new Date() }
//   });

//   for (const game of activeGames) {
//     const participantIndex = game.participants.findIndex(p => p.userId === userId);
//     if (participantIndex !== -1) {
//       game.participants[participantIndex].steps += steps;
//       await game.save();
//     }
//   }
// };


// export const createGame = async (gameData) => {
//   "use server";
  
//   const { name, gameSteps, duration, entryPrice, gameType, code, creator, startDate, image } = gameData;
  
//   // Validation
//   if (!name || !gameSteps || !duration || !creator || !startDate) {
//     return { error: "Missing required fields" };
//   }
  
//   // Validate gameType
//   if (!["public", "private", "sponsored"].includes(gameType)) {
//     return { error: "Invalid game type" };
//   }
  
//   // Private games must have a code
//   if (gameType === "private" && !code) {
//     return { error: "Private games must have a code" };
//   }
  
//   try {
//     await connectToDb();
    
//     // Check if game code already exists (for private games)
//     if (code) {
//       const existingGame = await Game.findOne({ code });
//       if (existingGame) {
//         return { error: "Game code already exists" };
//       }
//     }
    
//     const startDateObj = new Date(startDate);
//     const endDateObj = new Date(startDateObj.getTime() + duration * 24 * 60 * 60 * 1000);
    
//     const newGame = new Game({
//       name,
//       gameSteps,
//       duration,
//       entryPrice: entryPrice || 0,
//       gameType: gameType || "public",
//       code: gameType === "private" ? code : undefined,
//       creator,
//       participants: [creator], // Add creator as first participant
//       createdAt: new Date(),
//       startDate: startDateObj,
//       endDate: endDateObj,
//       image: image || null,
//     });
    
//     await newGame.save();
//     console.log("Game created and saved to db");
//     return { success: true, game: newGame };
//   } catch (err) {
//     console.error("Error creating game:", err);
//     return { error: "Failed to create game" };
//   }
// };

// export const joinGame = async (email, gameCode) => {
//   "use server";
  
//   // Validation
//   if (!email || !gameCode) {
//     return { error: "Missing required fields" };
//   }
  
//   try {
//     await connectToDb();
//     const game = await Game.findOne({ code: gameCode });
    
//     if (!game) {
//       return { error: "Game not found" };
//     }
    
//     // Check if game has ended
//     if (game.endDate < new Date()) {
//       return { error: "Game has already ended" };
//     }
    
//     // Check if game has started
//     if (game.startDate > new Date()) {
//       return { error: "Game has not started yet" };
//     }
    
//     if (!game.participants.includes(email)) {
//       game.participants.push(email);
//       await game.save();
//       console.log("User joined game successfully");
//       return { success: true, game };
//     } else {
//       return { success: true, message: "User already in game", game };
//     }
//   } catch (err) {
//     console.error("Error joining game:", err);
//     return { error: "Failed to join game" };
//   }
// };

// export const getGamesByType = async (gameType) => {
//   "use server";
  
//   // Validation
//   if (!["public", "private", "sponsored"].includes(gameType)) {
//     return { error: "Invalid game type" };
//   }
  
//   try {
//     await connectToDb();
//     const games = await Game.find({ 
//       gameType,
//       endDate: { $gt: new Date() } // Only active games
//     }).sort({ createdAt: -1 });
    
//     return { success: true, games };
//   } catch (err) {
//     console.error("Error fetching games:", err);
//     return { error: "Failed to fetch games" };
//   }
// };

// export const getGames = async () => {
//   "use server";
  
//   try {
//     await connectToDb();
//     const games = await Game.find({
//       endDate: { $gt: new Date() } // Only active games
//     }).sort({ createdAt: -1 });
    
//     return { success: true, games };
//   } catch (err) {
//     console.error("Error fetching games:", err);
//     return { error: "Failed to fetch games" };
//   }
// };

// export const getUserGames = async (email) => {
//   "use server";
  
//   // Validation
//   if (!email) {
//     return { error: "Email is required" };
//   }
  
//   try {
//     await connectToDb();
//     const games = await Game.find({ 
//       participants: email 
//     }).sort({ createdAt: -1 });
    
//     return { success: true, games };
//   } catch (err) {
//     console.error("Error fetching user games:", err);
//     return { error: "Failed to fetch user games" };
//   }
// };

// export const getGameByCode = async (code) => {
//   "use server";
  
//   if (!code) {
//     return { error: "Game code is required" };
//   }
  
//   try {
//     await connectToDb();
//     const game = await Game.findOne({ code });
    
//     if (!game) {
//       return { error: "Game not found" };
//     }
    
//     return { success: true, game };
//   } catch (err) {
//     console.error("Error fetching game:", err);
//     return { error: "Failed to fetch game" };
//   }
// };

// export const handleGoogleLogin = async () => {
//   "use server";
//   await signIn("fitbit");
// };

// export const handleQuestPoint = async (email, point, buttonState) => {
//   await connectToDb();
//   const user = await Point.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // Update quest points
//   user.questPoint += point;

//   // Update the button state
//   user.buttonState = buttonState;

//   await user.save();
// };


"use server";

import { signIn } from "./auth";
import { Steps, Point, Game, User } from "./models";
import { connectToDb } from "./utils";
import { nanoid } from 'nanoid';

export const updateSteps = async (stepsData) => {
  const { totalSteps, presentDaySteps, userId } = stepsData;

  try {
    await connectToDb();
    let existingUserSteps = await Steps.findOne({ userId });
    if (!existingUserSteps) {
      const newUserSteps = new Steps({
        totalSteps,
        presentDaySteps,
        userId,
      });
      await newUserSteps.save();
      console.log("saved to db");
    } else {
      await Steps.updateOne(
        { userId },
        {
          $set: {
            totalSteps,
            presentDaySteps,
          },
        }
      );
    }
    
    // Update steps in active Games
    await updateGameSteps(userId, presentDaySteps);

  } catch (err) {
    console.error("Error updating steps:", err);
    return { error: "Something went wrong" };
  }
};

const updateGameSteps = async (userId, steps) => {
  const activeGames = await Game.find({
    "participants.userId": userId,
    endDate: { $gt: new Date() }
  });

  for (const game of activeGames) {
    const participantIndex = game.participants.findIndex(p => p.userId === userId);
    if (participantIndex !== -1) {
      game.participants[participantIndex].steps += steps;
      await game.save();
    }
  }
};

export const createGame = async (gameData) => {
  const { name, gameSteps, duration, entryPrice, gameType, creator, startDate, maxPlayers, image } = gameData;
  
  // Validation
  if (!name || !gameSteps || !duration || !creator || !startDate) {
    return { error: "Missing required fields" };
  }
  
  // Validate gameType
  if (!["public", "private", "sponsored"].includes(gameType)) {
    return { error: "Invalid game type" };
  }
  
  try {
    await connectToDb();
    
    let gameCode = null;
    
    // Generate unique code for private games
    if (gameType === "private") {
      let codeExists = true;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (codeExists && attempts < maxAttempts) {
        gameCode = nanoid(8).toUpperCase();
        const existingGame = await Game.findOne({ code: gameCode });
        codeExists = !!existingGame;
        attempts++;
      }
      
      if (codeExists) {
        return { error: "Failed to generate unique game code. Please try again." };
      }
    }
    
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + duration * 24 * 60 * 60 * 1000);
    
    const newGame = new Game({
      name,
      gameSteps,
      duration,
      entryPrice: entryPrice || 0,
      gameType: gameType || "public",
      code: gameCode,
      creator,
      participants: [creator],
      createdAt: new Date(),
      startDate: startDateObj,
      endDate: endDateObj,
      image: image || null,
      maxPlayers: maxPlayers || 100,
    });
    
    await newGame.save();
    console.log("Game created and saved to db");
    
    const response = { success: true, game: newGame };
    if (gameType === "private" && gameCode) {
      response.inviteCode = gameCode;
    }
    
    return response;
  } catch (err) {
    console.error("Error creating game:", err);
    return { error: "Failed to create game" };
  }
};

export const joinGameById = async (email, gameId) => {
  // Validation
  if (!email || !gameId) {
    return { error: "Missing required fields" };
  }
  
  try {
    await connectToDb();
    const game = await Game.findById(gameId);
    
    if (!game) {
      return { error: "Game not found" };
    }
    
    // Check if game has ended
    if (game.endDate < new Date()) {
      return { error: "Game has already ended" };
    }
    
    // Check if game has started
    if (game.startDate > new Date()) {
      return { error: "Game has not started yet" };
    }
    
    // Check if game is full
    if (game.maxPlayers && game.participants.length >= game.maxPlayers) {
      return { error: "Game is full" };
    }
    
    if (!game.participants.includes(email)) {
      game.participants.push(email);
      await game.save();
      console.log("User joined game successfully");
      return { success: true, game };
    } else {
      return { success: true, message: "User already in game", game };
    }
  } catch (err) {
    console.error("Error joining game:", err);
    return { error: "Failed to join game" };
  }
};

export const getGameById = async (gameId) => {
  if (!gameId) {
    return { error: "Game ID is required" };
  }
  
  try {
    await connectToDb();
    const game = await Game.findById(gameId);
    
    if (!game) {
      return { error: "Game not found" };
    }
    
    return { success: true, game };
  } catch (err) {
    console.error("Error fetching game:", err);
    return { error: "Failed to fetch game" };
  }
};

export const joinGame = async (email, gameCode) => {
  // Validation
  if (!email || !gameCode) {
    return { error: "Missing required fields" };
  }
  
  try {
    await connectToDb();
    const game = await Game.findOne({ code: gameCode });
    
    if (!game) {
      return { error: "Game not found" };
    }
    
    // Check if game has ended
    if (game.endDate < new Date()) {
      return { error: "Game has already ended" };
    }
    
    // Check if game has started
    if (game.startDate > new Date()) {
      return { error: "Game has not started yet" };
    }
    
    // Check if game is full
    if (game.maxPlayers && game.participants.length >= game.maxPlayers) {
      return { error: "Game is full" };
    }
    
    if (!game.participants.includes(email)) {
      game.participants.push(email);
      await game.save();
      console.log("User joined game successfully");
      return { success: true, game };
    } else {
      return { success: true, message: "User already in game", game };
    }
  } catch (err) {
    console.error("Error joining game:", err);
    return { error: "Failed to join game" };
  }
};

export const getGamesByType = async (gameType) => {
  // Validation
  if (!["public", "private", "sponsored"].includes(gameType)) {
    return { error: "Invalid game type" };
  }
  
  try {
    await connectToDb();
    const games = await Game.find({ 
      gameType,
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    
    return { success: true, games };
  } catch (err) {
    console.error("Error fetching games:", err);
    return { error: "Failed to fetch games" };
  }
};

export const getGames = async () => {
  try {
    await connectToDb();
    const games = await Game.find({
      endDate: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    
    return { success: true, games };
  } catch (err) {
    console.error("Error fetching games:", err);
    return { error: "Failed to fetch games" };
  }
};

export const getUserGames = async (email) => {
  // Validation
  if (!email) {
    return { error: "Email is required" };
  }
  
  try {
    await connectToDb();
    const games = await Game.find({ 
      participants: email 
    }).sort({ createdAt: -1 });
    
    return { success: true, games };
  } catch (err) {
    console.error("Error fetching user games:", err);
    return { error: "Failed to fetch user games" };
  }
};

export const getGameByCode = async (code) => {
  if (!code) {
    return { error: "Game code is required" };
  }
  
  try {
    await connectToDb();
    const game = await Game.findOne({ code });
    
    if (!game) {
      return { error: "Game not found" };
    }
    
    return { success: true, game };
  } catch (err) {
    console.error("Error fetching game:", err);
    return { error: "Failed to fetch game" };
  }
};

export const handleGoogleLogin = async () => {
  await signIn("fitbit");
};

export const handleQuestPoint = async (email, point, buttonState) => {
  await connectToDb();
  const user = await Point.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.questPoint += point;
  user.buttonState = buttonState;
  await user.save();
};

export const checkAndUpdateStreak = async (userId) => {
  try {
    await connectToDb()

    const user = await User.findOne({ email: userId })
    if (!user) {
      throw new Error("User not found")
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    let hasStreak = false
    let streakCount = user.currentStreak || 0
    let xpAwarded = 0
    let isNewRecord = false

    if (user.lastStreakDate) {
      const lastStreakDate = new Date(user.lastStreakDate)
      const lastStreakDay = new Date(lastStreakDate.getFullYear(), lastStreakDate.getMonth(), lastStreakDate.getDate())

      if (lastStreakDay.getTime() === today.getTime()) {
        return {
          hasStreak: false,
          streakCount: user.currentStreak || 0,
          xpAwarded: 0,
          isNewRecord: false,
        }
      }

      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (lastStreakDay.getTime() === yesterday.getTime()) {
        streakCount += 1
        hasStreak = true
        xpAwarded = 200
      } else {
        streakCount = 1
        hasStreak = true
        xpAwarded = 200
      }
    } else {
      streakCount = 1
      hasStreak = true
      xpAwarded = 200
    }

    const longestStreak = user.longestStreak || 0
    if (streakCount > longestStreak) {
      isNewRecord = true
    }

    await User.updateOne(
      { email: userId },
      {
        $set: {
          currentStreak: streakCount,
          longestStreak: Math.max(streakCount, longestStreak),
          lastStreakDate: now,
          streakXP: (user.streakXP || 0) + xpAwarded,
        },
      },
    )

    if (xpAwarded > 0) {
      let pointEntry = await Point.findOne({ email: userId })
      if (!pointEntry) {
        pointEntry = new Point({
          userId: userId,
          email: userId,
          questPoint: xpAwarded,
          totalPoint: xpAwarded,
        })
        await pointEntry.save()
      } else {
        await Point.updateOne(
          { email: userId },
          {
            $inc: {
              questPoint: xpAwarded,
              totalPoint: xpAwarded,
            },
          },
        )
      }
    }

    return {
      hasStreak,
      streakCount,
      xpAwarded,
      isNewRecord,
    }
  } catch (error) {
    console.error("Error checking streak:", error)
    return {
      hasStreak: false,
      streakCount: 0,
      xpAwarded: 0,
      isNewRecord: false,
    }
  }
}

export const getUserStreak = async (userId) => {
  try {
    await connectToDb()
    const user = await User.findOne({ email: userId })

    if (!user) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        streakXP: 0,
        lastStreakDate: null,
      }
    }

    return {
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      streakXP: user.streakXP || 0,
      lastStreakDate: user.lastStreakDate,
    }
  } catch (error) {
    console.error("Error getting user streak:", error)
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakXP: 0,
      lastStreakDate: null,
    }
  }
}