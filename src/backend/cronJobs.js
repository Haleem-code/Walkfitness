import cron from "node-cron";
import { updateAllUsersSteps } from "./updateAllSteps.js";

// Schedule the job to run every hour
cron.schedule("*/5 * * * *", updateAllUsersSteps);

console.log("Cron job for updating steps data has been scheduled.");
