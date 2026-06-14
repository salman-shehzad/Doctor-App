const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

const getOwnDoctor = (userId) => Doctor.findOne({ userId });

exports.getClinics = async (req, res) => {
  res.json(await Clinic.find({ doctorId: req.params.doctorId }).sort({ createdAt: -1 }));
};

exports.createClinic = async (req, res) => {
  const doctor = await getOwnDoctor(req.user._id);
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
  const clinic = await Clinic.create({ ...req.body, doctorId: doctor._id });
  res.status(201).json(clinic);
};

exports.updateClinic = async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);
  const doctor = await getOwnDoctor(req.user._id);
  if (!clinic || !doctor) return res.status(404).json({ message: 'Clinic not found' });
  if (clinic.doctorId.toString() !== doctor._id.toString()) return res.status(403).json({ message: 'Not your clinic' });
  Object.assign(clinic, req.body);
  await clinic.save();
  res.json(clinic);
};

exports.deleteClinic = async (req, res) => {
  const clinic = await Clinic.findById(req.params.id);
  const doctor = await getOwnDoctor(req.user._id);
  if (!clinic || !doctor) return res.status(404).json({ message: 'Clinic not found' });
  if (clinic.doctorId.toString() !== doctor._id.toString()) return res.status(403).json({ message: 'Not your clinic' });
  await clinic.deleteOne();
  res.json({ message: 'Clinic deleted' });
};
