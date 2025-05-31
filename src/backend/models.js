// import mongoose from "mongoose";
import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from 'nanoid';
// User schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      min: 3,
      max: 20,
    },
    email: {
      type: String, 
      required: true,
      unique: true,
      max: 50,
    },
    img: {
      type: String,
    },
    googleAccessToken: { type: String },
    lastStepUpdate: { type: Date, default: null },
    totalSteps: { type: Number, default: 0 },
    firstStepDate: { type: Date, default: null },
    stepsForLastUpdate: {
      type: Number,
      default: 0,
    },
  },
)

// Steps data schema for last seven days steps
const StepDataSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  steps: { type: Number, required: true },
});

// Steps schema
const stepsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  totalSteps: {
    type: Number,
    required: true,
    default: 0,
  },
  lastSevenDaysSteps: { type: [StepDataSchema], required: true },
  stepsForLastUpdate: {
    type: Number,
    default: 0,
  },
});

// Point schema to include button state
const pointSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: false,
  },
  questPoint: {
    type: Number,
    default: 0,
  },
  totalPoint: {
    type: Number,
    default: 0,
  },

});

// Referral schema
const ReferredUserSchema = new Schema({
  userId: {
    type: String,
    required: true

  },

  username: {
    type: String,
    required: true,
    default: 'Unknown'
  }
});

// Define the schema for referrals
const ReferralSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  referredUsers: [ReferredUserSchema],
});

// Game schema

const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  gameSteps: {
    type: Number,
    required: true,
    min: 1,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  entryPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  gameType: {
    type: String,
    required: true,
    enum: ["public", "private", "sponsored"],
    default: "public",
  },
  code: {
    type: String,
    trim: true,
    default: ()=>nanoid(6),
    unique: true,
  },
  creator: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    default: [],
  },
  maxPlayers: {
    type: Number,
    default: 100,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
  },
});

// indexes
gameSchema.index({ gameType: 1 });
gameSchema.index({ endDate: 1 });




export const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Steps = mongoose.models.Steps || mongoose.model("Steps", stepsSchema);
export const Point = mongoose.models.Point || mongoose.model("Point", pointSchema);
export const StepData = mongoose.models.StepData || mongoose.model("StepData", StepDataSchema);
export const Game = mongoose.models.Game || mongoose.model("Game", gameSchema)
