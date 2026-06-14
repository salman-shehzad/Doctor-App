const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  appointmentDate: Date,
  appointmentTime: String,
  status: {
    type: String,
    enum: ['pending', 'payment_uploaded', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  patientNotes: String,
  approvedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
