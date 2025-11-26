import React from "react";
import { ArrowRight, Play, Star } from "lucide-react";
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-primary via-primary to-primary/90">

      {/* Animated background */}
      <div className="absolute top-16 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="flex flex-col justify-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-accent/40 w-fit mb-4">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-sm font-medium text-blue-900">
                #1 Learning Platform 2024
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-4 leading-tight">
              Transform Your
              <span className="text-yellow-400 block">Learning Journey</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-blue-900/80 mb-6 leading-relaxed max-w-xl">
              Welcome to our Learning Management System! Easily manage courses, track student progress,
              and enhance learning with interactive lessons, quizzes, and seamless communication tools.
            </p>

            {/* CTA Buttons */}
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <a
                href="/login" // redirect to your login page
                className="flex items-center justify-center bg-yellow-400 text-blue-900 hover:bg-yellow-300 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Login LMS Dashboards
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>

              <a
                href="https://www.youtube.com/watch?v=cwwAQUMrML0"  // <-- YouTube demo video
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-900/10 text-blue-900 hover:bg-blue-900/20 backdrop-blur-sm border border-blue-900/30 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </a>
            </div>
            </div>


            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/learning-management-system-educational-platform-he-7lT40XOkFvFSCsjoVCrIrVApnWgnXE.jpg"
                  alt="SkillSync Dashboard"
                  className="w-full  h-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
