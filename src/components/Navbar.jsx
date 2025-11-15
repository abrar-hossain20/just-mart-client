import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import {
  FaUserCircle,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const { user, signoutUserFunc } = useContext(AuthContext);
  const { getCartItemsCount } = useContext(CartContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowMobileMenu(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">JM</span>
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Just Mart
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, books, electronics..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
              >
                <FaSearch size={18} />
              </button>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Browse Products
            </Link>
            <Link
              to="/sell"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sell Item
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <FaShoppingCart size={22} />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            {/* Conditional Login/Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none group"
                  title={user.displayName || user.email}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-10 h-10 rounded-full border-2 border-blue-500 hover:border-cyan-500 transition-all duration-200"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-blue-500 hover:text-cyan-500 transition-colors duration-200" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/my-products"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      My Products
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      Profile Settings
                    </Link>

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
              <Link
                to="/login"
                className="px-6 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <FaSearch size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/products"
              onClick={() => setShowMobileMenu(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Browse Products
            </Link>
            <Link
              to="/sell"
              onClick={() => setShowMobileMenu(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Sell Item
            </Link>
            <Link
              to="/cart"
              onClick={() => setShowMobileMenu(false)}
              className="block text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Shopping Cart (3)
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    {user.displayName || "User"}
                  </p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  My Dashboard
                </Link>
                <Link
                  to="/my-products"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  My Products
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setShowMobileMenu(false)}
                  className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setShowMobileMenu(false)}
                className="block px-6 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

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
