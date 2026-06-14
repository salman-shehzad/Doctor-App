const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'doctor-hub/payments' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });

exports.uploadPayment = async (req, res) => {
  if (!req.file) return res.status(422).json({ message: 'Payment screenshot is required' });
  const appointment = await Appointment.findById(req.body.appointmentId);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
  if (appointment.patientId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not your appointment' });

  const uploaded = await uploadToCloudinary(req.file.buffer);
  const payment = await Payment.findOneAndUpdate(
    { appointmentId: appointment._id },
    { patientId: req.user._id, screenshotUrl: uploaded.secure_url, status: 'pending', uploadedAt: new Date() },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  appointment.status = 'payment_uploaded';
  await appointment.save();
  res.status(201).json(payment);
};

exports.verifyPayment = async (req, res) => {
  const { status } = req.body;
  if (!['verified', 'rejected'].includes(status)) return res.status(422).json({ message: 'Status must be verified or rejected' });
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = status;
  payment.verifiedBy = req.user._id;
  payment.verifiedAt = new Date();
  await payment.save();
  if (status === 'verified') {
    await Appointment.findByIdAndUpdate(payment.appointmentId, { status: 'confirmed' });
  }
  res.json(payment);
};

exports.getPayment = async (req, res) => {
  const payment = await Payment.findOne({ appointmentId: req.params.appointmentId }).populate('verifiedBy', 'fullName email');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  res.json(payment);
};
