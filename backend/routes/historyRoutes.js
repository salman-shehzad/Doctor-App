const express = require('express');
const { body } = require('express-validator');
const history = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', protect, authorize('doctor'), [body('appointmentId').isMongoId(), body('diagnosis').notEmpty()], validate, history.createHistory);
router.get('/patient', protect, authorize('patient'), history.patientHistory);
router.get('/doctor/:patientId', protect, authorize('doctor'), history.doctorPatientHistory);
router.get('/appointment/:appointmentId', protect, history.byAppointment);
router.get('/:id', protect, history.getHistory);
router.put('/:id', protect, history.rejectMutation);
router.patch('/:id', protect, history.rejectMutation);
router.delete('/:id', protect, history.rejectMutation);

module.exports = router;
