import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ correct for React Router
import api from "../../store/axiosInstance";
import SpinnerCustom from "../../Components/ui/spinner";

export default function AdminLogoutPage() {
  const navigate = useNavigate();  // ✅ correct hook
  const [loggingOut, setLoggingOut] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Backend → delete cookie
        await api.post("/admin/logout-admin", {}, { withCredentials: true });

        // Frontend → clear local storage/session
        localStorage.removeItem("adminAuth");
        sessionStorage.clear();

        // Redirect after 1 sec
        setTimeout(() => {
          navigate("/login", { replace: true });  // ✅ block back button
        }, 1000);

      } catch (err) {
        console.error("Logout failed:", err);
        setError("Logout failed — please try again.");
        setLoggingOut(false);
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-sm text-center border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-blue-900">Logging Out</h2>

        {loggingOut ? (
          <>
            <SpinnerCustom />
            <p className="text-gray-600 mt-3">Ending your session...</p>
          </>
        ) : error ? (
          <>
            <p className="text-red-600 font-semibold mt-3">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-yellow-500 text-blue-900 py-2 px-6 rounded-lg mt-4 font-bold hover:bg-yellow-400"
            >
              Go to Login
            </button>
          </>
        ) : (
          <p className="text-green-700 font-medium">Logout successful…</p>
        )}
      </div>
    </div>
  );
}
