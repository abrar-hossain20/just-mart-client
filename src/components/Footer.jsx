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
  FaShieldAlt,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-linear-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">JM</span>
              </div>
              <span className="text-xl font-bold text-white">Just Mart</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your trusted campus marketplace for buying and selling new and
              used goods. Connect with fellow students and make smart deals in a
              secure environment.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-teal-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  to="/sell"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  Sell Your Item
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Popular Categories
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-2">
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                📚 Books & Notes
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                💻 Electronics
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                👕 Fashion & Clothing
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                🏠 Furniture & Decor
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                � Gaming & Hobbies
              </li>
              <li className="hover:text-blue-400 transition-colors duration-200 cursor-pointer">
                🚴 Sports Equipment
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-teal-500"></span>
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-teal-400 mt-1 shrink-0" />
                <span className="text-sm">
                  University Campus, Dhaka 1000, Bangladesh
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FaPhone className="text-blue-400 mt-1 shrink-0" />
                <span className="text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-start space-x-3">
                <FaEnvelope className="text-teal-400 mt-1 shrink-0" />
                <span className="text-sm">support@justmart.com</span>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2">Get Updates</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
                <button className="px-4 py-2 bg-linear-to-r from-green-600 to-blue-500 text-white rounded-r-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-semibold text-sm">
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
              &copy; {currentYear} Just Mart. Made with{" "}
              <FaHeart className="text-red-500 mx-1 animate-pulse" /> for
              university students
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/safety"
                className="hover:text-teal-400 transition-colors duration-200"
              >
                Safety Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
