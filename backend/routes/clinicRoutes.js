const express = require('express');
const { body } = require('express-validator');
const clinic = require('../controllers/clinicController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/:doctorId', clinic.getClinics);
router.post('/', protect, authorize('doctor'), [body('name').notEmpty(), body('address').notEmpty()], validate, clinic.createClinic);
router.put('/:id', protect, authorize('doctor'), clinic.updateClinic);
router.delete('/:id', protect, authorize('doctor'), clinic.deleteClinic);

module.exports = router;
