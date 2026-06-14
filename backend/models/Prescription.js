const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  medicalHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalHistory', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
