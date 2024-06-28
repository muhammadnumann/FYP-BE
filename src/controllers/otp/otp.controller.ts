import Otps from "../../models/otp";
import sendEmail from "../../utils/sendEmails";

const randomstring = require('randomstring');

// Generate OTP
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// Send OTP to the provided email
const sendOTP = async (req: any, res: any, next: any) => {
    try {
        const { email } = req.body;
        const otp = generateOTP(); // Generate a 6-digit OTP
        const newOTP = new Otps({ email, otp });
        await newOTP.save();

        // Send OTP via email
        await sendEmail({
            to: email,
            subject: 'Your OTP Code',
            message: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                background-color: #4caf50;
                color: #ffffff;
                border-radius: 8px 8px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 16px;
                margin: 0 0 20px;
            }
            .otp {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4caf50;
                color: #ffffff;
                border-radius: 4px;
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 2px;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #999999;
            }
            .footer a {
                color: #4caf50;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Your OTP Code</h1>
            </div>
            <div class="content">
                <p>Dear User,</p>
                <p>To proceed with your action, please use the following One-Time Password (OTP):</p>
                <div class="otp">${otp}</div>
                <p>This OTP is valid for a limited time. Please do not share this code with anyone.</p>
                <p>Thank you!</p>
            </div>
            <div class="footer">
                <p>If you did not request this OTP, please ignore this email or <a href="#">contact support</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `,
        });


        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

// Verify OTP provided by the user
const verifyOTP = async (req: any, res: any, next: any) => {
    try {
        const { email, otp } = req.body;
        const existingOTP = await Otps.findOneAndDelete({ email, otp });

        console.log(req.body)
        console.log(existingOTP)

        if (existingOTP) {
            // OTP is valid
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            // OTP is invalid
            res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


export { verifyOTP, sendOTP, generateOTP }