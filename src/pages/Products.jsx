import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaTh,
  FaList,
  FaHeart,
  FaMapMarkerAlt,
  FaClock,
  FaEye,
} from "react-icons/fa";

const Products = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch data from Data.json
    fetch("/Data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setFilteredProducts(jsonData.products || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data?.products) return;

    let filtered = [...data.products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Condition filter
    if (selectedCondition !== "All") {
      filtered = filtered.filter(
        (product) => product.condition === selectedCondition
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [
    searchQuery,
    selectedCategory,
    selectedCondition,
    priceRange,
    sortBy,
    data,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedCondition("All");
    setPriceRange([0, 100000]);
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];
  const conditions = ["All", "New", "Used"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Browse Products</h1>
          <p className="text-teal-100 text-lg">
            Discover amazing deals from fellow students
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products, categories, or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-64 space-y-6`}
          >
            {/* Filters Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Reset
                </button>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Condition</h4>
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <label
                      key={condition}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={selectedCondition === condition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-gray-600">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Price Range
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full accent-teal-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>৳0</span>
                    <span className="font-semibold text-teal-600">
                      ৳{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-teal-50 text-teal-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  {filteredProducts.length}
                </span>{" "}
                products found
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 ${
                      viewMode === "grid"
                        ? "bg-teal-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 ${
                      viewMode === "list"
                        ? "bg-teal-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FaSearch size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-md">
                        <FaHeart className="text-gray-400 hover:text-red-500" />
                      </button>
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                      <span className="absolute bottom-2 left-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.condition}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                        <Link to={`/product/${product.id}`}>
                          {product.title}
                        </Link>
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xl font-bold text-teal-600">
                            ৳{product.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ৳{product.originalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-teal-500" />
                            {product.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaEye /> {product.views}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            {product.seller?.name || product.seller}
                          </p>
                          <Link
                            to={`/product/${product.id}`}
                            className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-64 h-48 sm:h-auto">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                        <span className="absolute bottom-2 left-2 bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.condition}
                        </span>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">
                              {product.category}
                            </p>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-teal-600 transition-colors">
                              <Link to={`/product/${product.id}`}>
                                {product.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <button className="ml-4 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-red-50 transition-colors">
                            <FaHeart className="text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="text-2xl font-bold text-teal-600">
                              ৳{product.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              ৳{product.originalPrice.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-teal-500" />
                              {product.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-blue-500" />
                              {new Date(
                                product.datePosted
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaEye className="text-gray-400" />
                              {product.views}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              Seller:{" "}
                              <strong>
                                {product.seller?.name || product.seller}
                              </strong>
                            </span>
                            <Link
                              to={`/product/${product.id}`}
                              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
