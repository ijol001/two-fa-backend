import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import mailSender from "../config/emailConfig.js";
import OTP from "../models/otpModel.js";

dotenv.config();

async function userLogin(req, res) {
  const { email, password } = req.body;
  try {
    
    const user = await userModel.findOne({ email: email });
    if (!email || !password) {
      return res.status(400).json({ "status": "failed", "message": "All fields are required" });
    }

    if (!user) {
      return res.status(404).json({ "status": "failed", "message": "You are not a registered user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ "status": "failed", "message": "Email or Password is not valid" });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await mailSender(email, otp);
    const otpPayload = { email,otp };
    await OTP.create(otpPayload);

    res.status(200).send({
      "status": "success",
      "message": "OTP has been sent to your email. Please verify to proceed.",
      "authid": user.id 
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ "status": "failed", "message": "Unable to Login" });
  }
}

export default userLogin;
