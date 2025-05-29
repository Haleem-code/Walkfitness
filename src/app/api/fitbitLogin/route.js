
import { signIn } from "../../../backend/auth";

export async function POST(req, res) {
  try {
    console.log("Received POST request at /api/auth/fitbitLogin");
    const response = await signIn("fitbit", { redirect: false });
    console.log("SignIn response:", response);

    if (response?.error) {
      console.error("Error during signIn:", response.error);
      return new Response(JSON.stringify({ error: response.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    
    return new Response(JSON.stringify({ url: response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new Response(JSON.stringify({ error: "Failed to sign in" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}