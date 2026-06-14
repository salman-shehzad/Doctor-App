const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  screenshotUrl: String,
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  uploadedAt: { type: Date, default: Date.now },
  verifiedAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
