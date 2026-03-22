import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
import { buildAuthHeaders } from "../utils/authHeaders";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  const [status, setStatus] = useState("processing"); // processing, success, failure
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Get payment response parameters from URL
        const transactionId = searchParams.get("tran_id");
        const status = searchParams.get("status");
        const amount = searchParams.get("amount");
        const currency = searchParams.get("currency");

        if (!transactionId) {
          setStatus("failure");
          setMessage("Invalid payment response");
          return;
        }

        // Verify payment with backend
        const verifyResponse = await fetch(API_ENDPOINTS.ORDER_PAYMENT_VERIFY, {
          method: "POST",
          headers: await buildAuthHeaders(user, {
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            transactionId,
            status,
            amount,
            currency,
          }),
        });

        if (!verifyResponse.ok) {
          throw new Error("Failed to verify payment");
        }

        const data = await verifyResponse.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Payment completed successfully!");
          clearCart();
          toast.success("Payment successful! Your order has been placed.");
        } else {
          setStatus("failure");
          setMessage(
            data.message || "Payment verification failed. Please try again.",
          );
          toast.error("Payment verification failed");
        }
      } catch (error) {
        console.error("Error handling payment callback:", error);
        setStatus("failure");
        setMessage("An error occurred while processing your payment");
        toast.error("An error occurred while processing your payment");
      }
    };

    if (user) {
      handlePaymentCallback();
    }
  }, [searchParams, user, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          {status === "processing" && (
            <>
              <FaSpinner className="text-teal-600 text-5xl mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we process your payment...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => navigate("/products")}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}

          {status === "failure" && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <FaTimesCircle className="text-red-500 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Back to Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
