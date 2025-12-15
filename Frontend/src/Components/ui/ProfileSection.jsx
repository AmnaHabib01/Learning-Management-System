import React, { useEffect, useState } from "react";
import api from "../../store/axiosInstance";
import { SpinnerCustom } from "../ui/spinner";
import { X } from "lucide-react";

export default function ProfileSection({ onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/admin/profile", { withCredentials: true });
        setUser(data.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response || err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Auto close after 30 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 30000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post("/admin/logout-admin", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err.response || err);
      setLoggingOut(false);
    }
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-xl flex flex-col md:flex-row items-center gap-6 relative">
  {/* Close Button (only show after loading) */}
  {!loading && (
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      <X className="w-6 h-6" />
    </button>
  )}

  {loading ? (
    <div className="flex flex-col items-center gap-2 py-10 w-full">
      <SpinnerCustom />
      <span className="text-gray-700 font-semibold">Loading profile...</span>
    </div>
  ) : user ? (
    <>
      {/* Profile Image */}
      <div className="shrink-0">
        <img
          src={user.profileImageUrl || "default-profile-icon.svg"}
          alt="Admin Profile"
          className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 object-cover shadow-xl transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-1">{user.name}</h2>
          <span className="inline-block px-4 py-1 rounded-full bg-yellow-400 text-blue-900 font-bold text-sm md:text-base uppercase tracking-wider shadow-md">
            {user.role || "Admin"}
          </span>
        </div>

        {/* Email */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-3 bg-gray-50 rounded-xl shadow-inner">
          <span className="text-gray-500 font-medium mb-1 md:mb-0">Email:</span>
          <span className="text-blue-900 font-semibold wrap-break-word">{user.email || "N/A"}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full md:w-auto flex items-center justify-center bg-blue-900 text-yellow-400 py-2 px-6 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-2xl disabled:opacity-50"
        >
          {loggingOut ? (
            <div className="flex items-center gap-3">
              <SpinnerCustom />
              Logging out...
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-2 0V4H5v12h10V14a1 1 0 112 0v3a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm9.364 8.636a1 1 0 001.414 0l3-3a1 1 0 000-1.414l-3-3a1 1 0 00-1.414 1.414L13.586 9H7a1 1 0 100 2h6.586l-1.222 1.222a1 1 0 000 1.414z" clipRule="evenodd" />
              </svg>
              Log Out
            </>
          )}
        </button>
      </div>
    </>
  ) : (
    <p className="text-red-600 font-semibold">Could not load profile data.</p>
  )}
</div>
  );
}
