const express = require('express');
const { body } = require('express-validator');
const prescription = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', protect, authorize('doctor'), [body('medicalHistoryId').isMongoId(), body('medicines').isArray()], validate, prescription.createPrescription);
router.get('/:historyId', protect, prescription.getPrescriptions);
router.put('/:id', protect, prescription.rejectMutation);
router.patch('/:id', protect, prescription.rejectMutation);
router.delete('/:id', protect, prescription.rejectMutation);

module.exports = router;
