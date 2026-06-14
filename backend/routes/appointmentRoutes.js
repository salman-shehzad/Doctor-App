const express = require('express');
const { body } = require('express-validator');
const appointment = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', protect, authorize('patient'), [
  body('doctorId').isMongoId(),
  body('clinicId').isMongoId(),
  body('appointmentDate').isISO8601(),
  body('appointmentTime').notEmpty()
], validate, appointment.bookAppointment);
router.get('/patient', protect, authorize('patient'), appointment.patientAppointments);
router.get('/doctor', protect, authorize('doctor'), appointment.doctorAppointments);
router.get('/assistant', protect, authorize('assistant'), appointment.assistantAppointments);
router.get('/:id', protect, appointment.getAppointment);
router.patch('/:id/status', protect, authorize('assistant', 'doctor'), [body('status').notEmpty()], validate, appointment.updateStatus);

module.exports = router;
