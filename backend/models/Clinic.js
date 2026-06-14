const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  name: String,
  address: String,
  city: String,
  mapLink: String,
  workingDays: [String],
  workingHours: {
    start: String,
    end: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clinic', clinicSchema);
