import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { API_ENDPOINTS } from "../config/api";
import { buildAuthHeaders } from "../utils/authHeaders";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(false);

  console.log(auth);
  // console.log("Token:", user?.accessToken);

  const createUserWithEmailAndPasswordFunc = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateProfileFunc = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  };

  const sendEmailVerificationFunc = async () => {
    setLoading(true);

    if (!auth.currentUser) {
      setLoading(false);
      throw new Error("No authenticated user found for email verification.");
    }

    try {
      return await sendEmailVerification(auth.currentUser);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signInWithEmailFunc = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const signoutUserFunc = () => {
    setLoading(true);
    return signOut(auth);
  };
  const sendPassResetEmailFunc = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser?.email) return;

    try {
      await fetch(API_ENDPOINTS.USER_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
          photoURL: firebaseUser.photoURL || "",
        }),
      });
    } catch (error) {
      console.error("Error syncing user with backend:", error);
    }
  };

  const fetchRoleForUser = async (firebaseUser) => {
    if (!firebaseUser?.email) {
      setRole(null);
      return null;
    }

    try {
      const authHeaders = await buildAuthHeaders(firebaseUser);
      const response = await fetch(
        API_ENDPOINTS.USER_ROLE(firebaseUser.email),
        {
          headers: authHeaders,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user role");
      }

      const data = await response.json();
      const userRole = data?.role || "user";
      setRole(userRole);
      return userRole;
    } catch (error) {
      console.error("Error fetching user role:", error);
      setRole("user");
      return "user";
    }
  };

  const refreshUserRole = async () => {
    return fetchRoleForUser(user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      console.log(currUser);
      if (currUser && !currUser.emailVerified) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      setUser(currUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const syncAndFetchRole = async () => {
      if (!user?.email) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      setRoleLoading(true);
      await syncUserWithBackend(user);
      await fetchRoleForUser(user);
      setRoleLoading(false);
    };

    syncAndFetchRole();
  }, [user]);

  const authInfo = {
    user,
    setUser,
    createUserWithEmailAndPasswordFunc,
    signInWithEmailAndPasswordFunc,
    signInWithEmailFunc,
    signoutUserFunc,
    sendPassResetEmailFunc,
    sendEmailVerificationFunc,
    updateProfileFunc,
    loading,
    setLoading,
    role,
    roleLoading,
    isAdmin: role === "admin",
    refreshUserRole,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
