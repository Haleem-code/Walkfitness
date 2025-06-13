import { NextResponse } from 'next/server';
import { updateStepData } from '@/backend/updateSteps';
import { connectToDb } from '@/backend/utils';
import { auth } from "@/backend/auth"
import { User } from '@/backend/models';

export async function POST(request: Request) {
  try {
    const session = await auth()
    console.log("Session:", session)
    const email = session?.user?.email
    console.log("User ID:", email)
    
    if (!email) {
      return NextResponse.json(
        { error: "No authenticated user found" },
        { status: 401 }
      )
    }

    await connectToDb();
    const user = await User.findOne({ email });
    
    if (!user || !user.googleAccessToken) {
      return NextResponse.json({ error: 'User not found or not connected to Fitbit' }, { status: 404 });
    }

    // Update steps using your existing function
    await updateStepData(email, user.googleAccessToken);
    
    return NextResponse.json({ success: true, message: 'Steps updated successfully' });
  } catch (error) {
    console.error('Error updating steps:', error);
    return NextResponse.json({ error: 'Failed to update steps' }, { status: 500 });
  }
}