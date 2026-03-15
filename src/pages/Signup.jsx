import { Link, useNavigate } from "react-router";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const [show, setShow] = useState(false);
  const {
    createUserWithEmailAndPasswordFunc,
    updateProfileFunc,
    sendEmailVerificationFunc,
    setLoading,
    signoutUserFunc,
    setUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const displayName = e.target.name?.value;
    const email = e.target.email?.value;
    const password = e.target.password?.value;

    // Email domain validation - only allow student.just.edu.bd
    const validEmailDomain = "@student.just.edu.bd";
    if (!email.endsWith(validEmailDomain)) {
      toast.error(
        "Please use your university email address (e.g., your_roll.department@student.just.edu.bd)",
      );
      return;
    }

    // Password validation
    // Must have an uppercase letter, a lowercase letter, length must be at least 6 characters
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    if (!hasUpperCase) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }

    if (!hasLowerCase) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }

    // 1st step : Create user
    // createUserWithEmailAndPassword(auth, email, password);
    createUserWithEmailAndPasswordFunc(email, password)
      .then((res) => {
        // 2nd step: Update profile
        updateProfileFunc(displayName, "")
          .then(() => {
            console.log(res);
            // 3rd step: Email verification
            sendEmailVerificationFunc()
              .then((res) => {
                console.log(res);
                setLoading(false);

                // Signout user
                signoutUserFunc().then(() => {
                  toast.success("Please verify your email to log in.");
                  setUser(null);
                  navigate("/signin");
                });
              })
              .catch((e) => {
                console.log(e);
                toast.error(e.message);
              });
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.message);
          });
      })
      .catch((e) => {
        console.log(e);
        console.log(e.code);
        if (e.code === "auth/email-already-in-use") {
          toast.error(
            "This email is already registered. Please login instead.",
          );
        } else if (e.code === "auth/weak-password") {
          toast.error("Password must be at least 6 characters long.");
        } else if (e.code === "auth/invalid-email") {
          toast.error("Invalid email format. Please check your email.");
        } else if (e.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(e.message || "An unexpected error occurred.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">
            Join our community using only university email address!
          </p>
        </div>

        <form onSubmit={handleSignup}>
          {/* Name Input */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 text-sm font-semibold">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm transition-colors duration-300 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter your educational email address"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm transition-colors duration-300 outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-gray-600 mt-1.5 leading-snug">
              Email must be in the format: <span className="text-red-700">your_roll.department@student.just.edu.bd</span>
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 text-sm font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                name="password"
                required
                placeholder="Create a strong password"
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
            <p className="text-xs text-gray-600 mt-1.5 leading-snug">
              Must contain at least 6 characters, one uppercase and one
              lowercase letter
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 mb-5 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-5">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
