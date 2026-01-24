import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { FaUpload, FaImage, FaTimes, FaPlus, FaSpinner } from "react-icons/fa";

const SellItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(!!editId);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    price: "",
    category: "",
    condition: "New",
    location: "",
    stock: 1,
    tags: [],
    images: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    if (editId) {
      fetchProductForEdit(editId);
    }
  }, [editId]);

  const fetchProductForEdit = async (productId) => {
    try {
      setLoadingProduct(true);
      const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId));
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const product = await response.json();

      // Check if the user owns this product
      if (product.sellerEmail !== user?.email) {
        alert("You don't have permission to edit this product");
        navigate("/my-products");
        return;
      }

      setIsEditMode(true);
      setFormData({
        title: product.title || "",
        description: product.description || "",
        originalPrice: product.originalPrice || "",
        price: product.price || "",
        category: product.category || "",
        condition: product.condition || "New",
        location: product.location || "",
        stock: product.stock || 1,
        tags: product.tags || [],
        images: product.images || [],
      });
      setImageUrls(product.images || []);
      setLoadingProduct(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product for editing");
      navigate("/my-products");
      setLoadingProduct(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES);
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, category: data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (formData.originalPrice && formData.price) {
      const original = parseFloat(formData.originalPrice);
      const current = parseFloat(formData.price);
      if (original > current && original > 0) {
        return Math.round(((original - current) / original) * 100);
      }
    }
    return 0;
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrls.length < 5) {
      setImageUrls([...imageUrls, ""]);
    }
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    setFormData((prev) => ({
      ...prev,
      images: newImageUrls.filter((url) => url.trim() !== ""),
    }));
  };

  const handleRemoveImageUrl = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setFormData((prev) => ({
      ...prev,
      images: newImageUrls.filter((url) => url.trim() !== ""),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (
      formData.originalPrice &&
      parseFloat(formData.originalPrice) < parseFloat(formData.price)
    ) {
      newErrors.originalPrice =
        "Original price must be greater than current price";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const discount = calculateDiscount();
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : parseFloat(formData.price),
        discount: discount,
        stock: parseInt(formData.stock),
        sellerEmail: user.email,
        sellerName: user.displayName || user.email,
      };

      if (isEditMode && editId) {
        // Update existing product
        const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(editId), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        alert("Product updated successfully!");
        navigate(`/product/${editId}`);
      } else {
        // Create new product
        productData.datePosted = new Date().toISOString();
        productData.rating = 0;
        productData.views = 0;

        const response = await fetch(API_ENDPOINTS.PRODUCTS, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          throw new Error("Failed to create product");
        }

        const result = await response.json();
        alert("Product created successfully!");
        navigate(`/product/${result.productId}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        `Failed to ${isEditMode ? "update" : "create"} product. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {loadingProduct ? (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading product...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            {isEditMode ? "Edit Your Product" : "Sell Your Item"}
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., iPhone 13 Pro Max 256GB"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail..."
                rows="5"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Original Price and Current Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Original Price (৳)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.originalPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.originalPrice && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.originalPrice}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Optional - Used to calculate discount
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Current Price (৳) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.price
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
                {calculateDiscount() > 0 && (
                  <p className="text-green-600 text-sm mt-1 font-semibold">
                    {calculateDiscount()}% OFF
                  </p>
                )}
              </div>
            </div>

            {/* Stock Quantity */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.category
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Dhaka, Bangladesh"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.location
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Product Images * (Max 5)
              </label>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              {imageUrls.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                >
                  <FaPlus /> Add Image URL
                </button>
              )}
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                <FaImage className="inline mr-1" />
                Add image URLs (hosted on external services like Imgur,
                Cloudinary, etc.)
              </p>
            </div>

            {/* Preview Images */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Image Preview
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/200?text=Invalid+Image";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    {isEditMode ? "Updating Product..." : "Creating Product..."}
                  </>
                ) : (
                  <>
                    <FaUpload />
                    {isEditMode ? "Update Product" : "List Product"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  navigate(isEditMode ? "/my-products" : "/products")
                }
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SellItem;
