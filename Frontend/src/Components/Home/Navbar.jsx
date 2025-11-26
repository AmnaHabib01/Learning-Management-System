import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // close mobile menu on click
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="px-4 sm:px-6 lg:px-8 py-4 bg-white/10 backdrop-blur shadow-none transition-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-cover" />
            <span className="font-bold text-lg text-yellow-400 hidden sm:inline tracking-tight">
              GlobalTech
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("about")} className="text-sm font-medium text-blue-900/90 hover:text-blue-900 transition-colors duration-300">
              About
            </button>
            <button onClick={() => scrollToSection("courses")} className="text-sm font-medium text-blue-900/90 hover:text-blue-900 transition-colors duration-300">
              Courses
            </button>
            <button onClick={() => scrollToSection("blogs")} className="text-sm font-medium text-blue-900/90 hover:text-blue-900 transition-colors duration-300">
              Resources
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-sm font-medium text-blue-900/90 hover:text-blue-900 transition-colors duration-300">
              Contact
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-900/10 transition-colors duration-300 border border-blue-900/20 flex items-center justify-center">
              <User size={20} />
            </a>
            <a href="/login" className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg hover:bg-yellow-300 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            Login
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md px-4 py-4 flex flex-col gap-3 border-t border-primary/20">
          <button onClick={() => scrollToSection("about")} className="text-blue-900/90 hover:text-blue-900 text-sm font-medium py-2 transition-colors text-left">
            About
          </button>
          <button onClick={() => scrollToSection("courses")} className="text-blue-900/90 hover:text-blue-900 text-sm font-medium py-2 transition-colors text-left">
            Courses
          </button>
          <button onClick={() => scrollToSection("blogs")} className="text-blue-900/90 hover:text-blue-900 text-sm font-medium py-2 transition-colors text-left">
            Resources
          </button>
          <button onClick={() => scrollToSection("contact")} className="text-blue-900/90 hover:text-blue-900 text-sm font-medium py-2 transition-colors text-left">
            Contact
          </button>

          <div className="flex flex-col gap-2 pt-3 border-t border-primary/20">
            <a href="/login" className="w-full text-blue-900 border flex items-center justify-center gap-2 border-blue-900/20 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-900/10 transition-colors">
              Login
            </a>
            <a href="/register" className="w-full bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors">
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
