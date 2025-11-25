import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: { type: String, required: true },
    instructions: { type: String },
    fileUrl: { type: String }, // uploaded file
    dueDate: { type: Date, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        fileUrl: { type: String }, // student's submission file
        submittedAt: { type: Date, default: Date.now },
        grade: { type: Number }, // optional
        feedback: { type: String }, // optional
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
