import mongoose from "mongoose";
import "dotenv/config";

const connection = {};

export const connectToDb = async () => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
};

export const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const generateState = () => {
  return [...Array(30)].map(() => Math.random().toString(36)[2]).join("");
};


// User Profile Schema
const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "/images/x-img.svg" },
  twitterUsername: { type: String, default: "@Walkfit_xyz" },
  telegramId: { type: String, default: "" },
  points: { type: Number, default: 0 },
});

// User Profile Model
const UserProfile = mongoose.models.UserProfile || mongoose.model("UserProfile", userProfileSchema);

// Fetch user profile data by user ID
export const getUserProfile = async (userId) => {
  await connectToDb();
  try {
    const userProfile = await UserProfile.findOne({ userId });
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Error fetching user profile");
  }
};

// Update user profile data
export const updateUserProfile = async (userId, profileData) => {
  await connectToDb();
  try {
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true }
    );
    return updatedProfile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Error updating user profile");
  }
};

// Delete user profile data
export const deleteUserProfile = async (userId) => {
  await connectToDb();
  try {
    const deletedProfile = await UserProfile.findOneAndDelete({ userId });
    return deletedProfile;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw new Error("Error deleting user profile");
  }
};

const pointsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Each userId should be unique
  points: { type: Number, default: 0 }, // Points start at 0 by default
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Points model
const Points = mongoose.models.Points || mongoose.model("Points", pointsSchema);

export default Points;