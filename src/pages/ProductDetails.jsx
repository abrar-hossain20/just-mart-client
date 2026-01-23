import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { API_ENDPOINTS } from "../config/api";
import {
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaStar,
  FaCheckCircle,
  FaShoppingCart,
  FaFacebookF,
  FaTwitter,
  FaWhatsapp,
  FaLock,
} from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    // Fetch product from backend API
    const fetchProduct = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id));
        if (!response.ok) {
          throw new Error("Product not found");
        }

        const foundProduct = await response.json();
        setProduct(foundProduct);

        // Set the first image from images array or fallback to single image
        const firstImage =
          foundProduct.images?.[0] ||
          foundProduct.image ||
          "https://via.placeholder.com/400";
        setSelectedImage(firstImage);

        // Fetch all products to get related ones
        const allProductsRes = await fetch(API_ENDPOINTS.PRODUCTS);
        const allProducts = await allProductsRes.json();

        // Get related products from same category
        const related = allProducts
          .filter(
            (p) =>
              p.category === foundProduct.category &&
              p._id !== foundProduct._id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaLock className="text-4xl text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view product details. Please sign in
              to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/signin"
                state={`/product/${id}`}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Login Now
              </Link>
              <Link
                to="/products"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  const handleAddToCart = () => {
    if (!user) {
      navigate("/signin", { state: `/product/${id}` });
      return;
    }
    addToCart(product);
    setShowAddedMessage(true);
    setTimeout(() => {
      setShowAddedMessage(false);
    }, 3000);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/signin", { state: `/product/${id}` });
      return;
    }

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message Toast */}
      {showAddedMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <FaCheckCircle />
          <span>Added to cart successfully!</span>
        </div>
      )}
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-teal-600">
              Home
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-teal-600">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 font-semibold"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg relative">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-96 object-cover"
              />
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="absolute top-4 left-4 bg-linear-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                )}
              <span className="absolute top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {product.condition}
              </span>
              {product.condition === "New" &&
                product.rating >= 0 && (
                  <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-bold text-gray-800">
                      {product.rating}
                    </span>
                  </div>
                )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-all hover:scale-105 ${
                      selectedImage === img
                        ? "ring-2 ring-teal-600 scale-105"
                        : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">
                    {product.category}
                  </p>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  {product.condition === "New" && product.rating >= 0 && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(parseInt(product.rating))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {product.rating}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isInWishlist(product._id)
                        ? "bg-red-50"
                        : "bg-gray-100 hover:bg-red-50"
                    }`}
                  >
                    <FaHeart
                      className={`${
                        isInWishlist(product._id)
                          ? "text-red-500"
                          : "text-gray-600"
                      } transition-colors`}
                    />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors">
                    <FaShare className="text-gray-600 hover:text-blue-500" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-4">
                <p className="text-4xl font-bold text-teal-600">
                  ৳{product.price.toLocaleString()}
                </p>
                {product.originalPrice > product.price && (
                  <p className="text-xl text-gray-400 line-through mb-1">
                    ৳{product.originalPrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-teal-500" />
                  {product.location}
                </span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-blue-500" />
                  Posted {new Date(product.datePosted).toLocaleDateString()}
                </span>
              </div>

              {/* Negotiable Badge */}
              {product.isNegotiable && (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-6">
                  <FaCheckCircle />
                  <span className="font-semibold">Price Negotiable</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-6">
              <button className="w-full py-4 bg-linear-to-r from-teal-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 flex items-center justify-center gap-2">
                <FaPhone />
                Contact Seller
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isInCart(product._id)}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  isInCart(product._id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                }`}
              >
                <FaShoppingCart />
                {isInCart(product._id) ? "Already in Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Seller Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Seller Information
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {(product.sellerName || product.seller?.name || "S")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {product.sellerName ||
                      product.seller?.name ||
                      "Anonymous Seller"}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaEnvelope className="text-teal-600" />
                    {product.sellerEmail ||
                      product.seller?.email ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock className="text-teal-600" />
                  <span>
                    Member since{" "}
                    {new Date(product.datePosted).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-teal-600" />
                    <span>{product.location}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:${product.sellerEmail || product.seller?.email}`}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  <FaEnvelope /> Contact Seller
                </a>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <FaUser /> View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Related Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-48 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-linear-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      {Math.round(
                        ((relatedProduct.originalPrice - relatedProduct.price) /
                          relatedProduct.originalPrice) *
                          100,
                      )}
                      % OFF
                    </span>
                    <span className="absolute bottom-2 left-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {relatedProduct.condition}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      {relatedProduct.category}
                    </p>
                    <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                      {relatedProduct.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-teal-600">
                          ৳{relatedProduct.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          ৳{relatedProduct.originalPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
