import React from "react";
import Navbar from "../Components/Home/Navbar.jsx";
import HeroSection from "../Components/Home/HeroSection.jsx";
import Blogs from "../Components/Home/Blogs.jsx";
import Courses from "../Components/Home/Courses.jsx";
import Aboutus from "../Components/Home/Aboutus.jsx";
import Contact from "../Components/Home/Contact.jsx";
import Footer from "../Components/Home/Footer.jsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section id="hero">
        <HeroSection />
      </section>
      <section id="blogs">
        <Blogs />
      </section>
      <section id="courses">
        <Courses />
      </section>
      <section id="about">
        <Aboutus />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </div>
  );
}
