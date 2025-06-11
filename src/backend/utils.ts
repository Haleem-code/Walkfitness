import mongoose, { Connection, type ConnectOptions } from "mongoose";
import {Keypair} from "@solana/web3.js";

interface DatabaseConnection {
	isConnected?: number;
}

const connection: DatabaseConnection = {};

export const connectToDb = async (): Promise<void> => {
	try {
		if (connection.isConnected) {
			console.log("Using existing connection");
			return;
		}

		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI environment variable is not defined");
		}

		const db = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);

		connection.isConnected = db.connections[0].readyState;
	} catch (error) {
		console.error("Database connection error:", error);
		throw new Error(
			typeof error === "string" ? error : "Failed to connect to database",
		);
	}
};

export const generateCodeVerifier = (): string => {
	const array = new Uint32Array(56 / 2);
	crypto.getRandomValues(array);
	return Array.from(array, (dec) => `0${dec.toString(16)}`.substr(-2)).join("");
};

export const generateCodeChallenge = async (
	verifier: string,
): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

export const generateState = (): string => {
	return [...Array(30)].map(() => Math.random().toString(36)[2]).join("");
};

export function generateWalletAddress() {
    const wallet = Keypair.generate();
    return {
        address: wallet.publicKey.toBase58(),
        key: wallet.secretKey.toString(),
    }
}
