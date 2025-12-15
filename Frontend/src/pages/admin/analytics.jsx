import React, { useEffect, useMemo } from "react";
import useStudentStore from "../../store/student/useStudentStore";
import useTeacherStore from "../../store/Teacher/teacherstore";
import useCourseStore from "../../store/courses/useCourse"; 

// RECHARTS
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// --- Color Palette ---
const PRIMARY_COLOR = "#4c51bf"; // Indigo-700
const ACCENT_COLOR_1 = "#4ade80"; // Green-400 (for Students)
const ACCENT_COLOR_2 = "#fde047"; // Yellow-400 (for Teachers)
const ACCENT_COLOR_3 = "#ef4444"; // Red-500 (for Courses) 
const BG_COLOR = "#f9fafb"; // Gray-50

// --- Custom Recharts Tooltip Component ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-xl text-sm">
        <p className="font-bold text-base mb-1 text-gray-700">{`Month: ${label}`}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.stroke }} className="font-medium">
            {`${p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
// ---------------------------------------------

const AnalyticsDashboard = () => {
  const { students, fetchStudents, loading: studentLoading } = useStudentStore();
  const { teachers, fetchTeachers, loading: teacherLoading } = useTeacherStore();
  const { courses, fetchCourses, loading: courseLoading } = useCourseStore(); // Included courses

  // Combine all loading states
  const loading = studentLoading || teacherLoading || courseLoading; 

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchCourses();
  }, [fetchStudents, fetchTeachers, fetchCourses]); // Added dependencies for useEffect

  // Monthly data calculation now includes courses
  const monthlyGrowth = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return months.map((month, index) => ({
      month,
      students: students.filter(s => new Date(s.createdAt).getMonth() === index).length,
      teachers: teachers.filter(t => new Date(t.createdAt).getMonth() === index).length,
      // 🆕 Calculate monthly course creation
      courses: courses.filter(c => new Date(c.createdAt).getMonth() === index).length, 
    }));
  }, [students, teachers, courses]); // Added 'courses' as a dependency


  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-indigo-700 text-2xl font-semibold bg-gray-50">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading Analytics...
      </div>
    );


  return (
    <div className={`min-h-screen p-10 ${BG_COLOR}`}>

      {/* --- Header Section --- */}
      <div className="mb-10 border-b pb-4 border-gray-200">
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center">
          <span className="mr-3 text-blue-900"></span> Monthly Growth Dashboard
        </h1>
        <p className="text-yellow-400 mt-1">
          Visualizing the monthly creation trend for Students, Teachers, and Courses.
        </p>
      </div>
      
      {/* --- Chart Section --- */}
      {/* ⚠️ Metric Cards Section has been removed as requested. */}
      <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <h2 className="text-2xl font-extrabold mb-6 text-blue-900 border-b pb-3">
           Monthly Creation Trend (Students, Teachers, & Courses)
        </h2>

        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={monthlyGrowth} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke={PRIMARY_COLOR} tickLine={false} />
            <YAxis stroke={PRIMARY_COLOR} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            <Line 
              type="monotone" 
              dataKey="students" 
              stroke={ACCENT_COLOR_1} 
              strokeWidth={3} 
              dot={{ stroke: ACCENT_COLOR_1, strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="teachers" 
              stroke={ACCENT_COLOR_2} 
              strokeWidth={3} 
              dot={{ stroke: ACCENT_COLOR_2, strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 8 }}
            />
            {/* 🆕 Line for Courses */}
            <Line 
              type="monotone" 
              dataKey="courses" 
              stroke={ACCENT_COLOR_3} 
              strokeWidth={3} 
              dot={{ stroke: ACCENT_COLOR_3, strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;