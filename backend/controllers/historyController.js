const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const MedicalHistory = require('../models/MedicalHistory');

exports.createHistory = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
  const appointment = await Appointment.findById(req.body.appointmentId);
  if (!appointment || appointment.doctorId.toString() !== doctor._id.toString()) {
    return res.status(403).json({ message: 'Appointment does not belong to this doctor' });
  }
  const history = await MedicalHistory.create({
    patientId: appointment.patientId,
    doctorId: req.user._id,
    appointmentId: appointment._id,
    diagnosis: req.body.diagnosis,
    symptoms: req.body.symptoms,
    notes: req.body.notes
  });
  appointment.status = 'completed';
  await appointment.save();
  res.status(201).json(history);
};

exports.patientHistory = async (req, res) => {
  res.json(await MedicalHistory.find({ patientId: req.user._id }).populate('doctorId', 'fullName email').sort({ createdAt: -1 }));
};

exports.doctorPatientHistory = async (req, res) => {
  res.json(await MedicalHistory.find({ doctorId: req.user._id, patientId: req.params.patientId }).populate('patientId', 'fullName email').sort({ createdAt: -1 }));
};

exports.getHistory = async (req, res) => {
  const history = await MedicalHistory.findById(req.params.id)
    .populate('patientId', 'fullName email phone')
    .populate('doctorId', 'fullName email');
  if (!history) return res.status(404).json({ message: 'History record not found' });
  res.json(history);
};

exports.byAppointment = async (req, res) => {
  const history = await MedicalHistory.findOne({ appointmentId: req.params.appointmentId })
    .populate('patientId', 'fullName email phone')
    .populate('doctorId', 'fullName email');
  if (!history) return res.status(404).json({ message: 'History record not found' });
  res.json(history);
};

exports.rejectMutation = (req, res) => {
  res.status(405).json({ message: 'Medical history records are immutable and cannot be updated or deleted' });
};
