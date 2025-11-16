import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import {
  FaBox,
  FaShoppingBag,
  FaDollarSign,
  FaHeart,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaChartLine,
  FaStar,
  FaUserCircle,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { getWishlistItemsCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch data from Data.json
    fetch("/Data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        // Filter products by current user (mock for demonstration)
        // In production, you'd filter by user ID
        const userProducts = jsonData.products.slice(0, 3); // Mock: showing first 3
        setMyProducts(userProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Active Listings",
      value: myProducts.length,
      icon: <FaBox />,
      color: "blue",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      link: "/my-products",
    },
    {
      title: "Total Orders",
      value: myOrders.length,
      icon: <FaShoppingBag />,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      link: "/orders",
    },
    {
      title: "Total Earnings",
      value: "৳0",
      icon: <FaDollarSign />,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      link: "/orders",
    },
    {
      title: "Wishlist Items",
      value: getWishlistItemsCount(),
      icon: <FaHeart />,
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-600",
      link: "/wishlist",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <FaUserCircle className="text-5xl text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                Welcome back, {user?.displayName || "User"}!
              </h1>
              <p className="text-blue-100">
                Manage your products, orders, and profile
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center ${stat.textColor} text-2xl`}
                >
                  {stat.icon}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  My Products
                </h2>
                <Link
                  to="/sell"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <FaPlus /> Add Product
                </Link>
              </div>

              {myProducts.length === 0 ? (
                <div className="text-center py-12">
                  <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No products yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Start selling by adding your first product
                  </p>
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    <FaPlus /> Add Your First Product
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {product.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              {product.category}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <FaEye className="text-blue-500" />
                                {product.views} views
                              </span>
                              {product.rating && (
                                <span className="flex items-center gap-1 text-gray-600">
                                  <FaStar className="text-yellow-400" />
                                  {product.rating}
                                </span>
                              )}
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  product.condition === "New"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {product.condition}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-teal-600">
                              ৳{product.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-1">
                            <FaEdit /> Edit
                          </button>
                          <button className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center gap-1">
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    to="/my-products"
                    className="block text-center py-3 text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    View All Products →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/sell"
                  className="block w-full py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                >
                  <FaPlus className="inline mr-2" />
                  Sell New Item
                </Link>
                <Link
                  to="/products"
                  className="block w-full py-3 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-center"
                >
                  Browse Products
                </Link>
                <Link
                  to="/profile"
                  className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Edit Profile
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Account Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-800">
                    {user?.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email Verified</span>
                  <span
                    className={`font-semibold ${
                      user?.emailVerified ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user?.emailVerified ? (
                      <span className="flex items-center gap-1">
                        <FaCheckCircle /> Yes
                      </span>
                    ) : (
                      "No"
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Product viewed</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <FaClock /> 2 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaChartLine className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Profile updated</p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <FaClock /> 1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
