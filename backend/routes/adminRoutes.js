const express = require('express');
const { body } = require('express-validator');
const admin = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/users', protect, authorize('admin', 'super_admin'), admin.getUsers);
router.get('/doctors', protect, authorize('admin', 'super_admin'), admin.getDoctors);
router.patch('/doctors/:id/verify', protect, authorize('admin', 'super_admin'), [body('isVerified').isBoolean()], validate, admin.verifyDoctor);
router.delete('/users/:id', protect, authorize('super_admin'), admin.deleteUser);
router.get('/stats', protect, authorize('admin', 'super_admin'), admin.stats);

module.exports = router;
