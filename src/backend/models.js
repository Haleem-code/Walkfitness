// import mongoose from "mongoose";
import mongoose, { Schema, Document } from "mongoose";
import { nanoid } from 'nanoid';
// User schema

const streakFields={
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastStreakDate: {
    type: Date,
    default: null,
  },
  streakXP: {
    type: Number,
    default: 0,
  },
}


const userSchemaWithStreak = new mongoose.Schema(
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
    ...streakFields,
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

const pointSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
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
    default: function() { return nanoid(6); },
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


const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'invited', 'registered'],
      default: 'pending'
    },
    source: {
      type: String,
      default: 'landing-page'
    }
  },
  {
    timestamps: true
  }
);


waitlistSchema.index({ joinedAt: -1 });

export const Waitlist = mongoose.models.Waitlist || mongoose.model("Waitlist", waitlistSchema);
export const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchemaWithStreak);
export const Steps = mongoose.models.Steps || mongoose.model("Steps", stepsSchema);
export const Point = mongoose.models.Point || mongoose.model("Point", pointSchema);
export const StepData = mongoose.models.StepData || mongoose.model("StepData", StepDataSchema);
export const Game = mongoose.models.Game || mongoose.model("Game", gameSchema)
export const StreakFields = streakFields;