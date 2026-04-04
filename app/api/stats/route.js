import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Patient from '@/models/patient.model';
import Appointment from '@/models/appointment.model';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const patientCount = await Patient.countDocuments();
    const appointmentCount = await Appointment.countDocuments();
    const pendingCount = await Appointment.countDocuments({ status: 'Pending' });

    return NextResponse.json({
      patients: patientCount,
      appointments: appointmentCount,
      pending: pendingCount
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch Stats Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
