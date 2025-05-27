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

const TournamentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  tournaments: [
    {
      _id: { type: String, required: true },
      createdBy: { type: String, required: true },
      code: { 
        type: String, 
        required: true,
        default: () => nanoid(8).toUpperCase(),
        validate: {
          validator: function(v) {
            return v && v.length > 0;
          },
          message: props => `Tournament code cannot be empty`
        }
      }, 
      amount: { type: Number, required: true },
      duration: { type: Number, required: true },
      tournamentsteps: { type: Number, required: true },
      name: { type: String, required: true },
      participants: [{ type: String }],
      createdAt: { type: Date, default: Date.now },
      walletId: { type: String, default: "" },
    },
  ],
})

// Remove previous indexes
TournamentSchema.index({ email: 1 });

// Only create the unique index on non-null values with a proper partial filter expression
TournamentSchema.index(
  { "tournaments.code": 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { 
      "tournaments.code": { $type: "string", $ne: "" } 
    } 
  }
);


const GameSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: () => nanoid(10),
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["public", "private", "sponsored"],
    },
    code: {
      type: String,
      required: function () {
        return this.type === "private"
      },
      default: function () {
        return this.type === "private" ? nanoid(8).toUpperCase() : undefined
      },
      unique: true,
      sparse: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },
    steps: {
      type: Number,
      required: true,
      min: 100,
    },
    maxPlayers: {
      type: Number,
      required: true,
      min: 2,
      max: 1000,
    },
    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    reward: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
    createdByEmail: {
      type: String,
      required: true,
    },
    participants: [
      {
        email: String,
        username: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes
GameSchema.index({ type: 1, status: 1 })
GameSchema.index({ code: 1 }, { unique: true, sparse: true })
GameSchema.index({ createdBy: 1 })



export const Tournament = mongoose.models.Tournament || mongoose.model("Tournament", TournamentSchema);
export const Referral = mongoose.models.Referral || mongoose.model('Referral', ReferralSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Steps = mongoose.models.Steps || mongoose.model("Steps", stepsSchema);
export const Point = mongoose.models.Point || mongoose.model("Point", pointSchema);
export const StepData = mongoose.models.StepData || mongoose.model("StepData", StepDataSchema);
export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
