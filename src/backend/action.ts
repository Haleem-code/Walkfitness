"use server";

import { signIn } from "./auth";
import { Steps, Point, Game, User, type IGame, Wallet } from "./models";
import { connectToDb, decrypt } from "./utils";
import { BN, Program } from "@coral-xyz/anchor";
import idl from "@/lib/idl.json";
import type { Walkfit } from "@/lib/idlType";
import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	sendAndConfirmTransaction,
	Transaction,
} from "@solana/web3.js";
import { NEXT_PUBLIC_RPC_URL } from "@/config";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { nanoid } from "nanoid";

const connection = new Connection(NEXT_PUBLIC_RPC_URL);

const walkfit = new Program<Walkfit>(idl as Walkfit, {
	connection,
});

interface StepsData {
	totalSteps: number;
	presentDaySteps: number;
	userId: string;
}

interface GameData {
	name: string;
	gameSteps: number;
	duration: number;
	entryPrice?: number;
	gameType: "public" | "private" | "sponsored";
	creator: string;
	startDate: string | Date;
	maxPlayers?: number;
	image?: string;
}

type ApiResponse<T = Record<string, never>> =
	| ({ success: true } & T)
	| { error: string; [key: string]: unknown };

export const updateSteps = async (
	stepsData: StepsData,
): Promise<ApiResponse<{ success: true }>> => {
	const { totalSteps, presentDaySteps, userId } = stepsData;

	try {
		await connectToDb();
		const existingUserSteps = await Steps.findOne({ userId });

		if (!existingUserSteps) {
			const newUserSteps = new Steps({
				totalSteps,
				presentDaySteps,
				userId,
			});
			await newUserSteps.save();
			console.log("saved to db");
		} else {
			await Steps.updateOne(
				{ userId },
				{
					$set: {
						totalSteps,
						presentDaySteps,
					},
				},
			);
		}

		await updateGameSteps(userId, presentDaySteps);
		return { success: true };
	} catch (err) {
		console.error("Error updating steps:", err);
		return { error: "Something went wrong" };
	}
};

const updateGameSteps = async (
	userId: string,
	steps: number,
): Promise<void> => {
	const activeGames = await Game.find({
		"participants.userId": userId,
		endDate: { $gt: new Date() },
	});

	for (const game of activeGames) {
		const participantIndex = game.participants.findIndex(
			(p: string) => p === userId,
		);
		if (participantIndex !== -1) {
			// If you need to track steps per participant, you'll need to update your schema
			// For now, we'll just update the participant list
			game.participants[participantIndex] = userId;
			await game.save();
		}
	}
};

export const createGame = async (
	gameData: GameData,
): Promise<ApiResponse<{ game: IGame; inviteCode?: string }>> => {
	const {
		name,
		gameSteps,
		duration,
		entryPrice,
		gameType,
		creator,
		startDate,
		maxPlayers,
		image,
	} = gameData;

	if (!name || !gameSteps || !duration || !creator || !startDate) {
		return { error: "Missing required fields" };
	}

	if (!["public", "private", "sponsored"].includes(gameType)) {
		return { error: "Invalid game type" };
	}

	try {
		await connectToDb();

		const startDateObj = new Date(startDate);
		const endDateObj = new Date(
			startDateObj.getTime() + duration * 24 * 60 * 60 * 1000,
		);

		const code = nanoid(6);

		const wallet = await Wallet.findOne({
			userId: creator,
		});

		const kp = Keypair.fromSecretKey(bs58.decode(decrypt(wallet.key)));

		const newGame = new Game({
			name,
			gameSteps,
			duration,
			entryPrice: entryPrice || 0,
			gameType,
			creator,
			participants: [],
			createdAt: new Date(),
			startDate: startDateObj,
			endDate: endDateObj,
			code,
			image: image || null,
			maxPlayers: maxPlayers || 100,
		});

		const instruction = await walkfit.methods
			.createGame(code, new BN(Number(newGame.entryPrice) * LAMPORTS_PER_SOL))
			.accounts({
				creator: new PublicKey(wallet.address),
			})
			.signers([kp])
			.instruction();

		const tx = new Transaction().add(instruction);
		const signature = await sendAndConfirmTransaction(connection, tx, [kp]);
		console.log(signature)

		await newGame.save();
		console.log("Game created and saved to db");

		const response: ApiResponse<{ game: IGame; inviteCode?: string }> = {
			success: true,
			game: newGame.toObject(),
			inviteCode: newGame.code,
		};

		return response;
	} catch (err) {
		console.error("Error creating game:", err);
		return { error: "Failed to create game" };
	}
};

export const joinGameById = async (
	email: string,
	gameId: string,
): Promise<ApiResponse<{ game: IGame }>> => {
	if (!email || !gameId) {
		return { error: "Missing required fields" };
	}

	try {
		await connectToDb();
		const game = await Game.findById(gameId);

		if (!game) {
			return { error: "Game not found" };
		}

		if (game.endDate < new Date()) {
			return { error: "Game has already ended" };
		}

		if (game.startDate > new Date()) {
			return { error: "Game has not started yet" };
		}

		if (game.maxPlayers && game.participants.length >= game.maxPlayers) {
			return { error: "Game is full" };
		}

		if (!game.participants.includes(email)) {
			game.participants.push(email);
			await game.save();
			console.log("User joined game successfully");
			return { success: true, game: game.toObject() };
		}
		return {
			success: true,
			message: "User already in game",
			game: game.toObject(),
		};
	} catch (err) {
		console.error("Error joining game:", err);
		return { error: "Failed to join game" };
	}
};

export const getGameById = async (
	gameId: string,
): Promise<ApiResponse<{ game: IGame }>> => {
	if (!gameId) {
		return { error: "Game ID is required" };
	}

	try {
		await connectToDb();
		const game = await Game.findById(gameId);

		if (!game) {
			return { error: "Game not found" };
		}

		return { success: true, game: game.toObject() };
	} catch (err) {
		console.error("Error fetching game:", err);
		return { error: "Failed to fetch game" };
	}
};

export const joinGame = async (
	email: string,
	gameCode: string,
): Promise<ApiResponse<{ game: IGame }>> => {
	if (!email || !gameCode) {
		return { error: "Missing required fields" };
	}

	try {
		await connectToDb();
		const game = await Game.findOne({ code: gameCode });

		if (!game) {
			return { error: "Game not found" };
		}

		if (game.endDate < new Date()) {
			return { error: "Game has already ended" };
		}

		if (game.startDate > new Date()) {
			return { error: "Game has not started yet" };
		}

		if (game.maxPlayers && game.participants.length >= game.maxPlayers) {
			return { error: "Game is full" };
		}

		if (!game.participants.includes(email)) {
			game.participants.push(email);
			await game.save();
			console.log("User joined game successfully");
			return { success: true, game: game.toObject() };
		}
		return {
			success: true,
			message: "User already in game",
			game: game.toObject(),
		};
	} catch (err) {
		console.error("Error joining game:", err);
		return { error: "Failed to join game" };
	}
};

export const getGamesByType = async (
	gameType: string,
): Promise<ApiResponse<{ games: IGame[] }>> => {
	if (!["public", "private", "sponsored"].includes(gameType)) {
		return { error: "Invalid game type" };
	}

	try {
		await connectToDb();
		const games = await Game.find({
			gameType,
			endDate: { $gt: new Date() },
		}).sort({ createdAt: -1 });

		return { success: true, games: games.map((g) => g.toObject()) };
	} catch (err) {
		console.error("Error fetching games:", err);
		return { error: "Failed to fetch games" };
	}
};

export const getGames = async (): Promise<ApiResponse<{ games: IGame[] }>> => {
	try {
		await connectToDb();
		const games = await Game.find({
			endDate: { $gt: new Date() },
		}).sort({ createdAt: -1 });

		return { success: true, games: games.map((g) => g.toObject()) };
	} catch (err) {
		console.error("Error fetching games:", err);
		return { error: "Failed to fetch games" };
	}
};

export const getUserGames = async (
	email: string,
): Promise<ApiResponse<{ games: IGame[] }>> => {
	if (!email) {
		return { error: "Email is required" };
	}

	try {
		await connectToDb();
		const games = await Game.find({
			participants: email,
		}).sort({ createdAt: -1 });

		return { success: true, games: games.map((g) => g.toObject()) };
	} catch (err) {
		console.error("Error fetching user games:", err);
		return { error: "Failed to fetch user games" };
	}
};

export const getGameByCode = async (
	code: string,
): Promise<ApiResponse<{ game: IGame }>> => {
	if (!code) {
		return { error: "Game code is required" };
	}

	try {
		await connectToDb();
		const game = await Game.findOne({ code });

		if (!game) {
			return { error: "Game not found" };
		}

		return { success: true, game: game.toObject() };
	} catch (err) {
		console.error("Error fetching game:", err);
		return { error: "Failed to fetch game" };
	}
};

export const handleGoogleLogin = async (): Promise<void> => {
	await signIn("fitbit");
};

export const handleQuestPoint = async (
	email: string,
	point: number,
	buttonState: Record<string, unknown>,
): Promise<void> => {
	await connectToDb();
	const user = await Point.findOne({ email });

	if (!user) {
		throw new Error("User not found");
	}

	// Update the user's points using the model's updateOne
	await Point.updateOne(
		{ email },
		{
			$set: {
				questPoint: (user.questPoint || 0) + point,
				buttonState,
			},
		},
	);
	// No need to call save() after updateOne
};

export const checkAndUpdateStreak = async (userId) => {
	try {
		await connectToDb();

		const user = await User.findOne({ email: userId });
		if (!user) {
			throw new Error("User not found");
		}

		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		let hasStreak = false;
		let streakCount = user.currentStreak || 0;
		let xpAwarded = 0;
		let isNewRecord = false;

		if (user.lastStreakDate) {
			const lastStreakDate = new Date(user.lastStreakDate);
			const lastStreakDay = new Date(
				lastStreakDate.getFullYear(),
				lastStreakDate.getMonth(),
				lastStreakDate.getDate(),
			);

			if (lastStreakDay.getTime() === today.getTime()) {
				return {
					hasStreak: false,
					streakCount: user.currentStreak || 0,
					xpAwarded: 0,
					isNewRecord: false,
				};
			}

			const yesterday = new Date(today);
			yesterday.setDate(yesterday.getDate() - 1);

			if (lastStreakDay.getTime() === yesterday.getTime()) {
				streakCount += 1;
				hasStreak = true;
				xpAwarded = 200;
			} else {
				streakCount = 1;
				hasStreak = true;
				xpAwarded = 200;
			}
		} else {
			streakCount = 1;
			hasStreak = true;
			xpAwarded = 200;
		}

		const longestStreak = user.longestStreak || 0;
		if (streakCount > longestStreak) {
			isNewRecord = true;
		}

		await User.updateOne(
			{ email: userId },
			{
				$set: {
					currentStreak: streakCount,
					longestStreak: Math.max(streakCount, longestStreak),
					lastStreakDate: now,
					streakXP: (user.streakXP || 0) + xpAwarded,
				},
			},
		);

		if (xpAwarded > 0) {
			let pointEntry = await Point.findOne({ email: userId });
			if (!pointEntry) {
				pointEntry = new Point({
					userId: userId,
					email: userId,
					questPoint: xpAwarded,
					totalPoint: xpAwarded,
				});
				await pointEntry.save();
			} else {
				await Point.updateOne(
					{ email: userId },
					{
						$inc: {
							questPoint: xpAwarded,
							totalPoint: xpAwarded,
						},
					},
				);
			}
		}

		return {
			hasStreak,
			streakCount,
			xpAwarded,
			isNewRecord,
		};
	} catch (error) {
		console.error("Error checking streak:", error);
		return {
			hasStreak: false,
			streakCount: 0,
			xpAwarded: 0,
			isNewRecord: false,
		};
	}
};

export const getUserStreak = async (userId) => {
	try {
		await connectToDb();
		const user = await User.findOne({ email: userId });

		if (!user) {
			return {
				currentStreak: 0,
				longestStreak: 0,
				streakXP: 0,
				lastStreakDate: null,
			};
		}

		return {
			currentStreak: user.currentStreak || 0,
			longestStreak: user.longestStreak || 0,
			streakXP: user.streakXP || 0,
			lastStreakDate: user.lastStreakDate,
		};
	} catch (error) {
		console.error("Error getting user streak:", error);
		return {
			currentStreak: 0,
			longestStreak: 0,
			streakXP: 0,
			lastStreakDate: null,
		};
	}
};
