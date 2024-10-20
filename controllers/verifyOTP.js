import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import OTP from "../models/otpModel.js";
import jwt from "jsonwebtoken";

async function verifyOTP(req, res) {
  const { email, otp } = req.body;
  try {
    const otpRecord = await OTP.findOne({ email: email, otp: otp });
    if (!otpRecord) {
      res.status(400).send({ "status": "failed", "message": "Invalid or expired OTP" });
      return;
    }

    const { first_name, last_name, password } = otpRecord;
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new userModel({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashPassword,
    });
    await newUser.save();

    const saved_user = await userModel.findOne({ email: email });
    const token = jwt.sign({ userID: saved_user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

    await OTP.deleteOne({ email: email, otp: otp });

    res.status(200).send({
      "status": "success", "message": "User registered successfully",
      "token": token,
      "authid": email
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      "status": "Failed",
      "message": "Something went wrong!"
    });
  }
}

export default verifyOTP;
