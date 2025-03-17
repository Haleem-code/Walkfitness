import { getSteps } from "../../../backend/data"

// Mark the route as dynamic to avoid static rendering issues
export const dynamic = "force-dynamic"

export async function GET(req: Request): Promise<Response> {
  try {
    // Parse the request URL to extract query parameters
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    console.log("User email:", email)

    // Fetch steps data based on the email
    const stepsData = await getSteps(email)

    return new Response(JSON.stringify(stepsData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching steps data:", error)

    // Type narrowing: Check if error is an instance of Error
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: error.message || "Internal server error",
          message: "There was a problem fetching your steps data. Please try again later.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    } else {
      // Handle unknown error types
      return new Response(
        JSON.stringify({
          error: "An unknown error occurred",
          message: "There was a problem with your request. Please try again later.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }
  }
}

