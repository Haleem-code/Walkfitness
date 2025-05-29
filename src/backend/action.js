import { signIn } from "./auth";
import { Steps, Point, Game, User } from "./models";
import { connectToDb } from "./utils";

export const updateSteps = async (stepsData) => {
  "use server";

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
    
    // Update steps in active tournaments
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
  "use server";

  const { name, targetSteps, duration, amount, code, createdBy } = gameData;

  try {
    await connectToDb();
    const newGame = new Game({
      name,
      targetSteps,
      duration,
      amount,
      code,
      createdBy,
      participants: [{ userId: createdBy, steps: 0 }],
      createdAt: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    });
    await newGame.save();
    console.log("Game created and saved to db");
    return newGame;
  } catch (err) {
    console.error("Error creating game:", err);
    return { error: "Failed to create game" };
  }
};

export const joinGame = async (userId, gameCode) => {
  "use server";

  try {
    await connectToDb();
    const game = await Game.findOne({ code: gameCode });

    if (!game) {
      return { error: "Game not found" };
    }

    if (!game.participants.some(p => p.userId === userId)) {
      game.participants.push({ userId, steps: 0 });
      await game.save();
      console.log("User joined game successfully");
    } else {
      console.log("User already in game");
    }

    return game;
  } catch (err) {
    console.error("Error joining game:", err);
    return { error: "Failed to join game  " };
  }
};

export const getGames = async () => {
  "use server";

  try {
    await connectToDb();
    const games = await Game.find();
    return games ;
  } catch (err) {
    console.error("Error fetching games:", err);
    return { error: "Failed to fetch games" };
  }
};

export const getUserGames = async (userId) => {
  "use server";

  try {
    await connectToDb();
    const games = await Game.find({ "participants.userId": userId });
    return games ;
  } catch (err) {
    console.error("Error fetching user games:", err);
    return { error: "Failed to fetch user games" };
  }
};

export const handleGoogleLogin = async () => {
  "use server";
  await signIn("fitbit");
};

export const handleQuestPoint = async (email, point, buttonState) => {
  await connectToDb();
  const user = await Point.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  // Update quest points
  user.questPoint += point;

  // Update the button state
  user.buttonState = buttonState;

  await user.save();
};

