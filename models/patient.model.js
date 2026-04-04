import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    age:       { type: Number, required: true },
    sex:       { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' },
    bloodGroup:{ type: String, default: 'Unknown' },
    phone:     { type: String, default: '' },
    email:     { type: String, default: '' },
    address:   { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    status:    { type: String, enum: ['Stable', 'Urgent', 'Follow-up'], default: 'Stable' },
    allergies: [{ type: String }],
    medicalHistory: [
      {
        condition:    String,
        diagnosedDate: Date,
        notes:        String,
      },
    ],
    prescriptions: [
      {
        medication:    String,
        dosage:        String,
        frequency:     String,
        prescribedDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
