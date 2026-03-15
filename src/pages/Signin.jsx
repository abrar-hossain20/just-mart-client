import React, { useContext, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Signin = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);

  const {
    signInWithEmailAndPasswordFunc,
    signoutUserFunc,
    sendPassResetEmailFunc,
    setLoading,
    setUser,
    user,
  } = useContext(AuthContext);
  const location = useLocation();
  const from = location.state || "/";
  const navigate = useNavigate();

  if (user) {
    return <Navigate to={from} replace />;
  }

  console.log(location);

  // const [email, setEmail] = useState(null);

  const handleSignin = (e) => {
    e.preventDefault();
    const email = e.target.email?.value;
    const password = e.target.password?.value;
    console.log({ email, password });
    signInWithEmailAndPasswordFunc(email, password)
      .then((res) => {
        console.log(res);
        setLoading(false);

        if (!res.user?.emailVerified) {
          toast.error("Please verify your email first.");
          signoutUserFunc().finally(() => {
            setUser(null);
            setLoading(false);
          });
          return;
        }
        setUser(res.user);
        toast.success("Signin successful");
        navigate(from);
      })
      .catch((e) => {
        console.log(e);
        if (
          e.code === "auth/user-not-found" ||
          e.code === "auth/invalid-credential"
        ) {
          toast.error(
            "No account found with this email. Redirecting to signup...",
          );
          setTimeout(() => navigate("/signup"), 1500);
        } else {
          toast.error(e.message);
        }
      });
  };

  const handleForgetPassword = () => {
    console.log();
    const email = emailRef.current.value;
    sendPassResetEmailFunc(email)
      .then(() => {
        setLoading(false);
        toast.success("Check your email to reset password");
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  // console.log();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to continue to JUST EMART and explore our amazing products!
          </p>
        </div>

        <form onSubmit={handleSignin}>
          {/* Email Input */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 text-sm font-semibold">
              Email Address
            </label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm transition-colors duration-300 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label className="block mb-2 text-gray-800 text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg text-sm transition-colors duration-300 outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 p-1 flex items-center"
              >
                {show ? <IoEyeOff size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Forget Password */}
          <div className="text-right mb-5">
            <button
              type="button"
              onClick={handleForgetPassword}
              className="text-indigo-500 text-xs font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mb-5 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-5">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
