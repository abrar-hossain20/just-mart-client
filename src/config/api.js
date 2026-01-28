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
  USER_PROFILE: (email) => `${API_BASE_URL}/api/users/${email}/profile`,

  // Cart
  CART: (email) => `${API_BASE_URL}/api/cart/${email}`,
  CART_ITEM: (email, productId) =>
    `${API_BASE_URL}/api/cart/${email}/${productId}`,

  // Wishlist
  WISHLIST: (email) => `${API_BASE_URL}/api/wishlist/${email}`,
  WISHLIST_ITEM: (email, productId) =>
    `${API_BASE_URL}/api/wishlist/${email}/${productId}`,

  // Orders
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDERS_BY_EMAIL: (email) => `${API_BASE_URL}/api/orders/${email}`,
  ORDERS_RECEIVED: (email) => `${API_BASE_URL}/api/orders/received/${email}`,
  ORDER_STATUS: (id) => `${API_BASE_URL}/api/orders/${id}/status`,
  ORDER_CANCEL: (id) => `${API_BASE_URL}/api/orders/${id}/cancel`,

  // Ratings
  RATINGS: `${API_BASE_URL}/api/ratings`,
  RATINGS_BY_PRODUCT: (productId) => `${API_BASE_URL}/api/ratings/${productId}`,
  RATING_CHECK: (orderId, productId) =>
    `${API_BASE_URL}/api/ratings/check/${orderId}/${productId}`,

  // Stats
  STATS: `${API_BASE_URL}/api/stats`,
};

export default API_BASE_URL;
