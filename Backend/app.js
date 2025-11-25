import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import { errorHandler } from "./src/core/middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import teacherRouter from "./src/modules/teacher/teacher.route.js";
import adminRouter from "./src/modules/admin/admin.route.js";
import courseRouter from "./src/modules/course/course.route.js";
import studentRouter from "./src/modules/student/student.route.js";
import assignmentRouter from "./src/modules/assignment/assignment.route.js";
import quizRouter from "./src/modules/quiz/quiz.route.js";

const app = express()

dotenv.config()


app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/api/v1/teacher", teacherRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/assignment", assignmentRouter);
app.use("/api/v1/quiz", quizRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Server is running smoothly - Module Structure',
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler)

export default app