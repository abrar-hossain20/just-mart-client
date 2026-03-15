import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
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

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(auth);

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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      console.log(currUser);
      if (currUser && !currUser.emailVerified) {
        setUser(null);
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

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
