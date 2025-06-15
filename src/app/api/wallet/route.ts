import { auth } from "@/backend/auth";
import { Wallet } from "@/backend/models";
import { connectToDb, encrypt, generateWalletAddress } from "@/backend/utils";
import { NextResponse } from "next/server";

// Validate encryption key on server start
if (!process.env.ENCRYPTION_KEY) {
	console.error("ERROR: ENCRYPTION_KEY is not set in environment variables");
	// Don't throw here to allow the server to start, but operations will fail if encryption is attempted
}

// GET /api/wallet
async function handleGET() {
	try {
		const session = await auth();
		if (!session?.user?.email) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		await connectToDb();
		let wallet = await Wallet.findOne({ userId: session.user.email });

		// If wallet doesn't exist, create one
		if (!wallet) {
			const { address, key } = generateWalletAddress();

			console.log(address, "->", key);

			

			wallet = await Wallet.create({
				userId: session.user.email,
				address,
				key, // In production, encrypt this before saving
			});
		}

		// Don't send the private key to the client
		const { key: _, ...walletData } = wallet.toObject();

		return NextResponse.json(walletData);
	} catch (error) {
		console.error("Error handling wallet:", error);
		return new NextResponse(
			JSON.stringify({
				error: "Failed to handle wallet",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500 },
		);
	}
}

// POST /api/wallet
async function handlePOST() {
	try {
		const session = await auth();
		if (!session?.user?.email) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
			});
		}

		await connectToDb();

		// Check if wallet already exists
		const existingWallet = await Wallet.findOne({ userId: session.user.email });
		if (existingWallet) {
			return new NextResponse(
				JSON.stringify({
					error: "Wallet already exists",
					address: existingWallet.address,
				}),
				{ status: 200 },
			);
		}

		// Generate wallet address and encrypt the private key
		const { address, key } = generateWalletAddress();

		// Validate encryption key is set
		if (!process.env.ENCRYPTION_KEY) {
			throw new Error("ENCRYPTION_KEY is not set in environment variables");
		}

		// Create and save new wallet with encrypted key
		const newWallet = await Wallet.create({
			userId: session.user.email,
			address,
			key: encrypt(key),
		});

		// Don't send the private key to the client
		const { key: _, ...walletData } = newWallet.toObject();

		return NextResponse.json(walletData, { status: 201 });
	} catch (error) {
		console.error("Error creating wallet:", error);
		return new NextResponse(
			JSON.stringify({
				error: "Failed to create wallet",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
			{ status: 500 },
		);
	}
}

// Route handlers
export async function GET() {
	return handleGET();
}

export async function POST() {
	return handlePOST();
}

export const dynamic = "force-dynamic"; // Ensure dynamic evaluation for auth
