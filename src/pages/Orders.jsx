import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import {
  FaBox,
  FaShippingFast,
  FaCheckCircle,
  FaTimes,
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFilter,
  FaSearch,
  FaEye,
  FaDownload,
  FaStar,
  FaUserCircle,
  FaBoxOpen,
} from "react-icons/fa";

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    // Mock orders data - In production, this would come from an API
    const mockOrders = [
      {
        id: "ORD-2025-001",
        date: "2025-11-15",
        status: "Delivered",
        total: 45999,
        items: [
          {
            id: 1,
            title: "Wireless Bluetooth Headphones",
            price: 2999,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
          },
          {
            id: 2,
            title: "MacBook Pro 2023",
            price: 43000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300",
          },
        ],
        seller: {
          name: "John Doe",
          phone: "+880 1711-123456",
          email: "john@example.com",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
        deliveryAddress: "Room 302, M M Hall, JUST Campus",
        estimatedDelivery: "2025-11-18",
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2025-11-15 10:30 AM",
            completed: true,
          },
          { status: "Confirmed", date: "2025-11-15 02:45 PM", completed: true },
          { status: "Shipped", date: "2025-11-16 09:00 AM", completed: true },
          { status: "Delivered", date: "2025-11-17 04:20 PM", completed: true },
        ],
      },
      {
        id: "ORD-2025-002",
        date: "2025-11-16",
        status: "Shipped",
        total: 1250,
        items: [
          {
            id: 5,
            title: "Programming Books Bundle",
            price: 1250,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300",
          },
        ],
        seller: {
          name: "Sarah Ahmed",
          phone: "+880 1812-654321",
          email: "sarah@example.com",
          avatar: "https://i.pravatar.cc/150?img=5",
        },
        deliveryAddress: "Room 205, SMR Hall, JUST Campus",
        estimatedDelivery: "2025-11-19",
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2025-11-16 11:15 AM",
            completed: true,
          },
          { status: "Confirmed", date: "2025-11-16 03:30 PM", completed: true },
          { status: "Shipped", date: "2025-11-17 10:00 AM", completed: true },
          { status: "Delivered", date: "Expected by Nov 19", completed: false },
        ],
      },
      {
        id: "ORD-2025-003",
        date: "2025-11-17",
        status: "Processing",
        total: 8500,
        items: [
          {
            id: 8,
            title: "Gaming Mouse RGB",
            price: 3500,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300",
          },
          {
            id: 9,
            title: "Mechanical Keyboard",
            price: 5000,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300",
          },
        ],
        seller: {
          name: "Karim Rahman",
          phone: "+880 1912-789456",
          email: "karim@example.com",
          avatar: "https://i.pravatar.cc/150?img=3",
        },
        deliveryAddress: "Ambottola, Jashore",
        estimatedDelivery: "2025-11-22",
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2025-11-17 02:00 PM",
            completed: true,
          },
          { status: "Confirmed", date: "2025-11-17 05:15 PM", completed: true },
          {
            status: "Shipped",
            date: "Preparing for shipment",
            completed: false,
          },
          { status: "Delivered", date: "Expected by Nov 22", completed: false },
        ],
      },
      {
        id: "ORD-2025-004",
        date: "2025-11-18",
        status: "Cancelled",
        total: 2500,
        items: [
          {
            id: 12,
            title: "Vintage Camera",
            price: 2500,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300",
          },
        ],
        seller: {
          name: "Mike Johnson",
          phone: "+880 1611-456789",
          email: "mike@example.com",
          avatar: "https://i.pravatar.cc/150?img=7",
        },
        deliveryAddress: "Room 101, Taramon Bibi Hall, JUST Campus",
        estimatedDelivery: "N/A",
        trackingSteps: [
          {
            status: "Order Placed",
            date: "2025-11-18 09:30 AM",
            completed: true,
          },
          { status: "Cancelled", date: "2025-11-18 11:00 AM", completed: true },
        ],
        cancellationReason: "Product no longer available",
      },
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setLoading(false);
  }, [user, navigate]);

  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle />;
      case "Shipped":
        return <FaShippingFast />;
      case "Processing":
        return <FaClock />;
      case "Cancelled":
        return <FaTimes />;
      default:
        return <FaBox />;
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeOrderDetails = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-4 font-semibold"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Orders</h1>
              <p className="text-teal-100 text-lg">
                Track and manage your purchases
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-teal-100">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>All</option>
              <option>Delivered</option>
              <option>Shipped</option>
              <option>Processing</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search or filters"
                : "You haven't placed any orders yet"}
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-bold text-gray-800">{order.id}</p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-teal-600 text-lg">
                          ৳{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full border-2 font-semibold text-sm flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Quantity: {item.quantity}
                          </p>
                          <p className="font-bold text-teal-600">
                            ৳{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  {order.status !== "Cancelled" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-teal-500" />
                        <span>Delivering to: {order.deliveryAddress}</span>
                      </div>
                      {order.status !== "Delivered" && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <FaClock className="text-blue-500" />
                          <span>
                            Estimated Delivery: {order.estimatedDelivery}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancellation Reason */}
                  {order.status === "Cancelled" && order.cancellationReason && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <FaTimes className="mt-0.5" />
                        <div>
                          <p className="font-semibold">Cancellation Reason:</p>
                          <p>{order.cancellationReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <FaEye /> View Details
                    </button>
                    {order.status === "Delivered" && (
                      <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center gap-2">
                        <FaStar /> Rate & Review
                      </button>
                    )}
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <FaDownload /> Download Invoice
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2">
                      <FaPhone /> Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-linear-to-r from-teal-600 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={closeOrderDetails}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <FaTimes className=" text-red-700" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-bold text-gray-800">
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedOrder.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full border font-semibold text-sm ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-2">{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-teal-600 text-xl">
                      ৳{selectedOrder.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Tracking
                </h3>
                <div className="space-y-4">
                  {selectedOrder.trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-teal-600 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {step.completed ? <FaCheckCircle /> : <FaClock />}
                        </div>
                        {index < selectedOrder.trackingSteps.length - 1 && (
                          <div
                            className={`absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2 ${
                              step.completed ? "bg-teal-600" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-semibold ${
                            step.completed ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-bold text-teal-600">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Seller Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedOrder.seller.avatar}
                      alt={selectedOrder.seller.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {selectedOrder.seller.name}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <FaPhone className="text-teal-500" />
                          {selectedOrder.seller.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="text-blue-500" />
                          {selectedOrder.seller.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                    Contact Seller
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Delivery Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-teal-500 mt-1" />
                    <p className="font-semibold">
                      {selectedOrder.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
