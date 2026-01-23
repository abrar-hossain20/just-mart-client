import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import {
  FaHeart,
  FaShoppingCart,
  FaTrash,
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const { wishlistItems, removeFromWishlist, clearWishlist } =
    useContext(WishlistContext);
  const { addToCart, isInCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <FaHeart className="text-6xl text-red-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please log in to view your wishlist.
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-red-500 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <FaHeart className="text-4xl" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-red-100">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
              <p className="text-gray-700">
                <span className="font-semibold">{wishlistItems.length}</span>{" "}
                {wishlistItems.length === 1 ? "item" : "items"} in wishlist
              </p>
              <button
                onClick={clearWishlist}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <FaTrash /> Clear Wishlist
              </button>
            </div>

            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="relative">
                      <img
                        src={
                          product.images?.[0] ||
                          product.image ||
                          "https://via.placeholder.com/300x200"
                        }
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(product._id);
                        }}
                        className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-md"
                      >
                        <FaHeart className="text-red-500" />
                      </button>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="absolute top-2 left-2 bg-linear-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                            {Math.round(
                              ((product.originalPrice - product.price) /
                                product.originalPrice) *
                                100,
                            )}
                            % OFF
                          </span>
                        )}
                      <span className="absolute bottom-2 left-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.condition}
                      </span>
                      {product.condition === "New" &&
                        product.rating &&
                        product.rating >= 0 && (
                          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <FaStar className="text-yellow-400 text-xs" />
                            <span className="text-xs font-semibold text-gray-800">
                              {product.rating}
                            </span>
                          </div>
                        )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {product.category}
                    </p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xl font-bold text-teal-600">
                          ৳{product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-teal-500" />
                        {product.location}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isInCart(product._id)}
                          className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1 ${
                            isInCart(product._id)
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-teal-600 text-white hover:bg-teal-700"
                          }`}
                        >
                          <FaShoppingCart />
                          {isInCart(product._id) ? "In Cart" : "Add to Cart"}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
