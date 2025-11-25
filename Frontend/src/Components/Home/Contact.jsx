import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactUs() {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    setTimeout(() => setAnimate(true), 150);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please fill in all fields!", {
        icon: "⚠️",
      });
      return;
    }

    // Optional: send data to backend here

    toast.success("Message sent successfully!", {
      icon: "💬", // custom icon for LMS theme
    });

    // Clear form
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="w-full py-20 bg-gray-100">
      {/* Toast container with project theme */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#FACC15", // yellow-400
            color: "#1E3A8A", // blue-900
            borderRadius: "12px",
            padding: "16px 24px",
            fontWeight: "bold",
          },
        }}
      />

      <div
        className={`bg-grey-100 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 transition-all duration-700 ease-out 
        ${animate ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
      >
        {/* LEFT SIDE — Info Card */}
        <div className="p-8 rounded-3xl border border-yellow-400/50 bg-gray-100 backdrop-blur-xl shadow-xl">
          <h2 className="text-4xl font-bold text-blue-900">
            Contact <span className="text-yellow-400">Us</span>
          </h2>
          <p className="mt-3 text-blue-900/70">
            Reach out for admissions, campus info, or general inquiries.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/40 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 font-semibold text-2xl">📍</span>
              </div>
              <div>
                <p className="text-sm text-blue-900/60">Address</p>
                <p className="font-medium text-blue-900">
                  123 College Avenue, Lahore
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/40 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 font-semibold text-2xl">📞</span>
              </div>
              <div>
                <p className="text-sm text-blue-900/60">Phone</p>
                <p className="font-medium text-blue-900">‪+92 300 1234567‬</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/40 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 font-semibold text-2xl">📧</span>
              </div>
              <div>
                <p className="text-sm text-blue-900/60">Email</p>
                <p className="font-medium text-blue-900">
                  admissions@college.edu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl border border-yellow-400/50 bg-gray-100 backdrop-blur-xl shadow-xl flex flex-col gap-5"
        >
          <h3 className="text-3xl font-semibold text-blue-900">
            Send a <span className="text-yellow-400">Message</span>
          </h3>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-blue-900/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition bg-white text-blue-900 placeholder-blue-900/50"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-blue-900/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition bg-white text-blue-900 placeholder-blue-900/50"
          />

          <textarea
            name="message"
            rows={4}
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-blue-900/30 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none transition bg-white text-blue-900 placeholder-blue-900/50"
          ></textarea>

          <button
            type="submit"
            className="mt-2 bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-blue-900 transition-all shadow-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
