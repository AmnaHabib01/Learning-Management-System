import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white">
      {/* Top Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div className="flex flex-col items-start">
           {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
               <img
                src="/logo.png"
                alt="Logo"
                className="w-30 h-30 object-cover"
              />

            {/* <span className="font-bold text-lg text-yellow-400 hidden sm:inline tracking-tight">
              GlobalTech
            </span> */}
          </a>
          <p className="text-blue-100 text-sm">
            Welcome to Our College! We provide quality education and modern facilities for students.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="text-yellow-400 font-bold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {["Home", "About Us", "Contact Us", "Courses"].map((link) => (
              <li key={link}>
                <a
                  href={`/${link.replace(/\s+/g, "").toLowerCase()}`}
                  className="text-blue-100 hover:text-yellow-400 transition-colors duration-300"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col">
          <h3 className="text-yellow-400 font-bold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-center space-x-2 hover:text-yellow-400 transition-colors duration-300">
              <FaEnvelope /> <span>info@college.com</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-yellow-400 transition-colors duration-300">
              <FaPhoneAlt /> <span>‪+92 300 1234567‬</span>
            </li>
            <li className="flex items-center space-x-2 hover:text-yellow-400 transition-colors duration-300">
              <FaMapMarkerAlt /> <span>123 College Street, City, Country</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col">
          <h3 className="text-yellow-400 font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            {[
              { icon: <FaFacebookF />, link: "https://facebook.com" },
              { icon: <FaTwitter />, link: "https://twitter.com" },
              { icon: <FaInstagram />, link: "https://instagram.com" },
              { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
            ].map(({ icon, link }, index) => (
              <a
                key={index}
                href={link}
                className="p-3 rounded-full bg-white/10 hover:bg-yellow-400 text-white hover:text-blue-900 transition-all duration-300 transform hover:scale-110"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-950 text-blue-100 text-sm py-4 text-center mt-8 border-t border-blue-800">
        &copy; {new Date().getFullYear()} Global Tech College. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
