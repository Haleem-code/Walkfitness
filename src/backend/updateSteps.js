import { connectToDb } from "./utils";
import { User, Steps } from "./models";

export async function updateStepData(email, accessToken) {
  if (!email || !accessToken) {
    throw new Error("Email and access token are required");
  }

  try {
    await connectToDb();

    // Find user in database
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Get current date and previous day
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format dates for Fitbit API (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];
    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    // Fetch today's steps
    const todayResponse = await fetch(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${todayStr}/1d.json`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!todayResponse.ok) {
      const error = await todayResponse.json().catch(() => ({}));
      throw new Error(`Failed to fetch today's steps: ${JSON.stringify(error)}`);
    }

    // Fetch yesterday's steps
    const yesterdayResponse = await fetch(
      `https://api.fitbit.com/1/user/-/activities/steps/date/${yesterdayStr}/1d.json`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!yesterdayResponse.ok) {
      const error = await yesterdayResponse.json().catch(() => ({}));
      throw new Error(`Failed to fetch yesterday's steps: ${JSON.stringify(error)}`);
    }

    // Parse responses
    const todayData = await todayResponse.json();
    const yesterdayData = await yesterdayResponse.json();
    
    const todaySteps = Number.parseInt(todayData["activities-steps"]?.[0]?.value || '0', 10);
    const yesterdaySteps = Number.parseInt(yesterdayData["activities-steps"]?.[0]?.value || '0', 10);
    
    // Normalize dates to compare just the date part
    const normalizeDate = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const lastUpdate = user.lastStepUpdate ? normalizeDate(user.lastStepUpdate) : null;
    const todayNormalized = normalizeDate(today);

    // If last update was before today, add yesterday's steps to total
    if (!lastUpdate || lastUpdate < todayNormalized) {
      user.totalSteps = (user.totalSteps || 0) + yesterdaySteps;
    }

    // Update user's steps and last update time
    user.stepsForLastUpdate = todaySteps;
    user.lastStepUpdate = today;
    
    // Update or create Steps document
    await Steps.findOneAndUpdate(
      { email },
      { 
        $set: { 
          totalSteps: user.totalSteps,
          stepsForLastUpdate: todaySteps,
          $push: {
            lastSevenDaysSteps: {
              date: today,
              steps: todaySteps
            }
          }
        },
        $setOnInsert: { email }
      },
      { upsert: true, new: true }
    );

    // Save user updates
    await user.save();
    
    return {
      success: true,
      todaySteps,
      yesterdaySteps,
      totalSteps: user.totalSteps
    };
    
  } catch (error) {
    console.error('Error in updateStepData:', error);
    throw error; // Re-throw to be handled by the caller
  }
}
