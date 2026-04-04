import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Patient from '@/models/patient.model';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const patients = await Patient.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error('Fetch Patients Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await connectToDatabase();

    // Inject the logged-in user's ID so userId is always present
    const newPatient = await Patient.create({
      ...body,
      userId: session.userId,
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Create Patient Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
