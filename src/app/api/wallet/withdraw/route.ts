import { auth } from "@/backend/auth";
import { decrypt, connectToDb } from "@/backend/utils";
import bs58 from "bs58";
import { Wallet } from "@/backend/models";

import { NextResponse } from "next/server";
import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	SystemProgram,
	Transaction,
	sendAndConfirmTransaction,
} from "@solana/web3.js";
import { NEXT_PUBLIC_RPC_URL } from "@/config";

export interface WithdrawRequestBody {
	amount: number;
	recipient: string;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		// 1. Auth
		const session = await auth();
		if (!session?.user?.email) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		// 2. Parse & validate
		const { amount, recipient }: WithdrawRequestBody = await request.json();
		if (!amount || amount <= 0) {
			return new NextResponse(JSON.stringify({ error: "Invalid amount" }), {
				status: 400,
			});
		}
		if (!recipient) {
			return new NextResponse(
				JSON.stringify({ error: "Recipient address is required" }),
				{ status: 400 },
			);
		}

		// 3. DB & keypair
		await connectToDb();
		const wallet = await Wallet.findOne({ userId: session.user.email });
		if (!wallet) {
			return new NextResponse(JSON.stringify({ error: "Wallet not found" }), {
				status: 404,
			});
		}
		const decryptedKey = decrypt(wallet.key);
		const keypair = Keypair.fromSecretKey(bs58.decode(decryptedKey));

		// 4. Connection
		const connection = new Connection(NEXT_PUBLIC_RPC_URL, "confirmed");

		// 5. Build & send the transaction
		const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
		const transferIx = SystemProgram.transfer({
			fromPubkey: keypair.publicKey,
			toPubkey: new PublicKey(recipient),
			lamports,
		});

		// Create and send
		const tx = new Transaction().add(transferIx);
		const signature = await sendAndConfirmTransaction(
			connection,
			tx,
			[keypair], // your single signer
			{ commitment: "processed" },
		);

		return NextResponse.json({
			success: true,
			signature,
			message: "Withdrawal successful",
		});
	} catch (err) {
		console.error("Withdrawal error:", err);
		return new NextResponse(
			JSON.stringify({
				error: "Withdrawal failed",
				details: err instanceof Error ? err.message : "Unknown error",
			}),
			{ status: 500 },
		);
	}
}
