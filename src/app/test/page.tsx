import { auth } from "@/backend/auth";

export default async function test() {
  try {
    const apiUrl = process.env.API_URL ;
    // ||
    //  "http://localhost:3000/";
    console.log(`Fetching email from: ${apiUrl}/api/getemail`); // Log the API URL

    const emailRes = await fetch(`${apiUrl}/api/getemail`);

    if (!emailRes.ok) {
      throw new Error(`Failed to fetch: ${emailRes.statusText} (${emailRes.status})`);
    }

    const { email } = await emailRes.json();
    console.log("email", email);
    return email;
  } catch (error) {
    // Type narrowing: Check if error is an instance of Error
    if (error instanceof Error) {
      console.error("Error fetching email:", error.message);
    } else {
      console.error("Error fetching email: An unknown error occurred");
    }
    return null; // Handle the error accordingly
  }
}
