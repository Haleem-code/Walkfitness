import { connectToDb } from "./utils";
import { User } from "./models";
import { updateStepData } from "./updateSteps";

export async function updateAllUsersSteps() {
  await connectToDb();

  const users = await User.find({ googleAccessToken: { $exists: true } });

  for (const user of users) {
    try {
      await updateStepData(user.email, user.googleAccessToken);
      console.log(`Successfully updated steps for user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to update steps for user: ${user.email}`, error);
    }
  }
}


updateAllUsersSteps();