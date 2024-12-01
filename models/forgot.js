const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: Number,
    action : {type : String , default : ""},
    expireAt: { type: Date, default: Date.now, expires: 180 }
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgotpassword"
);

module.exports = ForgotPassword;