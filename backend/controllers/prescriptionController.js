const MedicalHistory = require('../models/MedicalHistory');
const Prescription = require('../models/Prescription');

exports.createPrescription = async (req, res) => {
  const history = await MedicalHistory.findById(req.body.medicalHistoryId);
  if (!history) return res.status(404).json({ message: 'Medical history record not found' });
  if (history.doctorId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can prescribe only for your own history records' });
  }
  const prescription = await Prescription.create({
    medicalHistoryId: history._id,
    doctorId: req.user._id,
    patientId: history.patientId,
    medicines: req.body.medicines || []
  });
  res.status(201).json(prescription);
};

exports.getPrescriptions = async (req, res) => {
  res.json(await Prescription.find({ medicalHistoryId: req.params.historyId }).populate('doctorId', 'fullName email'));
};

exports.rejectMutation = (req, res) => {
  res.status(405).json({ message: 'Prescriptions are immutable and cannot be updated or deleted' });
};
