import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "Admin", immutable: true },
  
  courses: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course" }
  ],

  adminIsVerified: { type: Boolean, default: false },
  adminPasswordResetToken: { type: String, default: null },
  adminPasswordExpirationDate: { type: Date, default: null },
  adminVerificationToken: { type: String, default: null },
  adminVerificationTokenExpiry: { type: Date, default: null },
  adminRefreshToken: { type: String, default: null },
}, {
  timestamps: true
});

// Hash password before saving
adminSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

// Compare password
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      role: "Admin",
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Generate Temporary Token (verification / password reset)
adminSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex");
  const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
  return { unHashedToken, hashedToken, tokenExpiry };
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
