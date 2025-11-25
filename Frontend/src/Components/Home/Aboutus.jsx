import React from "react";
import { motion } from "framer-motion";

export default function AboutUsSection() {
  const items = [
    "Quality Education",
    "Modern Campus",
    "Experienced Faculty",
    "Research & Innovation",
    "Student Support"
  ];

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14">

        {/* LEFT SIDE — CARDS */}
        <div className="flex flex-col gap-8 relative">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold text-blue-900 mb-4"
          >
            About Us
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-900/70 text-lg"
          >
            A next-generation learning platform designed to provide students with 
            a modern, accessible, and technology-driven educational experience.
          </motion.p>

          {/* Top Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-blue-900 text-white border border-yellow-400/40 rounded-2xl shadow-xl backdrop-blur-lg"
          >
            1. {items[0]}
          </motion.div>

          {/* Middle Two Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[items[1], items[2]].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.2 }}
                className="p-6 bg-yellow-400 text-white border border-yellow-400 rounded-2xl shadow-xl backdrop-blur-lg"
              >
                {i + 2}. {text}
              </motion.div>
            ))}
          </div>

          {/* Bottom Left Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 bg-blue-900 text-white border border-yellow-400/40 rounded-2xl shadow-xl backdrop-blur-lg w-3/4"
          >
            4. {items[3]}
          </motion.div>

          {/* Bottom Right Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="p-6 bg-yellow-400 text-white border border-yellow-400/40 rounded-2xl shadow-xl backdrop-blur-lg w-2/3 self-end"
          >
            5. {items[4]}
          </motion.div>
        </div>

        {/* RIGHT SIDE — 3 IMAGE GRID */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-4 h-[500px]"
        >
          {/* Left Half Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="col-span-1 row-span-2 overflow-hidden shadow-xl rounded-3xl"
          >
            <img src="/lms1.jpg" className="w-full h-full object-cover" />
          </motion.div>

          {/* Right Top */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="col-span-1 row-span-1 overflow-hidden shadow-xl rounded-3xl"
          >
            <img src="/lms2.jpg" className="w-full h-full object-cover" />
          </motion.div>

          {/* Right Bottom */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="col-span-1 row-span-1 overflow-hidden shadow-xl rounded-3xl"
          >
            <img src="/lms3.jpg" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
