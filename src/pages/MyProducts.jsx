import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import {
  FaBox,
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaEye,
  FaArrowLeft,
} from "react-icons/fa";

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    fetchMyProducts();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PRODUCTS);
      const products = await response.json();

      // Filter products by current user's email
      const userProducts = products.filter(
        (product) => product.sellerEmail === user?.email,
      );
      setMyProducts(userProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId), {
        method: "DELETE",
      });

      if (response.ok) {
        setMyProducts(
          myProducts.filter((p) => p._id !== productId && p.id !== productId),
        );
        alert("Product deleted successfully!");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-white hover:text-teal-100 mb-4 transition-colors"
              >
                <FaArrowLeft /> Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold mb-2">My Products</h1>
              <p className="text-teal-100">
                Manage your product listings ({myProducts.length} total)
              </p>
            </div>
            <Link
              to="/sell"
              className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add New Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products List */}
        {myProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No products yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start selling by adding your first product
            </p>
            {myProducts.length === 0 && (
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <FaPlus /> Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {myProducts.length} Product
                {myProducts.length !== 1 ? "s" : ""} Found
              </h2>
              <div className="space-y-4">
                {myProducts.map((product) => {
                  const imageUrl =
                    product.images?.[0] ||
                    product.image ||
                    product.imageUrl ||
                    "https://via.placeholder.com/400x400?text=No+Image";

                  return (
                    <div
                      key={product._id || product.id}
                      className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300"
                    >
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x400?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 text-lg mb-2">
                              {product.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                                {product.category}
                              </span>
                              {product.condition && (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    product.condition === "New"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {product.condition}
                                </span>
                              )}
                              {product.location && (
                                <span className="text-gray-500">
                                  📍 {product.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="text-2xl font-bold text-teal-600 mb-1">
                              ৳{product.price?.toLocaleString()}
                            </p>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <p className="text-sm text-gray-400 line-through mb-1">
                                  ৳{product.originalPrice.toLocaleString()}
                                </p>
                              )}
                            {product.discount && (
                              <p className="text-sm text-green-600 font-semibold">
                                {product.discount}% OFF
                              </p>
                            )}
                            {product.stock !== undefined && (
                              <p className="text-sm text-gray-500 mt-2">
                                Stock: {product.stock}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link
                            to={`/product/${product._id || product.id}`}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <FaEye /> View
                          </Link>
                          <button
                            onClick={() =>
                              navigate(
                                `/sell?edit=${product._id || product.id}`,
                              )
                            }
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product._id || product.id)
                            }
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors flex items-center gap-2"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
