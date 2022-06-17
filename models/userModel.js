const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    unique: [true, "This email address is already taken. Please try another"],
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    maxlength: [16, "Password must not exceed 16 characters"],
    minlength: [7, "Password must be atleast 7 characters"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please provide a password"],
    maxlength: [16, "Password must not exceed 16 characters"],
    minlength: [7, "Password must be atleast 7 characters"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Confirm password should match the password",
    },
  },
  type: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function () {
  const password = await bcrypt.hash(this.password, 12);
  this.password = password;
  this.confirmPassword = undefined;
});

userSchema.methods.isPasswordCorrect = async function (
  decodedPassword,
  encodedPassword
) {
  return await bcrypt.compare(decodedPassword, encodedPassword);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
