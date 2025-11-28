import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Home from "../admin/Home"
import Students from "../admin/Students";
import ProfileSection from "../../Components/ui/ProfileSection"; // adjust path as needed
import {
    FiUser,
    FiBell,
    FiHome,
    FiBookOpen,
    FiUsers,
    FiBarChart2,
    FiLogOut,
    FiMenu,
    FiSearch,
    FiSettings,
} from "react-icons/fi";

const renderContent = (activeItem) => {
    switch (activeItem) {
        case "Home":
            return <Home />;
        case "Students":
            return <Students />;
        case "Teachers":
            return <Teachers />;
        case "Courses":
            return <Courses />;
        case "Analytics":
            return <Analytics />;
        case "Notifications":
            return <Notifications />;
        case "Settings":
            return <Settings />;
        case "Logout":
            return <div>Logging out...</div>;
        default:
            return <Home />;
    }
};

export default function StudentDashboard() {
    const mainItems = [
        { name: "Home", icon: <FiHome /> },
        { name: "Course", icon: <FiUsers /> },
        { name: "Assignments", icon: <FiUser /> },
        { name: "Quizez", icon: <FiBookOpen /> },
        { name: "Notifications", icon: <FiBell /> },
        { name: "Settings", icon: <FiSettings /> },
        { name: "Logout", icon: <FiLogOut /> },
    ];

    const [activeItem, setActiveItem] = useState("Home");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMainItems = mainItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [showProfile, setShowProfile] = useState(false);
    return (
        <div className="flex h-screen overflow-hidden">
            {/* LEFT SIDEBAR */}
            <div
                className={`${sidebarCollapsed ? "w-15" : "w-55"
                    } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
            >
                {/* Logo + Hamburger */}
                <div className="h-13 flex items-center justify-between px-4 border-b border-gray-200">
                    {!sidebarCollapsed && (
                        <img src="/logo1.png" alt="College Logo" className="h-12 w-auto" />
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded hover:bg-yellow-400 hover:text-blue-900 transition-colors"
                    >
                        <FiMenu className="text-xl text-gray-700" />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 flex flex-col justify-between px-1 py-2">
                    <div className="flex flex-col gap-1">
                        {filteredMainItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveItem(item.name)}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors font-medium
                  ${activeItem === item.name
                                        ? "bg-blue-900 text-yellow-400"
                                        : "text-gray-800 hover:bg-blue-900 hover:text-yellow-400"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {!sidebarCollapsed && item.name}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                {/* TOP BAR */}
                <div className="h-13 bg-white border-b border-gray-200 flex items-center justify-between px-4">
                    <div className="flex items-center gap-4 flex-1">
                        <h2 className="text-xl font-bold text-blue-900 whitespace-nowrap">
                            Student Dashboard
                        </h2>
                        <div className="relative flex-1 max-w-[250px] ml-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-2 py-1.5 rounded-full border border-gray-300 focus:border-blue-900 focus:ring-1 focus:ring-blue-900 outline-none text-gray-700 placeholder-blue-900 transition-all duration-300 ease-in-out
      hover:shadow-sm hover:border-blue-700"
                            />
                            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-900 transition-colors group-focus:text-blue-900" />
                        </div>
                        <button className="fixed bottom-6 right-6 bg-linear-to-r from-blue-900 to-purple-600 text-white px-6 py-4 rounded-full shadow-lg text-lg font-semibold animate-pulse hover:scale-110 transition-transform duration-300 ring-4 ring-blue-300 ring-opacity-30">
                            Chat AI 💬
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 rounded-full hover:bg-gray-400 hover:text-yellow-400 transition-colors">
                            <FiBell className="text-gray-700 text-xl" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full"></span>
                        </button>
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="p-2 rounded-full hover:bg-yellow-400 hover:text-blue-900 transition-colors relative"
                        >
                            <FiUser className="text-gray-700 text-xl" />
                        </button>

                    </div>
                </div>
                {showProfile && (
                    <div className="absolute top-16 right-4 z-50">
                        <ProfileSection
                            user={{
                                name: "John Doe",
                                email: "john.doe@example.com",
                                role: "Admin",
                                profileImage: "", // leave empty to use default
                            }}
                        />
                    </div>
                )}



                {/* INNER CONTENT */}
                <div className="flex-1 bg-gray-100 p-1 overflow-auto">
                    <div className="h-full rounded-b-md bg-white shadow-lg flex items-center justify-center text-gray-700 font-semibold text-2xl m-0">
                        {renderContent(activeItem)}
                    </div>
                </div>
            </div>
        </div>
    );
}
