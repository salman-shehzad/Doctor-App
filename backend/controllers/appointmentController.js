const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Assistant = require('../models/Assistant');

const populateAppointment = [
  { path: 'patientId', select: 'fullName email phone' },
  { path: 'doctorId', populate: { path: 'userId', select: 'fullName email phone' } },
  { path: 'clinicId' }
];

exports.bookAppointment = async (req, res) => {
  const appointment = await Appointment.create({ ...req.body, patientId: req.user._id, status: 'pending' });
  res.status(201).json(await appointment.populate(populateAppointment));
};

exports.patientAppointments = async (req, res) => {
  res.json(await Appointment.find({ patientId: req.user._id }).populate(populateAppointment).sort({ createdAt: -1 }));
};

exports.doctorAppointments = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });
  if (!doctor) return res.json([]);
  res.json(await Appointment.find({ doctorId: doctor._id }).populate(populateAppointment).sort({ createdAt: -1 }));
};

exports.assistantAppointments = async (req, res) => {
  const assistant = await Assistant.findOne({ userId: req.user._id });
  if (!assistant) return res.json([]);
  res.json(await Appointment.find({ doctorId: assistant.doctorId, status: 'payment_uploaded' }).populate(populateAppointment).sort({ createdAt: -1 }));
};

exports.getAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(populateAppointment);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  res.json(appointment);
};

exports.updateStatus = async (req, res) => {
  const allowed = ['pending', 'payment_uploaded', 'confirmed', 'cancelled', 'completed'];
  if (!allowed.includes(req.body.status)) return res.status(422).json({ message: 'Invalid appointment status' });
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  if (req.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: req.user._id });
    if (!doctor || appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own appointments' });
    }
  }

  if (req.user.role === 'assistant') {
    const assistant = await Assistant.findOne({ userId: req.user._id });
    if (!assistant || appointment.doctorId.toString() !== assistant.doctorId.toString()) {
      return res.status(403).json({ message: 'You can only update appointments for your assigned doctor' });
    }
  }

  appointment.status = req.body.status;
  if (req.body.status === 'confirmed' && !appointment.approvedAt) appointment.approvedAt = new Date();
  await appointment.save();

  res.json(await appointment.populate(populateAppointment));
};
