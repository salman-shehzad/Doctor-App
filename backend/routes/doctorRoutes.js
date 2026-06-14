const express = require('express');
const { body } = require('express-validator');
const doctor = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', doctor.getDoctors);
router.get('/me', protect, authorize('doctor'), doctor.getMe);
router.get('/:id', doctor.getDoctor);
router.put('/:id', protect, authorize('doctor'), [
  body('treatmentType').optional().isIn(['Allopathic', 'Homeopathic', 'Herbal']),
  body('experienceYears').optional().isNumeric(),
  body('consultationFee').optional().isNumeric()
], validate, doctor.updateDoctor);

module.exports = router;
