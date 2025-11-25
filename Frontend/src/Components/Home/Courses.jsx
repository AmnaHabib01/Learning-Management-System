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
    type: "image",
  },
  {
    id: 5,
    title: "Data Science Essentials",
    instructor: "Sarah Kim",
    lessons: 18,
    duration: "7h 45m",
    media:
      "https://s44783.pcdn.co/in/wp-content/uploads/sites/3/2022/09/data-scientist.jpg.optimal.jpg",
    type: "image",
  },
  {
    id: 3,
    title: "Python for Beginners",
    instructor: "Alice Johnson",
    lessons: 15,
    duration: "5h 15m",
    media:
      "https://media.istockphoto.com/id/1411478027/photo/happy-college-student-taking-notes-on-computer-class-and-looking-at-camera.jpg?s=612x612&w=0&k=20&c=zKv3gNes4Ejaz0M5zz3gxvHsWtDIxovfBKGnA2ftQjU=",
    type: "image",
  },
  {
    id: 1,
    title: "Introduction to UI Design",
    instructor: "Jane Doe",
    lessons: 12,
    duration: "3h 45m",
    media:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    type: "image",
  },
  {
    id: 2,
    title: "Advanced React Course",
    instructor: "John Smith",
    lessons: 20,
    duration: "8h 30m",
    media:
      "https://img.freepik.com/premium-photo/computer-lab-with-computers-inside-glass-divider-style-blurred-imagery_921860-44948.jpg",
    type: "image",
  },
  {
    id: 6,
    title: "Digital Marketing Mastery",
    instructor: "David Thompson",
    lessons: 20,
    duration: "8h 15m",
    media:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS32Gewkf1WyovTqKFYOuYSJvJfghLsylA6tQ&s",
    type: "image",
  },
];

const Courses = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? courses.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === courses.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blue-900 relative">
      <h2 className="text-3xl font-bold mb-6 text-white">Our Courses</h2>

      <div className="relative overflow-visible">
        {/* Slider */}
        <div
          className="flex transition-transform duration-500 overflow-visible"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="shrink-0 w-full sm:w-1/2 md:w-1/3 px-3 pb-4 overflow-visible"
            >
              <div
                className="
                  bg-white
                  backdrop-blur-xl
                  rounded-3xl
                  shadow-md
                  overflow-visible
                  transition-all duration-300
                  hover:shadow-lg hover:-translate-y-3
                "
              >
                {course.type === "image" ? (
                  <img
                    src={course.media}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-3xl"
                  />
                ) : (
                  <video
                    src={course.media}
                    className="w-full h-48 object-cover rounded-t-3xl"
                    controls
                  />
                )}

                <div className="p-5">
                  <h3 className="text-xl font-bold text-blue-900">
                    {course.title}
                  </h3>
                  <p className="text-yellow-400 font-medium text-sm mb-2">
                    by {course.instructor}
                  </p>

                  <div className="flex justify-between text-blue-900/60 text-sm">
                    <span>{course.lessons} lessons</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-5 space-x-2">
          {courses.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current ? "bg-yellow-400 scale-125" : "bg-gray-300"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="
            absolute top-1/2 left-0 -translate-y-1/2
            p-3 rounded-full
            bg-yellow-400 text-blue-900
            shadow-md
            hover:bg-yellow-300 hover:scale-110
            transition-all
          "
        >
          &#8592;
        </button>

        <button
          onClick={nextSlide}
          className="
            absolute top-1/2 right-0 -translate-y-1/2
            p-3 rounded-full
            bg-yellow-400 text-blue-900
            shadow-md
            hover:bg-yellow-300 hover:scale-110
            transition-all
          "
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Courses;
