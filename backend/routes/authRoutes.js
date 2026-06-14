const express = require('express');
const { body } = require('express-validator');
const auth = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

router.post('/register', [
  body('fullName').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['patient', 'doctor'])
], validate, auth.register);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, auth.login);
router.post('/forgot-password', [body('email').isEmail()], validate, auth.forgotPassword);
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], validate, auth.resetPassword);

module.exports = router;
