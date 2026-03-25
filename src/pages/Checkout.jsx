import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
import { buildAuthHeaders } from "../utils/authHeaders";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryLocation, setDeliveryLocation] = useState("campus");
  const [cityDeliveryArea, setCityDeliveryArea] = useState("");
  const [deliveryContactNumber, setDeliveryContactNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if no cart items
  if (cart.length === 0 && !showSuccessModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300"
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/signin", { state: { from: "/checkout" } });
    return null;
  }

  const deliveryFee = deliveryLocation === "city" ? 20 : 0;
  const total = getCartTotal() + deliveryFee;

  const validateInputs = () => {
    if (deliveryLocation === "city" && !cityDeliveryArea) {
      toast.error("Please select a city delivery area");
      return false;
    }

    if (!deliveryContactNumber.trim()) {
      toast.error("Please enter your contact number");
      return false;
    }

    const sanitizedContactNumber = deliveryContactNumber.replace(
      /[\s()-]/g,
      "",
    );
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(sanitizedContactNumber)) {
      toast.error("Please enter a valid contact number (10-15 digits)");
      return false;
    }

    // Check if any items are out of stock
    const outOfStockItems = cart.filter(
      (item) => item.stock !== undefined && item.stock <= 0,
    );
    if (outOfStockItems.length > 0) {
      toast.error(
        `Cannot place order. The following items are out of stock: ${outOfStockItems.map((item) => item.title).join(", ")}`,
      );
      return false;
    }

    // Check if any items exceed available stock
    const exceededStockItems = cart.filter(
      (item) => item.stock !== undefined && item.quantity > item.stock,
    );
    if (exceededStockItems.length > 0) {
      toast.error(
        `Cannot place order. You have more items in cart than available stock for: ${exceededStockItems.map((item) => item.title).join(", ")}`,
      );
      return false;
    }

    return true;
  };

  const createOrderData = () => {
    const sanitizedContactNumber = deliveryContactNumber.replace(
      /[\s()-]/g,
      "",
    );

    return {
      buyerEmail: user.email,
      buyerName: user.displayName || user.email,
      buyerContactNumber: sanitizedContactNumber,
      items: cart.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image,
        category: item.category,
        condition: item.condition,
        sellerEmail: item.sellerEmail,
        sellerName: item.sellerName,
      })),
      totalAmount: total,
      deliveryFee: deliveryFee,
      deliveryLocation: deliveryLocation,
      deliveryCityArea: deliveryLocation === "city" ? cityDeliveryArea : "",
      deliveryContactNumber: sanitizedContactNumber,
      status: "Pending",
      paymentStatus:
        paymentMethod === "cod" ? "Cash on Delivery" : "Pending Payment",
      paymentMethod: paymentMethod,
    };
  };

  const handleCODCheckout = async () => {
    if (!validateInputs()) return;

    setIsProcessing(true);
    try {
      const orderData = createOrderData();

      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: await buildAuthHeaders(user, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      clearCart();
      setSuccessMessage(
        "Your order has been placed successfully! The seller will contact you soon.",
      );
      setShowSuccessModal(true);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!validateInputs()) return;

    setIsProcessing(true);
    try {
      const orderData = createOrderData();

      //   console.log(orderData);

      // First, create the order with pending payment status
      const createOrderResponse = await fetch(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: await buildAuthHeaders(user, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(orderData),
      });

      if (!createOrderResponse.ok) {
        throw new Error("Failed to create order");
      }

      const createdOrder = await createOrderResponse.json();

      // Then, initiate payment
      const paymentResponse = await fetch(
        API_ENDPOINTS.ORDER_PAYMENT_INITIATE,
        {
          method: "POST",
          headers: await buildAuthHeaders(user, {
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            orderId: createdOrder.orderId,
            amount: total,
            currency: "BDT",
            customerName: user.displayName || user.email,
            customerEmail: user.email,
            customerPhone: deliveryContactNumber.replace(/[\s()-]/g, ""),
          }),
        },
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to initiate payment");
      }

      const paymentData = await paymentResponse.json();

      // Redirect to payment gateway
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else if (paymentData.htmlContent) {
        // If the backend returns HTML form, submit it
        const form = document.createElement("form");
        form.innerHTML = paymentData.htmlContent;
        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error("No payment URL provided");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold mb-4"
          >
            <FaArrowLeft /> Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Delivery Information
              </h2>

              {/* Delivery Location Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Delivery Location
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="deliveryLocation"
                      value="campus"
                      checked={deliveryLocation === "campus"}
                      onChange={(e) => {
                        setDeliveryLocation(e.target.value);
                        setCityDeliveryArea("");
                      }}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-gray-900">
                        Campus Delivery
                      </span>
                      <span className="ml-2 text-sm text-green-600 font-semibold">
                        FREE
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="deliveryLocation"
                      value="city"
                      checked={deliveryLocation === "city"}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <div className="ml-3 flex-1">
                      <span className="font-medium text-gray-900">
                        City Delivery
                      </span>
                      <span className="ml-2 text-sm text-gray-600">+ ৳20</span>
                    </div>
                  </label>
                </div>

                {deliveryLocation === "city" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select City Area <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={cityDeliveryArea}
                      onChange={(e) => setCityDeliveryArea(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Choose area</option>
                      <option value="Palbari">Palbari</option>
                      <option value="Doratana">Doratana</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Contact Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={deliveryContactNumber}
                  onChange={(e) => setDeliveryContactNumber(e.target.value)}
                  placeholder="Enter your contact number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Required: 10-15 digits
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-600 text-lg" />
                      <span className="font-semibold text-gray-900">
                        Cash on Delivery
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay when you receive your order. No advance payment
                      required.
                    </p>
                  </div>
                </label>

                {/* Online Payment Option */}
                <label
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-teal-600 focus:ring-teal-500 mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-gray-600 text-lg" />
                      <span className="font-semibold text-gray-900">
                        Pay Now
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Pay securely using card or mobile banking. Instant
                      confirmation.
                    </p>
                  </div>
                </label>
              </div>

              {/* Payment Info */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Secure Payment:</strong> All payments are processed
                  securely through SSL Commerz payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items Summary */}
              <div className="mb-6 pb-6 border-b max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 ml-2">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span
                    className={
                      deliveryLocation === "city"
                        ? "text-gray-900 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {deliveryLocation === "city" ? "৳20" : "Free"}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-teal-600">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={
                  paymentMethod === "cod"
                    ? handleCODCheckout
                    : handleOnlinePayment
                }
                disabled={
                  isProcessing ||
                  !deliveryContactNumber.trim() ||
                  (deliveryLocation === "city" && !cityDeliveryArea)
                }
                className="w-full py-4 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "cod"
                    ? "Place Order (COD)"
                    : "Proceed to Payment"}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Why shop with us?</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Secure checkout
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Verified sellers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Multiple payment options
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/orders");
                  }}
                  className="w-full py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate("/products");
                  }}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
