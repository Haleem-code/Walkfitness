import { NextResponse } from "next/server";
import { connectToDb } from "@/backend/utils";
import { Game, User, type IGame } from "@/backend/models";
import { isValidObjectId } from "mongoose";

export const dynamic = "force-dynamic";

export interface LeaderboardEntry {
	email: string;
	name: string;
	img?: string | null;
	steps: number;
	rank: number;
}

export async function GET(
	request: Request,
	{ params }: { params: { gameCodeOrId: string } },
) {
	try {
		await connectToDb();

		const { gameCodeOrId } = params;

		// Find the game by ID
		const game = await Game.findOne({
			$or: [
				{ _id: isValidObjectId(gameCodeOrId) ? gameCodeOrId : null },
				{ code: gameCodeOrId }
			]
		});

		if (!game) {
			return NextResponse.json(
				{ success: false, error: "Game not found" },
				{ status: 404 },
			);	
		}

		// Get all users who are participants in the game
		const participants = await User.find({
			email: { $in: game.participants },
		});

		// Create leaderboard entries with user details and steps
		const leaderboard: LeaderboardEntry[] = participants.map((user) => ({
			email: user.email,
			name: user.username || user.email.split("@")[0],
			img: user.img || null,
			steps: user.stepsForLastUpdate || 0,
			rank: 0, // Will be calculated after sorting
		}));

		// Sort by steps in descending order
		leaderboard.sort((a, b) => b.steps - a.steps);

		// Assign ranks (handling ties)
		leaderboard.forEach((entry, index) => {
			// If steps are the same as previous entry, they share the same rank
			if (index > 0 && entry.steps === leaderboard[index - 1].steps) {
				entry.rank = leaderboard[index - 1].rank;
			} else {
				entry.rank = index + 1;
			}
		});

		return NextResponse.json({
			success: true,
			leaderboard,
			game: {
				id: game._id,
				name: game.name,
				totalParticipants: leaderboard.length,
			},
		});
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 },
		);
	}
}
