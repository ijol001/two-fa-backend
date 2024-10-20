import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import OTP from "../models/otpModel.js";
import mailSender from "../config/emailConfig.js";
import otpGenerator from "otp-generator";

async function userReg(req, res) {
  const { first_name, last_name, email, password, password_confirmation } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      res.status(201).send({ "status": "failed", "message": "Email already exists" });
      return;
    }
    if (!first_name || !last_name || !email || !password || !password_confirmation) {
      res.send({ "status": "failed", "message": "All fields are required" });
      return;
    }
    if (password !== password_confirmation) {
      res.send({ "status": "failed", "message": "Password and Confirm Password do not match" });
      return;
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await mailSender(email, otp);

    const otpPayload = {first_name, last_name, password, email, otp };
    await OTP.create(otpPayload);

    res.status(200).send({
      "status": "success", "message": "Now enter the received OTP",
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

export default userReg;
