import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Appointment from '@/models/appointment.model';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    // We fetch appointments
    const appointments = await Appointment.find({})
        .populate('patientId', 'firstName lastName')
        .populate('doctorId', 'name')
        .sort({ date: 1 })
        .limit(10);
    
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Fetch Appointments Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectToDatabase();

    const newAppointment = await Appointment.create(data);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Create Appointment Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
