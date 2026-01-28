import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
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
  const [viewMode, setViewMode] = useState("seller"); // "seller" or "buyer"
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    fetchOrders();
  }, [user, navigate, viewMode]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const endpoint =
        viewMode === "seller"
          ? API_ENDPOINTS.ORDERS_RECEIVED(user.email)
          : API_ENDPOINTS.ORDERS_BY_EMAIL(user.email);
      const response = await fetch(endpoint);
      const data = await response.json();

      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.ORDER_CANCEL(orderId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to cancel order");
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order,
        ),
      );
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order,
        ),
      );

      alert("Order cancelled successfully!");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.message || "Failed to cancel order. Please try again.");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDER_STATUS(orderId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

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
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
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
      case "Pending":
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

  const openRatingModal = (order, item) => {
    setRatingProduct({ ...item, orderId: order._id });
    setRatingValue(0);
    setReviewText("");
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setRatingProduct(null);
    setRatingValue(0);
    setHoverRating(0);
    setReviewText("");
  };

  const handleRatingSubmit = async () => {
    if (ratingValue === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingRating(true);
    try {
      console.log("Submitting rating for product:", ratingProduct);
      const response = await fetch(API_ENDPOINTS.RATINGS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId:
            ratingProduct.productId || ratingProduct.id || ratingProduct._id,
          buyerEmail: user.email,
          orderId: ratingProduct.orderId,
          rating: ratingValue,
          review: reviewText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit rating");
      }

      const result = await response.json();
      console.log("Rating submitted successfully:", result);
      alert("Rating submitted successfully!");
      closeRatingModal();
      fetchOrders(); // Refresh orders to update rating status
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(error.message || "Failed to submit rating. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
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
              <h1 className="text-4xl font-bold mb-2">
                {viewMode === "seller" ? "Orders Received" : "My Orders"}
              </h1>
              <p className="text-teal-100 text-lg">
                {viewMode === "seller"
                  ? "Manage orders from buyers who purchased your products"
                  : "Track your purchases and order status"}
              </p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-3xl font-bold">{orders.length}</p>
              <p className="text-teal-100">Total Orders</p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setViewMode("buyer")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === "buyer"
                  ? "bg-white text-teal-600"
                  : "bg-teal-700 text-white hover:bg-teal-800"
              }`}
            >
              My Orders (Buyer)
            </button>
            <button
              onClick={() => setViewMode("seller")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                viewMode === "seller"
                  ? "bg-white text-teal-600"
                  : "bg-teal-700 text-white hover:bg-teal-800"
              }`}
            >
              Orders Received (Seller)
            </button>
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
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
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
                : "You haven't received any orders yet"}
            </p>
            <Link
              to="/sell"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              List a Product
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-bold text-gray-800">
                          {order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.orderDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-gray-300"></div>
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-teal-600 text-lg">
                          ৳{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full border-2 font-semibold text-sm flex items-center gap-2 ${getStatusColor(
                        order.status,
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
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <img
                          src={item.image || "https://via.placeholder.com/100"}
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
                        {viewMode === "buyer" &&
                          order.status === "Delivered" && (
                            <div className="flex items-center">
                              <button
                                onClick={() => openRatingModal(order, item)}
                                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center gap-2"
                              >
                                <FaStar /> Rate Product
                              </button>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>

                  {/* Buyer Information */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Buyer Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaUserCircle className="text-blue-500" />
                        <span>{order.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-teal-500" />
                        <span>{order.buyerEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" />
                      <span>Payment: {order.paymentStatus}</span>
                    </div>
                  </div>

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
                  {viewMode === "seller" ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="font-semibold">
                          Update Order Status:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {order.status !== "Pending" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "Pending")
                              }
                              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-semibold hover:bg-yellow-200 transition-colors flex items-center gap-2"
                            >
                              <FaClock /> Mark as Pending
                            </button>
                          )}
                        {order.status !== "Processing" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "Processing")
                              }
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                              <FaBox /> Mark as Processing
                            </button>
                          )}
                        {order.status !== "Shipped" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "Shipped")
                              }
                              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-200 transition-colors flex items-center gap-2"
                            >
                              <FaShippingFast /> Mark as Shipped
                            </button>
                          )}
                        {order.status !== "Delivered" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "Delivered")
                              }
                              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors flex items-center gap-2"
                            >
                              <FaCheckCircle /> Mark as Delivered
                            </button>
                          )}
                        {order.status !== "Cancelled" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "Cancelled")
                            }
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
                          >
                            <FaTimes /> Cancel Order
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 pt-3 border-t border-gray-200">
                        <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2">
                          <FaPhone /> Contact Buyer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Order Actions:</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
                        >
                          <FaEye /> View Details
                        </button>
                        {order.status !== "Delivered" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
                            >
                              <FaTimes /> Cancel Order
                            </button>
                          )}
                        <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg font-semibold hover:bg-teal-200 transition-colors flex items-center gap-2">
                          <FaPhone /> Contact Seller
                        </button>
                      </div>
                    </div>
                  )}
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
                        selectedOrder.status,
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

      {/* Rating Modal */}
      {showRatingModal && ratingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-linear-to-r from-yellow-500 to-orange-500 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold">Rate Product</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <img
                    src={
                      ratingProduct.image || "https://via.placeholder.com/100"
                    }
                    alt={ratingProduct.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {ratingProduct.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ৳{ratingProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Rating
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValue(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar
                        className={`text-4xl ${
                          star <= (hoverRating || ratingValue)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {ratingValue > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    {ratingValue === 1 && "Poor"}
                    {ratingValue === 2 && "Fair"}
                    {ratingValue === 3 && "Good"}
                    {ratingValue === 4 && "Very Good"}
                    {ratingValue === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Review (Optional)
                </label>
                <textarea
                  id="review"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeRatingModal}
                  disabled={submittingRating}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={submittingRating || ratingValue === 0}
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingRating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaStar /> Submit Rating
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
