import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/user.model';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch users with the role of 'doctor'
    const doctors = await User.find({ role: 'doctor' }).select('name email _id').lean();
    
    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error('Fetch Doctors Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
