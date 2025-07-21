import { NextResponse } from "next/server";
import { auth } from "@/backend/auth";
import { getJoinedGamesByUser, getActiveJoinedGamesByUser } from "@/backend/action";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
	try {
		const session = await auth();
		console.log("Session:", session);
		const email = session?.user?.email;

		if (!email) {
			return NextResponse.json(
				{ error: "No authenticated user found" },
				{ status: 401 }
			);
		}

		// Get the URL to check for query parameters
		const { searchParams } = new URL(req.url);
		const activeOnly = searchParams.get('active') === 'true';

		let gameResult;
		
		if (activeOnly) {
			// Get only active joined games
			gameResult = await getActiveJoinedGamesByUser(email);
		} else {
			// Get all joined games
			gameResult = await getJoinedGamesByUser(email);
		}

		if (gameResult.error) {
			return NextResponse.json(
				{ error: gameResult.error },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			games: gameResult.games,
			count: gameResult.games?.length || 0
		}, { status: 200 });

	} catch (error) {
		console.error("Error fetching joined games:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}