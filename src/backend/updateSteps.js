import { connectToDb } from "./utils.js";
import { User, Steps } from "./models.js";

export async function updateStepData(email, accessToken) {
  await connectToDb();

  function getEndOfDayMillis() {
    const now = new Date();
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      -1
    );
    return endOfDay.getTime();
  }

  function setToStartOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function normalizeDateToStartOfDay(date) {
    const localDate = new Date(date);
    return new Date(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate()
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found");
    return;
  }

  const lastStepUpdate = user.lastStepUpdate || new Date();

  try {
    const todayResponse = await fetch(
      `https://api.fitbit.com/1/user/-/activities/steps/date/today/1d.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("response", todayResponse);

    const previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);
    const formattedPreviousDay = previousDay.toISOString().split("T")[0];

    // Fetch previous day's data
    const previousDayResponse = await fetch(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${formattedPreviousDay}/1d.json`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("response", previousDayResponse);

    if (todayResponse.ok && previousDayResponse.ok) {
      const todayData = await todayResponse.json();
      const previousDayData = await previousDayResponse.json();
      const stepsData = {
        today: {
          date: setToStartOfDay(new Date()),
          steps: todayData["activities-steps"][0]?.value || 0,
        },
        previousDay: {
          date: setToStartOfDay(previousDay),
          steps: previousDayData["activities-steps"][0]?.value || 0,
        },
      };
      console.log("Fetched steps data:", stepsData);

      let newTotalSteps = Number(user.totalSteps);

      const localDayDate = normalizeDateToStartOfDay(stepsData.today.date);
      const localLastStepUpdate = normalizeDateToStartOfDay(lastStepUpdate);

      if (localDayDate.getTime() > localLastStepUpdate.getTime()) {
        // New day has started, add the previous day's steps to the total
        newTotalSteps = user.totalSteps + Number ( stepsData.previousDay.steps);

        // Update user's total steps, last step update, and steps for the last update
        user.totalSteps = newTotalSteps;
        user.lastStepUpdate = new Date();
        user.stepsForLastUpdate = stepsData.today.steps; // Store today's steps for further comparisons
        await user.save();

        // Update or create an entry in the Steps schema
        const existingSteps = await Steps.findOne({ email: email });
        if (existingSteps) {
          existingSteps.totalSteps = newTotalSteps;
          existingSteps.stepsForLastUpdate = stepsData.today.steps;
          await existingSteps.save();
        } else {
          const newSteps = new Steps({
            email: email,
            totalSteps: newTotalSteps,
            stepsForLastUpdate: stepsData.today.steps,
          });
          await newSteps.save();
        }

        console.log(
          "Steps data updated with previous day steps:",
          newTotalSteps
        );
      } else {
        // If it's still the same day, update only the steps for the last update
        user.stepsForLastUpdate = stepsData.today.steps;
        await user.save();

        const existingSteps = await Steps.findOne({ email: email });
        if (existingSteps) {
          existingSteps.stepsForLastUpdate = stepsData.today.steps;
          await existingSteps.save();
        } else {
          const newSteps = new Steps({
            email: email,
            totalSteps: user.totalSteps, // Total steps remain the same
            stepsForLastUpdate: stepsData.today.steps,
          });
          await newSteps.save();
        }

        console.log(
          "Steps for the current day have been updated, but total steps remain unchanged."
        );
      }
    } else {
      console.log("Failed to fetch steps data");
    }
  } catch (error) {
    console.log("Error fetching steps data:", error);
  }
}
