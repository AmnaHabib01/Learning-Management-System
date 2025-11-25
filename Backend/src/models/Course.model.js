import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: [] }],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", default: [] }],

    duration: String,
    creditHours: Number,

    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment", default: [] }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz", default: [] }],

  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;
