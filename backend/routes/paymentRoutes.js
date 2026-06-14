const express = require('express');
const { body } = require('express-validator');
const payment = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/', protect, authorize('patient'), upload.single('screenshot'), [body('appointmentId').isMongoId()], validate, payment.uploadPayment);
router.patch('/:id/verify', protect, authorize('assistant'), [body('status').isIn(['verified', 'rejected'])], validate, payment.verifyPayment);
router.get('/:appointmentId', protect, payment.getPayment);

module.exports = router;
