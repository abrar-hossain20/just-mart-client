import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { API_ENDPOINTS } from "../config/api";
import {
  FaSearch,
  FaShieldAlt,
  FaUserGraduate,
  FaTruck,
  FaDollarSign,
  FaBook,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaGamepad,
  FaBicycle,
  FaCar,
  FaList,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    // Fetch data from backend and local file
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, localDataRes, statsRes] =
          await Promise.all([
            fetch(API_ENDPOINTS.PRODUCTS),
            fetch(API_ENDPOINTS.CATEGORIES),
            fetch("/Data.json"),
            fetch(API_ENDPOINTS.STATS),
          ]);

        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const localData = await localDataRes.json();
        const stats = await statsRes.json();

        setData({
          products,
          categories: categories || [],
          testimonials: localData.testimonials || [],
          stats,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];
  const featuredProducts =
    data?.products
      ?.filter((product) => product.condition === "New")
      ?.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4) || [];
  const testimonials = data?.testimonials || [];
  const stats = data?.stats || {};

  const handleSearch = (e) => {
    e.preventDefault();
    let searchUrl = "/products";
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.append("search", searchQuery.trim());
    }

    if (selectedCategory !== "All Categories") {
      params.append("category", selectedCategory);
    }

    const queryString = params.toString();
    if (queryString) {
      searchUrl += `?${queryString}`;
    }

    navigate(searchUrl);
  };

  const categoryIcons = {
    "Books & Notes": <FaBook />,
    Electronics: <FaLaptop />,
    Fashion: <FaTshirt />,
    Furniture: <FaCouch />,
    Gaming: <FaGamepad />,
    "Sports & Fitness": <FaBicycle />,
    Sports: <FaBicycle />,
    Vehicles: <FaCar />,
    Others: <FaList />,
  };

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up",
      description: "Create your account with university email verification",
    },
    {
      step: "2",
      title: "Browse or Sell",
      description: "Find great deals or list your items in minutes",
    },
    {
      step: "3",
      title: "Connect",
      description: "Chat with buyers/sellers and arrange safe transactions",
    },
    {
      step: "4",
      title: "Trade",
      description: "Complete the deal with secure payment and delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Your Campus Marketplace for Students
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Buy and sell textbooks, electronics, furniture, and more within
                your university community. Safe, secure, and student-friendly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  Browse Products
                </Link>
                <Link
                  to="/sell"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 text-center"
                >
                  Start Selling
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-300" />
                  <span>
                    {stats.totalProducts?.toLocaleString() || "10,000+"}+
                    Products
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-green-300" />
                  <span>
                    {stats.totalUsers?.toLocaleString() || "5,000+"}+ Students
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://rankoone.com/wp-content/uploads/2024/02/eCommerce-Website-Components-photo.jpg"
                alt="Students"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-md -mt-8 relative z-10 mx-4 sm:mx-8 lg:mx-16 rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <button
                key={category.id || index}
                onClick={() => {
                  const params = new URLSearchParams();
                  params.append("category", category.name);
                  navigate(`/products?${params.toString()}`);
                }}
                className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center group cursor-pointer`}
              >
                <div
                  className={`text-5xl mb-3 text-${category.color}-500 group-hover:scale-110 transition-transform duration-300`}
                >
                  {categoryIcons[category.name] || category.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count?.toLocaleString() || 0} items
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Products Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Top Rated Products
            </h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                  <span className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {product.condition}
                  </span>
                  {product.rating && (
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs font-semibold">
                        {product.rating}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-bold text-blue-600">
                        ৳{product.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          product.seller?.avatar || "https://i.pravatar.cc/150"
                        }
                        alt={product.seller?.name || product.seller}
                        className="w-6 h-6 rounded-full"
                      />
                      <p className="text-gray-600 truncate">
                        {product.seller?.name || product.seller}
                      </p>
                    </div>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="font-semibold text-gray-700">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-linear-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-blue-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Students Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.department}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students buying and selling on Just Mart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
