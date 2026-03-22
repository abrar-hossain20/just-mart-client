// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_BASE_URL}/api/products`,
  PRODUCTS_BY_SELLER: (email) => `${API_BASE_URL}/api/products/seller/${email}`,
  PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/products/${id}`,

  // Categories
  CATEGORIES: `${API_BASE_URL}/api/categories`,

  // Users
  USER_REGISTER: `${API_BASE_URL}/api/users/register`,
  USER_BY_EMAIL: (email) => `${API_BASE_URL}/api/users/${email}`,
  USER_ROLE: (email) => `${API_BASE_URL}/api/users/${email}/role`,
  USER_PROFILE: (email) => `${API_BASE_URL}/api/users/${email}/profile`,

  // Admin
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_USER_ROLE: (id) => `${API_BASE_URL}/api/admin/users/${id}/role`,
  ADMIN_PRODUCTS: `${API_BASE_URL}/api/admin/products`,
  ADMIN_PRODUCT_BY_ID: (id) => `${API_BASE_URL}/api/admin/products/${id}`,
  ADMIN_ORDERS: `${API_BASE_URL}/api/admin/orders`,
  ADMIN_ORDER_STATUS: (id) => `${API_BASE_URL}/api/admin/orders/${id}/status`,

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
  ORDER_PAYMENT_INITIATE: `${API_BASE_URL}/api/orders/payment/initiate`,
  ORDER_PAYMENT_VERIFY: `${API_BASE_URL}/api/orders/payment/verify`,

  // Ratings
  RATINGS: `${API_BASE_URL}/api/ratings`,
  RATINGS_BY_PRODUCT: (productId) => `${API_BASE_URL}/api/ratings/${productId}`,
  RATING_CHECK: (orderId, productId) =>
    `${API_BASE_URL}/api/ratings/check/${orderId}/${productId}`,

  // Stats
  STATS: `${API_BASE_URL}/api/stats`,
};

export default API_BASE_URL;
