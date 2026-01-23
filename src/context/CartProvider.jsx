import { useState, useEffect, useContext } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import { API_ENDPOINTS } from "../config/api";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user?.email) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.CART(user.email));
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // Fetch full product details for each item
        const productPromises = data.items.map(async (item) => {
          const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(item.productId));
          const product = await res.json();
          return { ...product, quantity: item.quantity };
        });
        const products = await Promise.all(productPromises);
        setCart(products.filter((p) => p));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!user?.email) {
      console.error("User must be logged in to add to cart");
      return;
    }

    // Optimistically update UI
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    try {
      const response = await fetch(API_ENDPOINTS.CART(user.email), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Revert optimistic update
      await fetchCart();
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.email) return;

    const previousCart = [...cart];
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));

    try {
      const response = await fetch(
        API_ENDPOINTS.CART_ITEM(user.email, productId),
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      setCart(previousCart);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user?.email) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const previousCart = [...cart];
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );

    try {
      const response = await fetch(
        API_ENDPOINTS.CART_ITEM(user.email, productId),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setCart(previousCart);
    }
  };

  const clearCart = async () => {
    if (!user?.email) return;

    const previousCart = [...cart];
    setCart([]);

    try {
      const response = await fetch(API_ENDPOINTS.CART(user.email), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setCart(previousCart);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cart.some((item) => item._id === productId);
  };

  const cartInfo = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    loading,
  };

  return (
    <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
