import React, { useEffect, useMemo } from "react";
import useStudentStore from "../../store/student/useStudentStore";
import useTeacherStore from "../../store/Teacher/teacherstore";
import useCourseStore from "../../store/courses/useCourse";

// --- Styling Constants ---
const PRIMARY_BLUE = "#1e3a8a"; // Blue-900 for main theme/success
const WARNING_YELLOW = "#fbbf24"; // Yellow-400 for warnings
const CARD_BG = "#ffffff";
const PAGE_BG = "#f9fafb"; 

// --- Heroicons Components for LMS ---
const IconUserPlus = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h-3m3 3h-3m-8 2.25H5.25a1.125 1.125 0 0 1-1.125-1.125V11.25H11m4.5 1.75l-4.5 4.5m4.5-4.5h-8m-4.5 0v-3.75c0-1.242 1.008-2.25 2.25-2.25h12.129a1.125 1.125 0 0 1 1.125 1.125v4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15.75c0-2.203-1.797-4-4-4s-4 1.797-4 4 1.797 4 4 4 4-1.797 4-4z" />
    </svg>
); // New Student / Pending Verification

const IconBriefcase = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.75l-7.5 7.5m0-7.5l-7.5 7.5M10.75 3h4.5a1 1 0 011 1v2a1 1 0 01-1 1h-4.5a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.5h-15a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h15a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75z" />
    </svg>
); // New Teacher

const IconBookOpen = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21L3 17.25V7.5L12 3l9 4.5v9.75L12 21z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V17.25M21 7.5V17.25M12 3V21M12 12.75L3 17.25" />
    </svg>
); // New Course

const NotificationPage = () => {
    // ... (Zustand store imports and useEffect remain unchanged) ...
    const { students, fetchStudents, loading: studentLoading } = useStudentStore();
    const { teachers, fetchTeachers, loading: teacherLoading } = useTeacherStore();
    const { courses, fetchCourses } = useCourseStore();

    useEffect(() => {
        fetchStudents();
        fetchTeachers();
        fetchCourses();
    }, [fetchStudents, fetchTeachers, fetchCourses]);

    // Filter unverified users (unchanged logic)
    const unverifiedUsers = useMemo(() => {
        const isUnverified = (user) => {
            if (user.role === "student") {
                return user.studentIsVerified === false || !user.studentIsVerified;
            } else if (user.role === "teacher") {
                return user.teacherIsVerified === false || !user.teacherIsVerified;
            }
            return false;
        };

        const unverifiedStudents = students
            .filter(isUnverified)
            .map((s) => ({
                id: `student-${s._id}`,
                name: s.name || "Unknown Student",
                email: s.email,
                type: "Student",
                date: new Date(s.createdAt || Date.now()),
            }));

        const unverifiedTeachers = teachers
            .filter(isUnverified)
            .map((t) => ({
                id: `teacher-${t._id}`,
                name: t.name || "Unknown Teacher",
                email: t.email,
                type: "Teacher",
                date: new Date(t.createdAt || Date.now()),
            }));

        return [...unverifiedStudents, ...unverifiedTeachers].sort(
            (a, b) => b.date.getTime() - a.date.getTime()
        );
    }, [students, teachers]);

    // Recent activity (TOP 4 only)
    const recentActivity = useMemo(() => {
        const now = new Date();
        const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;

        const getTimeAgo = (date) => {
            const seconds = Math.floor((now - new Date(date)) / 1000);
            if (seconds < 60) return `${seconds} seconds ago`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes} minutes ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours} hours ago`;
            const days = Math.floor(minutes / 60) / 24;
            return `${Math.round(days)} days ago`;
        };

        const activity = [];

        // STUDENT ACTIVITY 
        students.forEach((s) => {
            const createdAt = new Date(s.createdAt);
            if (createdAt.getTime() > oneDayAgo) {
                activity.push({
                    id: `s-${s._id}`,
                    type: "success",
                    icon: <IconUserPlus />,
                    title: "New Student Registered",
                    message: `${s.name || "A new student"} joined the platform.`,
                    time: getTimeAgo(createdAt),
                    date: createdAt,
                });
            }
        });

        // TEACHER ACTIVITY 
        teachers.forEach((t) => {
            const createdAt = new Date(t.createdAt);
            if (createdAt.getTime() > oneDayAgo) {
                activity.push({
                    id: `t-${t._id}`,
                    type: "info",
                    icon: <IconBriefcase />,
                    title: "New Teacher Onboarded",
                    message: `${t.name || "A new teacher"} is ready to create courses.`,
                    time: getTimeAgo(createdAt),
                    date: createdAt,
                });
            }
        });

        // COURSE ACTIVITY 
        courses.forEach((c) => {
            const createdAt = new Date(c.createdAt);
            if (createdAt.getTime() > oneDayAgo) {
                activity.push({
                    id: `c-${c._id}`,
                    type: "warning",
                    icon: <IconBookOpen />,
                    title: "New Course Created",
                    message: `Course **${c.name || `ID: ${c._id.substring(0, 8)}...`}** is now live.`,
                    time: getTimeAgo(createdAt),
                    date: createdAt,
                });
            }
        });

        return activity
            .sort((a, b) => b.date - a.date)
            .slice(0, 4);
    }, [students, teachers, courses]);

    const loading = studentLoading || teacherLoading;

    // --- Components ---

    // UPDATED: Now uses IconUserPlus for a sleek, consistent look
    const UnverifiedUserItem = ({ user }) => (
        <div className={`flex justify-between items-center p-5 rounded-xl shadow-lg transition-all border-l-4 border-yellow-400 bg-white hover:shadow-xl`}>
            <div className="flex items-center">
                {/* Use IconUserPlus for both pending Student and Teacher */}
                <span className="text-3xl mr-4 text-yellow-400">
                    <IconUserPlus />
                </span>
                <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>
            <span className="text-xs font-semibold text-yellow-400 bg-blue-900 px-3 py-1 rounded-full">
                VERIFICATION PENDING
            </span>
        </div>
    );

    // STYLISH Notification Card (Uses icon component)
    const NotificationItem = ({ data }) => {
        const typeClasses = {
            success: "border-l-4 border-blue-900 bg-white text-gray-800",
            info: "border-l-4 border-blue-900 bg-white text-gray-800",
            warning: "border-l-4 border-yellow-400 bg-white text-gray-800",
        };
        const iconColor = {
            success: "text-blue-900",
            info: "text-blue-900",
            warning: "text-yellow-400",
        };
        return (
            <div className={`p-4 rounded-xl shadow-md transition-shadow hover:shadow-lg ${typeClasses[data.type]}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <span className={`text-xl mr-3 ${iconColor[data.type]}`}>{data.icon || "💬"}</span>
                        <div>
                            <p className="font-semibold text-base">{data.title}</p>
                            <p className="text-sm text-gray-600">{data.message}</p>
                        </div>
                    </div>
                    {data.time && <p className="text-xs text-gray-400">{data.time}</p>}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center h-screen text-blue-900 text-2xl font-semibold ${PAGE_BG}`}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mr-3"></div>
                Loading Notifications...
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-8 lg:p-12 ${PAGE_BG}`}>
            
            <header className="mb-10">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 flex items-center">
                     Notifications
                </h1>
                <p className="text-lg text-gray-500 mt-1">
                    A centralized view of platform activity and necessary administrative actions.
                </p>
            </header>

            {/* Unverified Accounts Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <span className="mr-2 text-red-500"></span> Verification Pending ({unverifiedUsers.length})
                </h2>
                <div className="space-y-4">
                    {unverifiedUsers.length > 0 ? (
                        unverifiedUsers.map((user) => <UnverifiedUserItem key={user.id} user={user} />)
                    ) : (
                        <div className={`p-5 rounded-xl shadow-md ${CARD_BG} border-l-4 border-blue-900 text-blue-900`}>
                            <p className="font-semibold">All new accounts have been successfully verified. System is clean.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Activity Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 flex items-center">
                    <span className="mr-2 text-blue-900"></span> Recent Platform Activity (Top {recentActivity.length})
                </h2>
                <div className="space-y-4">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((notif) => <NotificationItem key={notif.id} data={notif} />)
                    ) : (
                        <div className={`p-5 rounded-xl shadow-md ${CARD_BG} border-l-4 border-gray-400 text-gray-700`}>
                            <p className="font-semibold">No significant activity reported in the last 24 hours.</p>
                        </div>
                    )}
                </div>
            </section>
            
        </div>
    );
};

export default NotificationPage;