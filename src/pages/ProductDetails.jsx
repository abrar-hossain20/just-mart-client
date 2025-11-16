import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
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
    // Fetch data from Data.json
    fetch("/Data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        const foundProduct = jsonData.products.find(
          (p) => p.id === parseInt(id)
        );
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.image);

          // Get related products from same category
          const related = jsonData.products
            .filter(
              (p) =>
                p.category === foundProduct.category && p.id !== foundProduct.id
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
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
                to="/login"
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
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
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
      navigate("/login");
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
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
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-linear-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {discountPercentage}% OFF
                </span>
              )}
              <span className="absolute top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {product.condition}
              </span>
              {product.rating && (
                <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                  <FaStar className="text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
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
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {product.rating}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.views} reviews)
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isInWishlist(product.id)
                        ? "bg-red-50"
                        : "bg-gray-100 hover:bg-red-50"
                    }`}
                  >
                    <FaHeart
                      className={`${
                        isInWishlist(product.id)
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
                <span className="flex items-center gap-1">
                  <FaEye className="text-gray-400" />
                  {product.views} views
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
                disabled={isInCart(product.id)}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${
                  isInCart(product.id)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white border-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                }`}
              >
                <FaShoppingCart />
                {isInCart(product.id) ? "Already in Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>

        {/* Seller Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Seller Information
          </h3>
          <div className="flex items-start gap-6">
            <img
              src={product.seller?.avatar || "https://i.pravatar.cc/150"}
              alt={product.seller?.name || product.seller}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-gray-800">
                  {product.seller?.name || product.seller}
                </h4>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar />
                  <span className="text-gray-700 font-semibold">
                    {product.seller?.rating || "N/A"}
                  </span>
                </div>
              </div>
              {product.seller?.university && (
                <p className="text-gray-600 mb-1">
                  🎓 {product.seller.university}
                </p>
              )}
              {product.seller?.department && (
                <p className="text-gray-600 mb-4">
                  📚 {product.seller.department}
                </p>
              )}
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <FaEnvelope /> Send Message
                </button>
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
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
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
                          100
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
