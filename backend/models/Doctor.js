const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialty: String,
  treatmentType: { type: String, enum: ['Allopathic', 'Homeopathic', 'Herbal'] },
  diseasesTreated: [String],
  bio: String,
  experienceYears: Number,
  consultationFee: Number,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Doctor', doctorSchema);
