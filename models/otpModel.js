
import mongoose from "mongoose";
import mailSender from "../config/emailConfig.js";
var ObjectId = mongoose.Types.ObjectId;

const otpSchema = new mongoose.Schema({
  id: {
    type: String, default: function () {
        return new ObjectId().toString()
    }},
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: false },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: '10m' } }
});

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;