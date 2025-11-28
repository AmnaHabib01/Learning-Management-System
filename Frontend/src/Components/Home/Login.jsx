
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Shield, GraduationCap, UserCheck, Loader2, ArrowLeftCircle, Briefcase } from "lucide-react";
import userAuth from "../../store/auth/login";
import api from "../../store/axiosInstance";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [forgotMode, setForgotMode] = useState(false); // NEW: forgot password mode
    const [forgotMessage, setForgotMessage] = useState("");

    const navigate = useNavigate();
    const setUser = userAuth((state) => state.setUser);

    const endpointMap = {
        student: "/auth/login",
        teacher: "/teacher/login-teacher",
        admin: "/admin/login-admin",
    };

    const forgotEndpointMap = {
        student: "/auth/forgot-password",
        teacher: "/teacher/forgot-password-mail",
        admin: "/admin/forgot-password-mail",
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post(endpointMap[role], { email, password });
            const { user, token } = res.data;
            setUser(user, token, role);
            navigate(`/${role}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setForgotMessage("Please enter your email first");
            return;
        }
        setLoading(true);
        setForgotMessage("");
        try {
            const res = await api.post(forgotEndpointMap[role], { email });
            setForgotMessage(res.data.message || "Password reset link sent!");
        } catch (err) {
            setForgotMessage(err.response?.data?.message || "Failed to send reset link.");
        } finally {
            setLoading(false);
        }
    };

    // Role Selection Popup
    if (!role) {
        const roles = [
            { key: "student", label: "Student", desc: "Access courses & assignments", icon: <GraduationCap size={32} /> },
            { key: "teacher", label: "Teacher", desc: "Manage classes & grades", icon: <UserCheck size={32} /> },
            { key: "admin", label: "Admin", desc: "Full system dashboard access", icon: <Shield size={32} /> },
        ];

        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br  p-4">
                <div className="bg-blue-950 backdrop-blur-md p-8 md:p-16 rounded-3xl shadow-2xl max-w-4xl w-full animate-fade-in border-t-8 border-yellow-500">
                    <h2 className="text-4xl lg:text-5xl font-black mb-14 text-white text-center tracking-tighter">
                        <span className="text-yellow-500">Global Tech</span>: Select Your Role
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
                        {roles.map((r) => (
                            <div
                                key={r.key}
                                onClick={() => setRole(r.key)}
                                className="cursor-pointer bg-gray-700 rounded-xl shadow-xl p-8 text-center text-white 
                                           transition-all duration-500 transform hover:scale-[1.05] hover:shadow-2xl hover:bg-gray-600 border-b-4 border-transparent hover:border-yellow-500/80 group"
                            >
                                <div className="flex justify-center mb-5 text-yellow-500">
                                    <div className="p-4 bg-gray-600/50 rounded-full group-hover:bg-yellow-500/20 transition-colors duration-300">
                                        {r.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-extrabold capitalize mb-2 tracking-wide">{r.label}</h3>
                                <p className="text-gray-300 text-sm">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-400 mt-12 text-sm font-medium">
                        Choose your corresponding profile to proceed to the secure login.
                    </p>
                </div>
            </div>
        );
    }

    // Login Form Split Card
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br p-4">
            <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">

                {/* Left Side Visual */}
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-blue-950 text-white relative overflow-hidden rounded-l-3xl">
                    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="dot-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="0.5" fill="#3B82F6" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
                    </svg>
                    <div className="relative z-10">
                        <button
                            type="button"
                            onClick={() => setRole("")}
                            className="text-gray-300 hover:text-yellow-500 transition-colors flex items-center text-sm font-medium mb-10"
                        >
                            <ArrowLeftCircle size={18} className="mr-2" />
                            Back to Role Selection
                        </button>
                    </div>

                    <div className="relative z-10 mb-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="p-3 bg-yellow-500 rounded-full shadow-lg">
                                {role === 'student' ? <GraduationCap size={32} className="text-blue-950" /> :
                                 role === 'teacher' ? <UserCheck size={32} className="text-blue-950" /> :
                                 role === 'admin' ? <Shield size={32} className="text-blue-950" /> :
                                 <Briefcase size={32} className="text-blue-950" />}
                            </div>
                            <span className="text-2xl font-extrabold capitalize text-yellow-500">{role} Access</span>
                        </div>
                        <h1 className="text-5xl font-black leading-tight mt-4">
                            Connect <span className="text-yellow-500">&</span> Grow
                        </h1>
                        <p className="text-gray-300 mt-3 text-lg">
                            Your personalized gateway to the Global Tech system. Secure login for focused learning and management.
                        </p>
                    </div>
                </div>

                {/* Right Side Login Form */}
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    {forgotMode ? (
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 text-center mb-8 tracking-tight">
                                Reset <span className="text-yellow-500">Password</span>
                            </h2>

                            {forgotMessage && (
                                <div className="bg-green-500/10 text-green-700 p-3 rounded-xl text-center font-medium shadow-sm border border-green-500/30 text-sm">
                                    {forgotMessage}
                                </div>
                            )}

                            <div className="relative group">
                                <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-950 transition-colors duration-300" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-12 py-3.5 text-gray-800 border-b-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white transition duration-300 shadow-inner"
                                />
                            </div>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleForgotPassword}
                                className={`w-full py-4 mt-8 font-extrabold rounded-xl text-blue-950 text-lg transition-all duration-300 shadow-xl tracking-wider uppercase
                                    ${loading
                                        ? "bg-yellow-400/80 cursor-not-allowed"
                                        : "bg-yellow-500 hover:bg-blue-950 hover:text-white transform hover:scale-[1.01]"
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-2" size={20} /> Sending...
                                    </span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 pt-2 cursor-pointer hover:text-yellow-500"
                               onClick={() => setForgotMode(false)}>
                                Back to Login
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 text-center mb-8 tracking-tight">
                                {role.charAt(0).toUpperCase() + role.slice(1)} <span className="text-yellow-500">Login</span>
                            </h2>

                            {error && (
                                <div className="bg-red-500/10 text-red-700 p-3 rounded-xl text-center font-medium shadow-sm border border-red-500/30 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="relative group">
                                <User className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-950 transition-colors duration-300" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full px-12 py-3.5 text-gray-800 border-b-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white transition duration-300 shadow-inner"
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-950 transition-colors duration-300" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className="w-full px-12 py-3.5 text-gray-800 border-b-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-yellow-500 bg-white transition duration-300 shadow-inner"
                                />
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-gray-500 hover:text-blue-950 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <div className="text-right pt-1">
                                <button
                                    type="button"
                                    className="text-sm text-blue-950 hover:text-yellow-500 transition-colors font-medium"
                                    onClick={() => setForgotMode(true)}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 mt-8 font-extrabold rounded-xl text-blue-950 text-lg transition-all duration-300 shadow-xl tracking-wider uppercase
                                  ${loading
                                      ? "bg-yellow-400/80 cursor-not-allowed"
                                      : "bg-yellow-500 hover:bg-blue-950 hover:text-white transform hover:scale-[1.01]"
                                  }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-2" size={20} /> Authenticating...
                                    </span>
                                ) : (
                                    "Log In"
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-500 pt-2">
                                Need help? Contact support or register a new account.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

