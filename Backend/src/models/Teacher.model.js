import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher", immutable: true },
  profileImage: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  address: { type: String, default: "" },

  courses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ],
  quizzes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }
  ],
  assignments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }
  ],
   teacherIsVerified: {
            type: Boolean,
            default: false,
        },
  teacherPasswordResetToken: {
    type: String,
    default: null,
  },
  teacherPasswordExpirationDate: {
    type: Date,
    default: null,
  },
  teacherVerificationToken: {
    type: String,
    default: null,
  },
  teacherVerificationTokenExpiry: {
    type: Date,
    default: null
  },
  teacherRefreshToken: {
    type: String,
    default: null,
  },
}, {
  timestamps: true
});

// Hash password before saving
teacherSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Compare password
teacherSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
teacherSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: "teacher", // hardcoded role or add a field in schema
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
teacherSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Generate Temporary Token (verification / password reset)
teacherSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
  return { unHashedToken, hashedToken, tokenExpiry };
};

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
