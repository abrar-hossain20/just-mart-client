import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  React.useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setCheckingProfile(true);
      const response = await fetch(API_ENDPOINTS.USER_PROFILE(user.email));
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setCheckingProfile(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/signin", { state: { from: "/cart" } });
      return;
    }

    // Check if any items are out of stock
    const outOfStockItems = cart.filter(
      (item) => item.stock !== undefined && item.stock <= 0,
    );
    if (outOfStockItems.length > 0) {
      alert(
        `Cannot place order. The following items are out of stock: ${outOfStockItems.map((item) => item.title).join(", ")}. Please remove them from your cart.`,
      );
      return;
    }

    // Check if any items exceed available stock
    const exceededStockItems = cart.filter(
      (item) => item.stock !== undefined && item.quantity > item.stock,
    );
    if (exceededStockItems.length > 0) {
      alert(
        `Cannot place order. You have more items in cart than available stock for: ${exceededStockItems.map((item) => item.title).join(", ")}`,
      );
      return;
    }

    // Check if user has buying contact number
    if (!userProfile?.buyingContactNumber) {
      if (
        window.confirm(
          "You need to add a buying contact number to purchase products. Would you like to update your profile now?",
        )
      ) {
        navigate("/profile");
      }
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        buyerEmail: user.email,
        buyerName: user.displayName || user.email,
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
        totalAmount: getCartTotal(),
        deliveryFee: 0,
        status: "Pending",
        paymentStatus: "Cash on Delivery",
      };

      const response = await fetch(API_ENDPOINTS.ORDERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const result = await response.json();
      setOrderId(result.orderId);
      clearCart();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300"
          >
            <FaArrowLeft /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item._id}`}
                    className="w-full sm:w-32 h-32 shrink-0"
                  >
                    <img
                      src={
                        item.images?.[0] ||
                        item.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg font-semibold text-gray-800 hover:text-teal-600 transition-colors line-clamp-2"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.category} • {item.condition}
                        </p>
                        <p className="text-sm text-gray-500">{item.location}</p>
                        {(item.stock === undefined || item.stock <= 0) && (
                          <p className="text-sm font-semibold text-red-600 mt-1 bg-red-50 px-2 py-1 rounded inline-block">
                            Out of Stock
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Remove from cart"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-3">
                      {/* Quantity Controls */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              item.quantity <= 1 ||
                              (item.stock !== undefined && item.stock <= 0)
                            }
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                              (item.stock !== undefined && item.stock <= 0) ||
                              (item.stock !== undefined &&
                                item.quantity >= item.stock)
                            }
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                        {item.stock !== undefined && item.stock > 0 ? (
                          <p className="text-xs text-gray-500 text-center">
                            {item.stock - item.quantity > 0
                              ? `${item.stock - item.quantity} left in stock`
                              : "Max stock reached"}
                          </p>
                        ) : item.stock !== undefined && item.stock <= 0 ? (
                          <p className="text-xs text-red-600 font-semibold text-center">
                            Out of Stock
                          </p>
                        ) : null}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-700">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            ৳{item.price.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaTrash /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-teal-600">
                      ৳{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-4 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>

              <Link
                to="/products"
                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3">Why shop with us?</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Secure campus delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Verified sellers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Student-friendly prices
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
              <p className="text-gray-600 mb-6">
                Your order has been placed. The seller will contact you soon.
              </p>
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

export default Cart;
