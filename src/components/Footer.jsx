import React from "react";
import { Link } from "react-router";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SE</span>
              </div>
              <span className="text-xl font-bold text-white">
                Social Events
              </span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Join us in making a difference! Discover and participate in
              community-driven social development events that create positive
              impact in our society.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/upcoming-events"
                  className="hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link
                  to="/create-event"
                  className="hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Create Event
                </Link>
              </li>
              <li>
                <Link
                  to="/joined-events"
                  className="hover:text-indigo-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  My Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Event Categories
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-indigo-400 transition-colors duration-200">
                🌳 Tree Plantation
              </li>
              <li className="hover:text-indigo-400 transition-colors duration-200">
                🧹 Road Cleaning
              </li>
              <li className="hover:text-indigo-400 transition-colors duration-200">
                🎁 Donation Drives
              </li>
              <li className="hover:text-indigo-400 transition-colors duration-200">
                📚 Educational Programs
              </li>
              <li className="hover:text-indigo-400 transition-colors duration-200">
                🏥 Health Camps
              </li>
              <li className="hover:text-indigo-400 transition-colors duration-200">
                🤝 Community Service
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-indigo-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-indigo-400 mt-1 shrink-0" />
                <span className="text-sm">
                  123 Social Street, Dhaka 1000, Bangladesh
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FaPhone className="text-indigo-400 mt-1 shrink-0" />
                <span className="text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="text-indigo-400 mt-1 shrink-0" />
                <span className="text-sm">info@socialevents.com</span>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">
                Subscribe to Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-r-lg hover:shadow-lg transition-all duration-300 font-semibold text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400 flex items-center">
              &copy; {currentYear} Social Events. Made with{" "}
              <FaHeart className="text-red-500 mx-1 animate-pulse" /> for a
              better community
            </p>
            <div className="flex space-x-6 text-sm">
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="hover:text-indigo-400 transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
