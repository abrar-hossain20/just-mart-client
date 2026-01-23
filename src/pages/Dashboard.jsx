import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { API_ENDPOINTS } from "../config/api";
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
  FaShippingFast,
  FaTimesCircle,
  FaPhone,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { getWishlistItemsCount } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Fetch data from backend API
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch(API_ENDPOINTS.PRODUCTS),
          user?.email
            ? fetch(API_ENDPOINTS.ORDERS(user.email))
            : Promise.resolve({ json: () => [] }),
        ]);

        const products = await productsRes.json();
        const orders = user?.email ? await ordersRes.json() : [];

        // Filter products by current user (mock for demonstration)
        // In production, you'd filter by user ID
        const userProducts = products.slice(0, 3); // Mock: showing first 3
        setMyProducts(userProducts);

        // Mock seller orders - orders received for products the seller has listed
        // In production, this would come from a real API filtering by seller ID
        const mockSellerOrders = products.slice(0, 3).map((product, idx) => ({
          id: `SO-2025-${String(idx + 1).padStart(3, "0")}`,
          orderDate: new Date(Date.now() - idx * 86400000)
            .toISOString()
            .split("T")[0],
          status: idx === 0 ? "Pending" : idx === 1 ? "Shipped" : "Delivered",
          buyer: {
            name:
              idx === 0
                ? "Ahmed Rahman"
                : idx === 1
                  ? "Fatima Khan"
                  : "Kamal Hossain",
            phone:
              idx === 0
                ? "+880 1711-234567"
                : idx === 1
                  ? "+880 1812-345678"
                  : "+880 1912-456789",
            email:
              idx === 0
                ? "ahmed@student.edu"
                : idx === 1
                  ? "fatima@student.edu"
                  : "kamal@student.edu",
            avatar: `https://i.pravatar.cc/150?img=${12 + idx * 4}`,
          },
          product: product,
          quantity: 1,
          totalAmount: product?.price || 0,
          deliveryAddress:
            idx === 0
              ? "Room 305, Hall 4, DU Campus"
              : idx === 1
                ? "House 12, Road 5, Banani"
                : "Room 201, Hall 2, BUET Campus",
        }));

        setSellerOrders(mockSellerOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate total earnings from delivered orders
  const totalEarnings = sellerOrders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + order.totalAmount, 0);

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
      title: "Orders Received",
      value: sellerOrders.length,
      icon: <FaShoppingBag />,
      color: "green",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      link: "/dashboard",
    },
    {
      title: "Total Earnings",
      value: `৳${totalEarnings.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: "purple",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      link: "/dashboard",
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
                Manage your products, seller orders, and profile
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
          {/* Recent Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Recent Orders Received
                </h2>
                <span className="text-sm text-gray-500">
                  {sellerOrders.length} total orders
                </span>
              </div>

              {sellerOrders.length === 0 ? (
                <div className="text-center py-12">
                  <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Orders for your products will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerOrders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-bold text-gray-800">{order.id}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "Delivered" && (
                            <FaCheckCircle className="inline mr-1" />
                          )}
                          {order.status === "Shipped" && (
                            <FaShippingFast className="inline mr-1" />
                          )}
                          {order.status === "Pending" && (
                            <FaClock className="inline mr-1" />
                          )}
                          {order.status}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <img
                          src={order.product?.image}
                          alt={order.product?.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {order.product?.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Quantity: {order.quantity}
                          </p>
                          <p className="text-lg font-bold text-teal-600">
                            ৳{order.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.buyer.avatar}
                              alt={order.buyer.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {order.buyer.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-1">
                            <FaPhone /> Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sellerOrders.length > 3 && (
                    <button className="block text-center w-full py-3 text-teal-600 hover:text-teal-700 font-semibold">
                      View All Orders →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* My Products Section */}
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
                          user.metadata.creationTime,
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      New order received
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <FaClock /> 1 hour ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <FaEye className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      Product viewed 15 times
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                      <FaClock /> 3 hours ago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                    <FaChartLine className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      Product listing updated
                    </p>
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
