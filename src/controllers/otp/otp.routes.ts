const express = require('express');
const { sendOTP, verifyOTP } = require('./otp.controller');

const router = express.Router();

router.get('/sendOTP', sendOTP);
router.get('/verifyOTP', verifyOTP);

export default router;