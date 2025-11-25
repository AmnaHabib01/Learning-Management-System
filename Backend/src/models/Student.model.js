import mongoose from "mongoose";
import bcrypt from "bcryptjs";    //hash and verify(password--salt),npm package,bcrypt hashing algorithm only
import jwt from "jsonwebtoken";
import crypto from "crypto";       //hashing,encription(for tokens),node.js module,many algorithms

const quizTakenSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const assignmentSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  fileUrl: String,
  grade: Number,
  submittedAt: Date,
});

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    studentPassword: {
      type: String,
      required: true,
      minlength: 6,
    },

    studentProfileImage: {
      type: String, // URL
      default: "",
    },

    studentPhoneNumber: {
      type: String,
      default: "",
    },

    studentAddress: {
      type: String,
      default: "",
    },
    studentIsVerified: {
    type: Boolean,
    default: false,
  },
  studentPasswordResetToken: {
    type: String,
  },
  studentPasswordExpirationDate: {
    type: Date,
  },
  studentVerificationToken: {
    type: String,
    default: null,
  },
  studentVerificationTokenExpiry: {
    type: Date,
},
  studentRefreshToken: {
    type: String,
  },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    quizzesTaken: [quizTakenSchema],

    assignments: [assignmentSchema],
  },
  { timestamps: true }
);
studentSchema.pre("save", async function (next) {
    if (!this.isModified("studentPassword")) return next();
    this.studentPassword = await bcrypt.hash(this.studentPassword, 10);
    next();
});
//compare hashed password with plain
studentSchema.methods.isPasswordCorrect = async function (studentPassword) {
    return await bcrypt.compare(studentPassword, this.studentPassword);
};
//generate short lived token (JWT)
studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            studentEmail: this.studentEmail,
            studentName: this.studentName
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
    );
};
//generate long lived token (jwt)
studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
    );
};
//token for email and sms verification
studentSchema.methods.generateTemporaryToken = function () {

    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = Date.now() + 10 * 60 * 1000;                                                         // 20 minutes;

    return { unHashedToken, hashedToken, tokenExpiry };
};

const Student = mongoose.model("Student", studentSchema)

export default Student;