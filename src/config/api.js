// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,

  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,

  // Users
  USER_REGISTER: `${API_BASE_URL}/api/users/register`,
  USER_BY_EMAIL: (email) => `${API_BASE_URL}/api/users/${email}`,

  // Cart
  CART: (email) => `${API_BASE_URL}/api/cart/${email}`,
  CART_ITEM: (email, productId) =>
    `${API_BASE_URL}/api/cart/${email}/${productId}`,

  // Wishlist
  WISHLIST: (email) => `${API_BASE_URL}/api/wishlist/${email}`,
  WISHLIST_ITEM: (email, productId) =>
    `${API_BASE_URL}/api/wishlist/${email}/${productId}`,

  // Orders
  ORDERS: (email) => `${API_BASE_URL}/api/orders/${email}`,
  CREATE_ORDER: `${API_BASE_URL}/api/orders`,

  // Stats
  STATS: `${API_BASE_URL}/api/stats`,
};

export default API_BASE_URL;
