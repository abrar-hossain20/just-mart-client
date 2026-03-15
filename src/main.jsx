import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes/routes";
import AuthProvider from "./context/AuthProvider";
import CartProvider from "./context/CartProvider";
import WishlistProvider from "./context/WishlistProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={2500} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
