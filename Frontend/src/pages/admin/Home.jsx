import React, { useState, useEffect } from 'react';
import { FaBell, FaUserGraduate, FaChalkboardTeacher, FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
  const [time, setTime] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Welcome Banner */}
      <section className="relative flex items-center bg-yellow-300 rounded-xl overflow-hidden shadow-lg mb-10">
        <div className="p-8 z-10 text-white max-w-lg">
          <h1 className="text-5xl font-extrabold mb-3">
            Welcome, Admin!
          </h1>
          <p className="text-lg">
            Manage your college efficiently with our smart dashboard.
          </p>
        </div>
        
      </section>

      {/* Top Bar: Clock and Notifications */}
      <div className="flex justify-between items-center mb-10">
        {/* Clock Card */}
        <div className="bg-linear-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg rounded-lg px-6 py-4 w-44 text-center text-white font-mono font-semibold text-xl">
          {time.toLocaleTimeString()}
        </div>

        {/* Notifications */}
        
      </div>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Students */}
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="p-4 bg-white rounded-full text-pink-600 shadow-md">
            <FaUserGraduate size={36} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Students Enrolled</p>
            <p className="text-3xl font-bold text-white">1,248</p>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="p-4 bg-white rounded-full text-green-600 shadow-md">
            <FaChalkboardTeacher size={36} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Active Teachers</p>
            <p className="text-3xl font-bold text-white">92</p>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="p-4 bg-white rounded-full text-yellow-600 shadow-md">
            <FaClipboardList size={36} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Courses Available</p>
            <p className="text-3xl font-bold text-white">35</p>
          </div>
        </div>

        {/* Events */}
        <div className="bg-blue-900 rounded-xl shadow-lg p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform cursor-pointer">
          <div className="p-4 bg-white rounded-full text-purple-600 shadow-md">
            <FaCalendarAlt size={36} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Upcoming Events</p>
            <p className="text-3xl font-bold text-white">5</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
