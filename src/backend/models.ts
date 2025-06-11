import mongoose, {
	Schema,
	type Document,
	type Model,
	type Types,
} from "mongoose";
import { nanoid } from "nanoid";

// Interface for Streak fields
interface IStreakFields {
	currentStreak: number;
	longestStreak: number;
	lastStreakDate: Date | null;
	streakXP: number;
}

// Interface for User document
interface IUser extends Document {
	username: string;
	email: string;
	img?: string;
	googleAccessToken?: string;
	lastStepUpdate?: Date | null;
	totalSteps: number;
	firstStepDate: Date | null;
	stepsForLastUpdate: number;
	currentStreak: number;
	longestStreak: number;
	lastStreakDate: Date | null;
	streakXP: number;
}

// Interface for Step Data
interface IStepData extends Document {
	date: Date;
	steps: number;
}

// Interface for Steps document
interface ISteps extends Document {
	email: string;
	totalSteps: number;
	lastSevenDaysSteps: Types.Array<IStepData>;
	stepsForLastUpdate: number;
}

// Interface for Points document
interface IPoint extends Document {
	userId: string;
	email: string;
	questPoint: number;
	totalPoint: number;
}

// Interface for Referred User
interface IReferredUser extends Document {
	userId: string;
	username: string;
}

// Interface for Referral document
interface IReferral extends Document {
	userId: string;
	referredUsers: Types.Array<IReferredUser>;
}

// Interface for Game document
interface IGame extends Document {
	name: string;
	gameSteps: number;
	duration: number;
	entryPrice: number;
	gameType: "public" | "private" | "sponsored";
	code: string;
	creator: string;
	participants: string[];
	maxPlayers: number;
	createdAt: Date;
	startDate: Date;
	endDate: Date;
	image?: string;
}

// Interface for Waitlist document
interface IWaitlist extends Document {
	email: string;
	joinedAt: Date;
	status: "pending" | "invited" | "registered";
	source: string;
	createdAt: Date;
	updatedAt: Date;
}

// Streak fields schema
const streakFields = {
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
} as const;

// User schema
const userSchemaWithStreak = new Schema<IUser>({
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
        lowercase: true,
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
});

// Steps data schema
const StepDataSchema = new Schema<IStepData>({
	date: { type: Date, required: true },
	steps: { type: Number, required: true },
});

// Steps schema
const stepsSchema = new Schema<ISteps>({
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

// Point schema
const pointSchema = new Schema<IPoint>({
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

// Referred User schema
const ReferredUserSchema = new Schema<IReferredUser>({
	userId: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		default: "Unknown",
	},
});

// Referral schema
const ReferralSchema = new Schema<IReferral>({
	userId: {
		type: String,
		required: true,
	},
	referredUsers: [ReferredUserSchema],
});

// Game schema
const gameSchema = new Schema<IGame>({
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
		default: () => nanoid(6),
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

// Waitlist schema
const waitlistSchema = new Schema<IWaitlist>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please enter a valid email",
			],
		},
		joinedAt: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ["pending", "invited", "registered"],
			default: "pending",
		},
		source: {
			type: String,
			default: "landing-page",
		},
	},
	{
		timestamps: true,
	},
);

// Indexes
gameSchema.index({ gameType: 1 });
gameSchema.index({ endDate: 1 });
waitlistSchema.index({ joinedAt: -1 });

// Export models
export const Waitlist: Model<IWaitlist> =
	mongoose.models.Waitlist ||
	mongoose.model<IWaitlist>("Waitlist", waitlistSchema);
export const Referral: Model<IReferral> =
	mongoose.models.Referral ||
	mongoose.model<IReferral>("Referral", ReferralSchema);
export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", userSchemaWithStreak);
export const Steps: Model<ISteps> =
	mongoose.models.Steps || mongoose.model<ISteps>("Steps", stepsSchema);
export const Point: Model<IPoint> =
	mongoose.models.Point || mongoose.model<IPoint>("Point", pointSchema);
export const StepData: Model<IStepData> =
	mongoose.models.StepData ||
	mongoose.model<IStepData>("StepData", StepDataSchema);
export const Game: Model<IGame> =
	mongoose.models.Game || mongoose.model<IGame>("Game", gameSchema);
export const StreakFields = streakFields;

// Export interfaces for use in other files
export type {
	IUser,
	ISteps,
	IPoint,
	IReferral,
	IGame,
	IWaitlist,
	IStreakFields,
	IStepData,
	IReferredUser,
};
