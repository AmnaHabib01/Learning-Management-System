import { asyncHandler } from "../../core/utils/async-handler.js";
import S3UploadHelper from "../../shared/helpers/s3Upload.js";
import { ApiError } from "../../core/utils/api-error.js";
import { ApiResponse } from "../../core/utils/api-response.js"
import Assignment from "../../models/Assignment.model.js";
import Course from "../../models/Course.model.js";
import Teacher from "../../models/Teacher.model.js";
// Helper: return signed URL or null if cannot create
const getSignedUrlSafe = async (key) => {
  try {
    if (!key) return null;
    // 1 hour signed URL (3600s) — change if you want longer/shorter
    return await S3UploadHelper.getSignedUrl(key, 3600);
  } catch (err) {
    // don't fail the whole request if signed URL creation fails — return null
    console.error("Signed URL generation failed:", err);
    return null;
  }
};

// ---------------- Create Assignment ----------------
export const createAssignment = asyncHandler(async (req, res) => {
  const { title, instructions, dueDate, course, createdBy } = req.body;

  if (!title || !course || !createdBy || !dueDate) {
    throw new ApiError(400, "Required fields are missing");
  }

  const courseExists = await Course.findById(course);
  if (!courseExists) throw new ApiError(404, "Course not found");

  const teacherExists = await Teacher.findById(createdBy);
  if (!teacherExists) throw new ApiError(404, "Teacher not found");

  // require file upload (req.file comes from multer memoryStorage)
  if (!req.file) throw new ApiError(400, "Assignment file is required");

  // upload to S3
  const uploadResult = await S3UploadHelper.uploadFile(req.file, "assignments");
  // uploadResult.key is the S3 key for the file
  const fileKey = uploadResult.key;

  // also create a signed url for immediate access (optional)
  const signedUrl = await getSignedUrlSafe(fileKey);

  const assignment = await Assignment.create({
    title,
    instructions,
    fileUrl: fileKey, // store S3 key in DB (not a local path)
    dueDate,
    course,
    createdBy,
  });

  // Response returns DB object + a temporary access url for convenience
  return res.status(201).json(
    new ApiResponse(201, { assignment, accessUrl: signedUrl }, "Assignment created successfully")
  );
});

// ---------------- Get All Assignments ----------------
export const getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find()
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("submissions.student", "name email");

  // Optionally: attach signed url for each file (async map)
  const assignmentsWithUrls = await Promise.all(
    assignments.map(async (a) => {
      const obj = a.toObject();
      obj.fileAccessUrl = await getSignedUrlSafe(obj.fileUrl);
      // each submission's fileAccessUrl
      if (Array.isArray(obj.submissions)) {
        obj.submissions = await Promise.all(
          obj.submissions.map(async (s) => {
            const sObj = { ...s };
            sObj.fileAccessUrl = await getSignedUrlSafe(sObj.fileUrl);
            return sObj;
          })
        );
      }
      return obj;
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, assignmentsWithUrls, "All assignments fetched successfully"));
});

// ---------------- Get Single Assignment ----------------
export const getAssignmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findById(id)
    .populate("course", "title")
    .populate("createdBy", "name email")
    .populate("submissions.student", "name email");

  if (!assignment) throw new ApiError(404, "Assignment not found");

  const result = assignment.toObject();
  result.fileAccessUrl = await getSignedUrlSafe(result.fileUrl);
  if (Array.isArray(result.submissions)) {
    result.submissions = await Promise.all(
      result.submissions.map(async (s) => {
        const sObj = { ...s };
        sObj.fileAccessUrl = await getSignedUrlSafe(sObj.fileUrl);
        return sObj;
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Assignment fetched successfully"));
});

// ---------------- Update Assignment ----------------
export const updateAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, instructions, dueDate } = req.body;

  const assignment = await Assignment.findById(id);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  if (title) assignment.title = title;
  if (instructions) assignment.instructions = instructions;
  if (dueDate) assignment.dueDate = dueDate;

  // If a new file is uploaded, upload to S3 and delete old file
  if (req.file) {
    // upload new file
    const uploadResult = await S3UploadHelper.uploadFile(req.file, "assignments");
    const newKey = uploadResult.key;

    // delete old file if exists (assignment.fileUrl stores old key)
    try {
      if (assignment.fileUrl) {
        await S3UploadHelper.deleteFile(assignment.fileUrl);
      }
    } catch (err) {
      // log but don't block update
      console.error("Failed to delete old assignment file from S3:", err);
    }

    assignment.fileUrl = newKey;
  }

  await assignment.save();

  // Return assignment + signed url
  const assignmentObj = assignment.toObject();
  assignmentObj.fileAccessUrl = await getSignedUrlSafe(assignmentObj.fileUrl);

  return res
    .status(200)
    .json(new ApiResponse(200, assignmentObj, "Assignment updated successfully"));
});

// ---------------- Delete Assignment ----------------
export const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  // delete file from S3 if exists
  try {
    if (assignment.fileUrl) {
      await S3UploadHelper.deleteFile(assignment.fileUrl);
    }

    // delete submission files as well (if stored)
    if (Array.isArray(assignment.submissions)) {
      for (const s of assignment.submissions) {
        if (s.fileUrl) {
          try {
            await S3UploadHelper.deleteFile(s.fileUrl);
          } catch (err) {
            console.error("Failed to delete submission file:", err);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error deleting files from S3 during assignment delete:", err);
    // proceed — deletion of db doc was successful
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Assignment deleted successfully"));
});

// ---------------- Submit Assignment (Student) ----------------
export const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, studentId } = req.body;

  if (!assignmentId || !studentId) throw new ApiError(400, "Required fields are missing");

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) throw new ApiError(404, "Assignment not found");

  if (new Date() > assignment.dueDate) throw new ApiError(400, "Cannot submit after due date");

  const alreadySubmitted = assignment.submissions.find(
    (s) => s.student.toString() === studentId
  );
  if (alreadySubmitted) throw new ApiError(400, "Student has already submitted");

  if (!req.file) throw new ApiError(400, "Submission file is required");

  // upload student submission to S3
  const uploadResult = await S3UploadHelper.uploadFile(req.file, "submissions");
  const submissionKey = uploadResult.key;
  const signedUrl = await getSignedUrlSafe(submissionKey);

  const newSubmission = { student: studentId, fileUrl: submissionKey, submittedAt: new Date() };
  assignment.submissions.push(newSubmission);
  await assignment.save();

  // return the new submission with an access URL for immediate download
  const returned = { ...newSubmission };
  returned.fileAccessUrl = signedUrl;

  return res
    .status(200)
    .json(new ApiResponse(200, returned, "Assignment submitted successfully"));
});