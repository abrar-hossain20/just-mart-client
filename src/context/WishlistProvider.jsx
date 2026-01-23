import { useState, useEffect, useContext } from "react";
import { WishlistContext } from "./WishlistContext";
import { AuthContext } from "./AuthContext";
import { API_ENDPOINTS } from "../config/api";

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user?.email) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.WISHLIST(user.email));
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // Fetch full product details for each item
        const productPromises = data.items.map((item) =>
          fetch(API_ENDPOINTS.PRODUCT_BY_ID(item.productId)).then((res) =>
            res.json(),
          ),
        );
        const products = await Promise.all(productPromises);
        setWishlistItems(products.filter((p) => p)); // Filter out null/undefined
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    if (!user?.email) {
      console.error("User must be logged in to add to wishlist");
      return;
    }

    // Optimistically update UI
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item._id === product._id);
      if (exists) return prevItems;
      return [...prevItems, product];
    });

    try {
      const response = await fetch(API_ENDPOINTS.WISHLIST(user.email), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Revert optimistic update on error
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item._id !== product._id),
      );
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user?.email) return;

    // Optimistically update UI
    const previousItems = [...wishlistItems];
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId),
    );

    try {
      const response = await fetch(
        API_ENDPOINTS.WISHLIST_ITEM(user.email, productId),
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      // Revert on error
      setWishlistItems(previousItems);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const clearWishlist = async () => {
    if (!user?.email) return;

    const previousItems = [...wishlistItems];
    setWishlistItems([]);

    try {
      // Remove all items one by one
      await Promise.all(
        previousItems.map((item) =>
          fetch(API_ENDPOINTS.WISHLIST_ITEM(user.email, item._id), {
            method: "DELETE",
          }),
        ),
      );
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      setWishlistItems(previousItems);
    }
  };

  const getWishlistItemsCount = () => {
    return wishlistItems.length;
  };

  const wishlistInfo = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistItemsCount,
    loading,
  };

  return (
    <WishlistContext.Provider value={wishlistInfo}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
