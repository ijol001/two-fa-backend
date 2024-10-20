import OTP from "../models/otpModel.js";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

async function verifyLoginOTP(req, res) {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email: email, otp: otp });
    if (!otpRecord) {
      return res.status(400).json({ "status": "failed", "message": "Invalid or expired OTP" });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ "status": "failed", "message": "User not found" });
    }

    const token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    await OTP.deleteOne({ email: email, otp: otp });

    res.status(200).json({
      "status": "success",
      "message": "OTP verified successfully. You are now logged in.",
      "token": token,
      "authid": email
    });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ "status": "failed", "message": "Unable to verify OTP" });
  }
}

export default verifyLoginOTP;
