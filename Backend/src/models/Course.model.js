import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    // Teachers assigned to this course
    teachers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
    ],

    // Students enrolled in this course
    students: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Student" }
    ],

    // Assignments and quizzes related to this course
    assignments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }
    ],
    quizzes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }
    ],

    // Max students per teacher
    maxStudentsPerTeacher: { type: Number, default: 50 },

    // Duration in weeks or months
    duration: { type: String, trim: true }, // e.g., "12 weeks" or "3 months"

    // Credit hours for the course
    creditHours: { type: Number, default: 3 },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
