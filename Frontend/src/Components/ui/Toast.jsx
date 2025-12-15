import React, { useEffect } from "react";

export default function Toast({ message, type = "success", duration = 3000, onClose }) {
    // Auto close after duration
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) return null;

    const bgColor = type === "error" ? "bg-red-950" : "bg-blue-900";
    const textColor = type === "error" ? "text-yellow-400" : "text-yellow-400";

    return (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg ${bgColor} ${textColor} font-semibold`}>
            {message}
        </div>
    );
}
