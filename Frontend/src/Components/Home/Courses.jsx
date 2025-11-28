// src/Components/Courses.jsx
import React, { useState } from "react";

const courses = [
  {
    id: 4,
    title: "Web Development Bootcamp",
    instructor: "Michael Lee",
    lessons: 25,
    duration: "10h 30m",
    media:
      "https://res.cloudinary.com/highereducation/images/f_auto,q_auto/w_632,h_400,c_fill,f_auto,fl_lossy,q_auto,g_face/v1687468748/ComputerScience.org/women-working-together-on-coding/women-working-together-on-coding.jpg?_i=AA",
  },
  {
    id: 5,
    title: "Data Science Essentials",
    instructor: "Sarah Kim",
    lessons: 18,
    duration: "7h 45m",
    media:
      "https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/09/data-scientist.jpg.optimal.jpg",
  },
  {
    id: 3,
    title: "Python for Beginners",
    instructor: "Alice Johnson",
    lessons: 15,
    duration: "5h 15m",
    media:
      "https://media.istockphoto.com/id/1411478027/photo/happy-college-student-taking-notes-on-computer-class-and-looking-at-camera.jpg?s=612x612&w=0&k=20&c=zKv3gNes4Ejaz0M5zz3gxvHsWtDIxovfBKGnA2ftQjU=",
  },
  {
    id: 1,
    title: "Introduction to UI Design",
    instructor: "Jane Doe",
    lessons: 12,
    duration: "3h 45m",
    media:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Advanced React Course",
    instructor: "John Smith",
    lessons: 20,
    duration: "8h 30m",
    media:
      "https://img.freepik.com/premium-photo/computer-lab-with-computers-inside-glass-divider-style-blurred-imagery_921860-44948.jpg",
  },
  {
    id: 6,
    title: "Digital Marketing Mastery",
    instructor: "David Thompson",
    lessons: 20,
    duration: "8h 15m",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS32Gewkf1WyovTqKFYOuYSJvJfghLsylA6tQ&s",
  },
];

export default function Courses() {
  const [current, setCurrent] = useState(0);

  // Group courses into chunks of 3 (1 full slide)
  const chunkedCourses = [];
  for (let i = 0; i < courses.length; i += 3) {
    chunkedCourses.push(courses.slice(i, i + 3));
  }

  const prevSlide = () => {
    setCurrent((curr) =>
      curr === 0 ? chunkedCourses.length - 1 : curr - 1
    );
  };

  const nextSlide = () => {
    setCurrent((curr) =>
      curr === chunkedCourses.length - 1 ? 0 : curr + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-blue-900 relative">
      <h2 className="text-3xl font-bold mb-8 text-white">Our Courses</h2>

      <div className="relative overflow-hidden">
        {/* Slider */}
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {chunkedCourses.map((group, index) => (
            <div
              key={index}
              className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-3"
            >
              {group.map((course) => (
                <div
                  key={course.id}
                  className="
                    bg-white rounded-3xl shadow-md 
                    overflow-hidden hover:-translate-y-2 
                    transition-all duration-300
                  "
                >
                  <img
                    src={course.media}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-3xl"
                  />

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-blue-900">
                      {course.title}
                    </h3>

                    <p className="text-yellow-400 text-sm mb-1">
                      by {course.instructor}
                    </p>

                    <div className="flex justify-between text-blue-900/60 text-sm">
                      <span>{course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {chunkedCourses.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-yellow-400 scale-125"
                  : "bg-gray-300"
              }`}
              onClick={() => setCurrent(index)}
            ></button>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="
            absolute top-1/2 left-0 -translate-y-1/2
            p-3 rounded-full bg-yellow-400 text-blue-900
            shadow-md hover:bg-yellow-300 hover:scale-110
            transition-all
          "
        >
          &#8592;
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="
            absolute top-1/2 right-0 -translate-y-1/2
            p-3 rounded-full bg-yellow-400 text-blue-900
            shadow-md hover:bg-yellow-300 hover:scale-110
            transition-all
          "
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
