const OtpModel = require('../models/otp');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

const sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        msg: 'Phone number is required',
      });
    }

    const otp = otpGenerator.generate(4, {
        digits: true,               
        upperCaseAlphabets: false,  
        lowerCaseAlphabets: false,  
        specialChars: false,        
    });

    const newOtp = new OtpModel({
      phoneNumber,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await newOtp.save();

    // Send OTP using Twilio
    await twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: phoneNumber,
    });

    return res.status(200).json({
      success: true,
      msg: 'OTP sent successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const otpRecord = await OtpModel.findOne({ phoneNumber, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid OTP',
      });
    }


    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        msg: 'OTP has expired',
      });
    }

 
    return res.status(200).json({
      success: true,
      msg: 'OTP verified successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { sendOtp, verifyOtp };
