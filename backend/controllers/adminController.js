const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

exports.getUsers = async (req, res) => {
  res.json(await User.find().select('-password').sort({ createdAt: -1 }));
};

exports.getDoctors = async (req, res) => {
  res.json(await Doctor.find().populate('userId', 'fullName email phone').sort({ createdAt: -1 }));
};

exports.verifyDoctor = async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isVerified: Boolean(req.body.isVerified) }, { new: true }).populate('userId', 'fullName email');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

exports.deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

exports.stats = async (req, res) => {
  const [roleCounts, appointmentStatuses, treatmentCounts, monthlyUsers, pendingPayments] = await Promise.all([
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Doctor.aggregate([{ $group: { _id: '$treatmentType', count: { $sum: 1 } } }]),
    User.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Payment.countDocuments({ status: 'pending' })
  ]);

  const totalUsers = await User.countDocuments();
  const totalDoctors = await Doctor.countDocuments();
  const totalAppointments = await Appointment.countDocuments();

  res.json({
    cards: {
      totalUsers,
      totalPatients: roleCounts.find((r) => r._id === 'patient')?.count || 0,
      totalDoctors,
      totalAppointments,
      pendingPayments
    },
    appointmentStatuses: appointmentStatuses.map((item) => ({ name: item._id || 'unknown', value: item.count })),
    treatmentTypes: treatmentCounts.map((item) => ({ name: item._id || 'Unspecified', count: item.count })),
    monthlyUsers: monthlyUsers.map((item) => ({ month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`, count: item.count }))
  });
};
