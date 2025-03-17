import axios from "axios";

export async function fetchUserProfile(accessToken) {
  try {
    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=metadata",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching user profile:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching user profile");
  }
}

export function getLocalDayTimesInTimezone(timestamp, timezone) {
  const date = new Date(timestamp);
  const options = {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  // Start of the day
  const startOfDay = new Date(date.toLocaleString("en-US", options));
  startOfDay.setHours(0, 0, 0, 0);

  // End of the day
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  return { startOfDay, endOfDay };
}
