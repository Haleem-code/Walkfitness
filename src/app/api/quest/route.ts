import { NextRequest, NextResponse } from 'next/server';
import { handleQuestPoint } from '@/backend/action';



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, point } = body;

    if (!email || typeof point !== 'number') {
      return NextResponse.json({ error: 'Email and point are required' }, { status: 400 });
    }

    await handleQuestPoint(email, point);
    return NextResponse.json({ message: 'Quest point updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating quest points:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
  