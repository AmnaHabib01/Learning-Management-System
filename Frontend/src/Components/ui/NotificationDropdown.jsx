import React, { useEffect, useMemo } from "react";
import useStudentStore from "../../store/student/useStudentStore";
import useTeacherStore from "../../store/Teacher/teacherstore";
import useCourseStore from "../../store/courses/useCourse";
import { FiUserPlus, FiBriefcase, FiBookOpen } from "react-icons/fi";

const IconUserPlus = () => <FiUserPlus className="text-blue-900 text-xl" />;
const IconBriefcase = () => <FiBriefcase className="text-blue-900 text-xl" />;
const IconBookOpen = () => <FiBookOpen className="text-yellow-400 text-xl" />;

export default function NotificationDropdown({ onClose }) {
  const { students, fetchStudents } = useStudentStore();
  const { teachers, fetchTeachers } = useTeacherStore();
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchCourses();
  }, [fetchStudents, fetchTeachers, fetchCourses]);

  const recentActivity = useMemo(() => {
    const activity = [];

    students.forEach((s) => {
      if (!s.createdAt) return;
      activity.push({
        id: `s-${s._id}`,
        icon: <IconUserPlus />,
        title: "New Student",
        message: s.name || "A student joined",
        date: new Date(s.createdAt),
      });
    });

    teachers.forEach((t) => {
      if (!t.createdAt) return;
      activity.push({
        id: `t-${t._id}`,
        icon: <IconBriefcase />,
        title: "New Teacher",
        message: t.name || "A teacher joined",
        date: new Date(t.createdAt),
      });
    });

    courses.forEach((c) => {
      if (!c.createdAt) return;
      activity.push({
        id: `c-${c._id}`,
        icon: <IconBookOpen />,
        title: "New Course",
        message: c.name || "Course is live",
        date: new Date(c.createdAt),
      });
    });

    return activity.sort((a, b) => b.date - a.date).slice(0, 5);
  }, [students, teachers, courses]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day(s) ago`;
  };

  return (
    <div className="absolute top-12 right-0 w-96 max-h-80 overflow-y-auto bg-white rounded-xl shadow-md z-50 ring-1 ring-blue-900/10">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-blue-900/20">
        <h3 className="font-semibold text-blue-900">Notifications</h3>
        <button
          onClick={onClose}
          className="text-blue-900 hover:text-yellow-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Notification List */}
      <div className="flex flex-col divide-y divide-blue-900/10">
        {recentActivity.length > 0 ? (
          recentActivity.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-3 hover:bg-blue-900/5 rounded-md transition-all"
            >
              <div className="shrink-0">{n.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">{n.title}</p>
                <p className="text-blue-900/70 text-sm">{n.message}</p>
              </div>
              <span className="text-xs text-yellow-400">{formatTime(n.date)}</span>
            </div>
          ))
        ) : (
          <p className="p-3 text-blue-900/60 text-sm text-center">No notifications</p>
        )}
      </div>
    </div>
  );
}
