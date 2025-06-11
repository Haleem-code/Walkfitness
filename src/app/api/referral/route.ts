// /app/api/referral/route.ts
import { auth } from "@/backend/auth";
import { Referral } from "@/backend/models";

interface ReferredUser {
  userId: string;
  username: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const userId = session.user.email;
    const { referrerId } = await req.json();
    
    if (!referrerId) {
      return new Response(JSON.stringify({ message: "Referrer ID is required" }), { status: 400 });
    }

    // Find referrer or create if doesn't exist
    const referrer = await Referral.findOne({ userId: referrerId });
    if (!referrer) {
      return new Response(JSON.stringify({ message: "Referrer not found" }), { status: 404 });
    }

    // Check if the user is trying to refer themselves
    if (userId === referrerId) {
      return new Response(JSON.stringify({ message: "Cannot refer yourself" }), { status: 400 });
    }

    // Check if already referred
    if (referrer.referredUsers.some((u: ReferredUser) => u.userId === userId)) {
      return new Response(JSON.stringify({ message: "Already referred" }), { status: 400 });
    }

    // Add the new referred user to the referrer's list
    referrer.referredUsers.push({ userId, username: session.user.name || "Unknown" });
    await referrer.save();

    // Create or update the current user's own referral document
    let userReferral = await Referral.findOne({ userId });
    if (!userReferral) {
      userReferral = new Referral({ userId,email:userId, referredUsers: [] });
      await userReferral.save();
    }

    return new Response(JSON.stringify({ message: "Referral added successfully" }), { status: 200 });
  } catch (error) {
    console.error("Referral API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    const userId = session.user.email;
    
    // Find or create user's referral document
    let referral = await Referral.findOne({ userId });
    
    // If referral document doesn't exist, create it
    if (!referral) {
      referral = new Referral({ userId, email:userId, referredUsers: [] });
      await referral.save();
    }
    
    return new Response(JSON.stringify(referral), { status: 200 });
  } catch (error) {
    console.error("Referral API error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}