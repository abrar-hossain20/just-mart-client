import React, { useContext, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import MyContainer from "../components/MyContainer";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Signin = () => {
  const [show, setShow] = useState(false);
  const emailRef = useRef(null);

  const {
    signInWithEmailAndPasswordFunc,
    signInWithEmailFunc,
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
          toast.error("Your email is not verified.");
          return;
        }
        setUser(res.user);
        toast.success("Signin successful");
        navigate(from);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.message);
      });
  };

  const handleGoogleSignin = () => {
    console.log("google signin");
    signInWithEmailFunc()
      .then((res) => {
        console.log(res);
        setLoading(false);
        setUser(res.user);
        navigate(from);
        toast.success("Signin successful");
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.message);
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
            Sign in to continue to Social Events
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

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-xs font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignin}
          className="w-full py-3 bg-white text-gray-800 border-2 border-gray-300 rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-300 mb-5 hover:border-indigo-500 hover:bg-indigo-50"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M19.8055 10.2292C19.8055 9.55156 19.7501 8.86719 19.6323 8.19531H10.2002V12.0492H15.6014C15.3775 13.2911 14.6571 14.3898 13.6025 15.0875V17.5867H16.8251C18.7174 15.8449 19.8055 13.2728 19.8055 10.2292Z"
              fill="#4285F4"
            />
            <path
              d="M10.2002 20.0008C12.9517 20.0008 15.2719 19.1152 16.8294 17.5867L13.6068 15.0875C12.7096 15.6973 11.5502 16.0434 10.2044 16.0434C7.54496 16.0434 5.28931 14.2828 4.50324 11.9094H1.17969V14.4816C2.77875 17.6633 6.31103 20.0008 10.2002 20.0008Z"
              fill="#34A853"
            />
            <path
              d="M4.49906 11.9094C4.08277 10.6675 4.08277 9.33672 4.49906 8.09484V5.52266H1.17969C-0.195557 8.24687 -0.195557 11.7564 1.17969 14.4806L4.49906 11.9094Z"
              fill="#FBBC04"
            />
            <path
              d="M10.2002 3.95766C11.6253 3.93594 13.0007 4.47203 14.036 5.45594L16.8933 2.60188C15.1858 0.990313 12.9355 0.107812 10.2002 0.133594C6.31103 0.133594 2.77875 2.47109 1.17969 5.65672L4.49906 8.22891C5.28097 5.85109 7.54077 3.95766 10.2002 3.95766Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

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
