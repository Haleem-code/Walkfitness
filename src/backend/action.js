import { signIn } from "./auth";
import { Steps, Point, Tournament, User } from "./models";
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
    await updateTournamentSteps(userId, presentDaySteps);

  } catch (err) {
    console.error("Error updating steps:", err);
    return { error: "Something went wrong" };
  }
};

const updateTournamentSteps = async (userId, steps) => {
  const activeTournaments = await Tournament.find({ 
    "participants.userId": userId,
    endDate: { $gt: new Date() }
  });

  for (const tournament of activeTournaments) {
    const participantIndex = tournament.participants.findIndex(p => p.userId === userId);
    if (participantIndex !== -1) {
      tournament.participants[participantIndex].steps += steps;
      await tournament.save();
    }
  }
};

export const createTournament = async (tournamentData) => {
  "use server";

  const { name, targetSteps, duration, amount, code, createdBy } = tournamentData;

  try {
    await connectToDb();
    const newTournament = new Tournament({
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
    await newTournament.save();
    console.log("Tournament created and saved to db");
    return newTournament;
  } catch (err) {
    console.error("Error creating tournament:", err);
    return { error: "Failed to create tournament" };
  }
};

export const joinTournament = async (userId, tournamentCode) => {
  "use server";

  try {
    await connectToDb();
    const tournament = await Tournament.findOne({ code: tournamentCode });

    if (!tournament) {
      return { error: "Tournament not found" };
    }

    if (!tournament.participants.some(p => p.userId === userId)) {
      tournament.participants.push({ userId, steps: 0 });
      await tournament.save();
      console.log("User joined tournament");
    } else {
      console.log("User already in tournament");
    }

    return tournament;
  } catch (err) {
    console.error("Error joining tournament:", err);
    return { error: "Failed to join tournament" };
  }
};

export const getTournaments = async () => {
  "use server";

  try {
    await connectToDb();
    const tournaments = await Tournament.find();
    return tournaments;
  } catch (err) {
    console.error("Error fetching tournaments:", err);
    return { error: "Failed to fetch tournaments" };
  }
};

export const getUserTournaments = async (userId) => {
  "use server";

  try {
    await connectToDb();
    const tournaments = await Tournament.find({ "participants.userId": userId });
    return tournaments;
  } catch (err) {
    console.error("Error fetching user tournaments:", err);
    return { error: "Failed to fetch user tournaments" };
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

