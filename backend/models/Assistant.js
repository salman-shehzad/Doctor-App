const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assistant', assistantSchema);
