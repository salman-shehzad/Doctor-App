const Doctor = require('../models/Doctor');

const doctorPopulate = { path: 'userId', select: 'fullName email phone avatar' };

exports.getDoctors = async (req, res) => {
  const { search, treatmentType, disease } = req.query;
  const query = { isVerified: true };
  if (treatmentType) query.treatmentType = treatmentType;
  if (disease) query.diseasesTreated = { $regex: disease, $options: 'i' };

  let doctors = await Doctor.find(query).populate(doctorPopulate).sort({ createdAt: -1 });
  if (search) {
    const text = search.toLowerCase();
    doctors = doctors.filter((doctor) => {
      const name = doctor.userId?.fullName?.toLowerCase() || '';
      const specialty = doctor.specialty?.toLowerCase() || '';
      const diseases = (doctor.diseasesTreated || []).join(' ').toLowerCase();
      return name.includes(text) || specialty.includes(text) || diseases.includes(text);
    });
  }
  res.json(doctors);
};

exports.getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate(doctorPopulate);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

exports.getMe = async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id }).populate(doctorPopulate);
  if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
  res.json(doctor);
};

exports.updateDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  if (doctor.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can update only your own profile' });
  }
  const fields = ['specialty', 'treatmentType', 'diseasesTreated', 'bio', 'experienceYears', 'consultationFee'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) doctor[field] = req.body[field];
  });
  await doctor.save();
  res.json(await doctor.populate(doctorPopulate));
};
