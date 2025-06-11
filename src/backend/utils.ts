import mongoose, { Connection, type ConnectOptions } from "mongoose";

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
    throw new Error(typeof error === 'string' ? error : 'Failed to connect to database');
  }
};

export const generateCodeVerifier = (): string => {
  const array = new Uint32Array(56 / 2);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => (`0${dec.toString(16)}`).substr(-2)).join("");
};

export const generateCodeChallenge = async (verifier: string): Promise<string> => {
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

// User Profile Types
interface IUserProfile {
  userId: string;
  profileImage?: string;
  twitterUsername?: string;
  telegramId?: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Profile Schema
const userProfileSchema = new mongoose.Schema<IUserProfile>({
  userId: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "/images/x-img.svg" },
  twitterUsername: { type: String, default: "@Walkfit_xyz" },
  telegramId: { type: String, default: "" },
  points: { type: Number, default: 0 },
}, { timestamps: true });

// User Profile Model
const UserProfile = mongoose.models.UserProfile as mongoose.Model<IUserProfile> || 
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

// Fetch user profile data by user ID
export const getUserProfile = async (userId: string): Promise<IUserProfile | null> => {
  await connectToDb();
  try {
    return await UserProfile.findOne({ userId });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Error fetching user profile");
  }
};

// Update user profile data
export const updateUserProfile = async (
  userId: string, 
  profileData: Partial<IUserProfile>
): Promise<IUserProfile | null> => {
  await connectToDb();
  try {
    return await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Error updating user profile");
  }
};

// Delete user profile data
export const deleteUserProfile = async (userId: string): Promise<IUserProfile | null> => {
  await connectToDb();
  try {
    return await UserProfile.findOneAndDelete({ userId });
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw new Error("Error deleting user profile");
  }
};

// Points Schema and Model
interface IPoints {
  userId: string;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const pointsSchema = new mongoose.Schema<IPoints>(
  {
    userId: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Points = mongoose.models.Points as mongoose.Model<IPoints> || 
  mongoose.model<IPoints>("Points", pointsSchema);
