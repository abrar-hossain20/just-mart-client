import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { buildAuthHeaders } from "../utils/authHeaders";

const SellerRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [checkingSellerInfo, setCheckingSellerInfo] = useState(true);
  const [hasSellerInfo, setHasSellerInfo] = useState(false);

  useEffect(() => {
    const fetchSellerProfile = async () => {
      if (!user?.email) {
        setCheckingSellerInfo(false);
        setHasSellerInfo(false);
        return;
      }

      try {
        setCheckingSellerInfo(true);
        const authHeaders = await buildAuthHeaders(user);
        const response = await fetch(API_ENDPOINTS.USER_PROFILE(user.email), {
          headers: authHeaders,
        });
        if (!response.ok) {
          throw new Error("Failed to fetch seller profile");
        }

        const data = await response.json();
        const sellerContact = data?.profile?.sellingContactNumber?.trim();
        setHasSellerInfo(Boolean(sellerContact));
      } catch (error) {
        console.error("Error checking seller profile:", error);
        setHasSellerInfo(false);
      } finally {
        setCheckingSellerInfo(false);
      }
    };

    fetchSellerProfile();
  }, [user]);

  if (checkingSellerInfo) {
    return (
      <div className="h-[97vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasSellerInfo) {
    return (
      <Navigate
        to="/profile"
        replace
        state={{
          from: location.pathname + location.search,
          sellerInfoRequired: true,
        }}
      />
    );
  }

  return children;
};

export default SellerRoute;
