import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, signoutUserFunc } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signoutUserFunc()
      .then(() => {
        navigate("/");
        setShowDropdown(false);
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SE</span>
            </div>
            <span className="text-xl font-bold text-gray-800">
              Social Events
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {/* Upcoming Events Link */}
            <Link
              to="/upcoming-events"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Upcoming Events
            </Link>

            {/* Conditional Login/Logout */}
            {user ? (
              <div className="relative">
                {/* Profile Picture with Dropdown */}
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                  title={user.displayName || user.email}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full border-2 border-indigo-500 hover:border-purple-600 transition-all duration-200"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-indigo-500 hover:text-purple-600 transition-colors duration-200" />
                  )}
                  {/* Display Name on Hover - Tooltip */}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {user.displayName || user.email}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Dropdown Links */}
                    <Link
                      to="/create-event"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                    >
                      Create Event
                    </Link>
                    <Link
                      to="/manage-events"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                    >
                      Manage Events
                    </Link>
                    <Link
                      to="/joined-events"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                    >
                      Joined Events
                    </Link>

                    {/* Logout Button */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login Button for non-logged-in users
              <Link
                to="/login"
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
