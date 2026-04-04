import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String, // Storing as YYYY-MM-DD
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    type: {
      type: String, // specialty or reason category
      default: 'General',
    },
    room: {
      type: String,
      default: 'TBD',
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
