import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import {
  FaUserCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaSave,
  FaEdit,
} from "react-icons/fa";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    buyingContactNumber: "",
    sellingContactNumber: "",
    address: {
      locationType: "Inside Campus",
      customAddress: "",
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_PROFILE(user.email));
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            buyingContactNumber: data.profile.buyingContactNumber || "",
            sellingContactNumber: data.profile.sellingContactNumber || "",
            address: data.profile.address || {
              locationType: "Inside Campus",
              customAddress: "",
            },
          });
        }
      } else {
        console.error("Failed to fetch profile:", response.statusText);
        // Don't show error to user, just use default profile
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Don't show error to user, just use default profile
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate phone numbers (basic validation for 10-15 digits)
    const phoneRegex = /^[0-9]{10,15}$/;

    if (
      profile.buyingContactNumber &&
      !phoneRegex.test(profile.buyingContactNumber.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.buyingContactNumber =
        "Please enter a valid phone number (10-15 digits)";
    }

    if (
      profile.sellingContactNumber &&
      !phoneRegex.test(profile.sellingContactNumber.replace(/[\s\-\(\)]/g, ""))
    ) {
      newErrors.sellingContactNumber =
        "Please enter a valid phone number (10-15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setProfile({
        ...profile,
        address: {
          ...profile.address,
          [addressField]: value,
        },
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.USER_PROFILE(user.email), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        // Refetch the profile to confirm it was saved
        await fetchProfile();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const hasContactNumbers =
    profile.buyingContactNumber || profile.sellingContactNumber;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FaUserCircle className="text-5xl text-teal-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Warning Alert */}
        {!hasContactNumbers && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> You need to add at least one
                  contact number to buy or sell products on the platform.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Contact Numbers Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaPhone className="text-teal-600" />
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Buying Contact Number */}
                <div>
                  <label
                    htmlFor="buyingContactNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Buying Contact Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="buyingContactNumber"
                    name="buyingContactNumber"
                    value={profile.buyingContactNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.buyingContactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter your buying contact number"
                  />
                  {errors.buyingContactNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.buyingContactNumber}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    This number will be used when you purchase products
                  </p>
                </div>

                {/* Selling Contact Number */}
                <div>
                  <label
                    htmlFor="sellingContactNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Selling Contact Number{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="sellingContactNumber"
                    name="sellingContactNumber"
                    value={profile.sellingContactNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.sellingContactNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter your selling contact number"
                  />
                  {errors.sellingContactNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sellingContactNumber}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Buyers will use this number to contact you about your
                    products
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-teal-600" />
                Address Information
              </h2>

              <div className="space-y-4">
                {/* Location Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location Type
                  </label>
                  <div className="space-y-3">
                    {/* Inside Campus */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        profile.address.locationType === "Inside Campus"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-teal-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        value="Inside Campus"
                        checked={
                          profile.address.locationType === "Inside Campus"
                        }
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            address: {
                              locationType: e.target.value,
                              customAddress: "",
                            },
                          });
                        }}
                        disabled={!isEditing}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        Inside Campus
                      </span>
                    </label>

                    {/* Near Campus */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        profile.address.locationType === "Near Campus"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-teal-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        value="Near Campus"
                        checked={profile.address.locationType === "Near Campus"}
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            address: {
                              locationType: e.target.value,
                              customAddress: "",
                            },
                          });
                        }}
                        disabled={!isEditing}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        Near Campus
                      </span>
                    </label>

                    {/* Outside Campus */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        profile.address.locationType === "Outside Campus"
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-teal-300"
                      } ${!isEditing ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <input
                        type="radio"
                        name="locationType"
                        value="Outside Campus"
                        checked={
                          profile.address.locationType === "Outside Campus"
                        }
                        onChange={(e) => {
                          setProfile({
                            ...profile,
                            address: {
                              locationType: e.target.value,
                              customAddress: profile.address.customAddress,
                            },
                          });
                        }}
                        disabled={!isEditing}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-3 font-medium text-gray-700">
                        Outside Campus
                      </span>
                    </label>
                  </div>
                </div>

                {/* Custom Address Input (only for Outside Campus) */}
                {profile.address.locationType === "Outside Campus" && (
                  <div>
                    <label
                      htmlFor="customAddress"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="customAddress"
                      name="customAddress"
                      value={profile.address.customAddress}
                      onChange={(e) => {
                        setProfile({
                          ...profile,
                          address: {
                            ...profile.address,
                            customAddress: e.target.value,
                          },
                        });
                      }}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      placeholder="Enter your complete address:"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please provide your full address for delivery purposes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                    setErrors({});
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition disabled:bg-gray-400"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Why we need this information:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>
              Contact numbers are required to facilitate communication between
              buyers and sellers
            </li>
            <li>
              Buying contact number will be shared with sellers when you make a
              purchase
            </li>
            <li>
              Selling contact number will be visible on your product listings
            </li>
            <li>
              Address information helps in planning deliveries and shipping
            </li>
            <li>
              All information is kept secure and used only for transaction
              purposes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
