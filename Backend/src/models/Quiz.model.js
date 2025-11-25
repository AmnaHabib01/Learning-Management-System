import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: { type: String, required: true },

    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], // multiple-choice
        correctAnswer: { type: String, required: true },
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    attempts: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        answers: [
          {
            questionId: { type: mongoose.Schema.Types.ObjectId },
            answer: { type: String },
            correct: { type: Boolean },
          },
        ],
        score: { type: Number },
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
