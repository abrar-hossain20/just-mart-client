import { createBrowserRouter } from "react-router";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/products",
        element: <Products></Products>,
      },
      {
        path: "/product/:id",
        element: <ProductDetails></ProductDetails>,
      },
      {
        path: "/cart",
        element: <Cart></Cart>,
      },
    ],
  },
  {
    path: "/login",
    element: <Signin></Signin>,
  },
  {
    path: "/signin",
    element: <Signin></Signin>,
  },
  {
    path: "/register",
    element: <Signup></Signup>,
  },
  {
    path: "/signup",
    element: <Signup></Signup>,
  },
]);
