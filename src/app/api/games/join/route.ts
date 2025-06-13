// app/api/games/join/route.js
import { NextResponse } from "next/server";
import { auth } from "@/backend/auth";
import { joinGame, joinGameById } from "@/backend/action";
import { connectToDb, decrypt } from "@/backend/utils";
import { Program } from "@coral-xyz/anchor";
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
import { Game, Wallet } from "@/backend/models";

export const dynamic = "force-dynamic";

const connection = new Connection(NEXT_PUBLIC_RPC_URL);

const walkfit = new Program<Walkfit>(idl as Walkfit, {
	connection,
});

export async function POST(req: Request) {
	try {
		const session = await auth();
		console.log("Session:", session);
		const email = session?.user?.email;
		console.log("User email:", email);

		if (!email) {
			return NextResponse.json(
				{ error: "No authenticated user found" },
				{ status: 401 },
			);
		}

		const { gameCode, gameId } = await req.json();

		await connectToDb();

		const game = await Game.findOne({
			$or: [{ code: gameCode }, { _id: gameId }],
		});

		if (!game) {
			return NextResponse.json({ error: "Game not found" }, { status: 404 });
		}

		if (game.participants.includes(email)) {
			return NextResponse.json(
				{ message: "Already joined", gameId: game._id },
				{ status: 200 },
			);
		}

		const wallet = await Wallet.findOne({
			userId: email,
		});

		const kp = Keypair.fromSecretKey(bs58.decode(decrypt(wallet.key)));

		const creatorWallet = await Wallet.findOne({
			userId: game.creator,
    
		});

    const creatorKp = Keypair.fromSecretKey(bs58.decode(decrypt(creatorWallet.key)));

		console.log(creatorWallet);

		const gameAcounts = await PublicKey.findProgramAddress(
			[
				Buffer.from("game"),
				creatorKp.publicKey.toBytes(),
				Buffer.from(game.code),
			],
			walkfit.programId,
		);

		const gameAccount = gameAcounts[0];

    console.log(gameAccount);

		const instruction = await walkfit.methods
			.joinGame()
			.accounts({
				player: kp.publicKey,
				game: gameAccount,
			})
			.signers([kp])
			.instruction();

		const tx = new Transaction().add(instruction);
		const signature = await sendAndConfirmTransaction(connection, tx, [kp]);
		console.log(signature);

		if (!gameCode && !gameId) {
			return NextResponse.json(
				{ error: "Game code or game ID is required" },
				{ status: 400 },
			);
		}

		let result;

		if (gameCode) {
			// Join private game with code
			result = await joinGame(email, gameCode);
		} else {
			// Join public/sponsored game with ID
			result = await joinGameById(email, gameId);
		}

		if (result.error) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		return NextResponse.json(result, { status: 200 });
	} catch (error) {
		console.error("Error in POST /api/games/join:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
