import { signOut } from "../../../../backend/auth";

export async function POST(req, res) {
  try {
    console.log("Received POST request at /api/fitbit/disconnect");
    
    // Sign out the user to disconnect Fitbit
    const response = await signOut({ redirect: false });
    console.log("SignOut response:", response);

    if (response?.error) {
      console.error("Error during signOut:", response.error);
      return new Response(JSON.stringify({ error: response.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Fitbit disconnected successfully");
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Fitbit disconnected successfully" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Failed to disconnect Fitbit" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}