import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function signIn(email, password) {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
      .then((firebaseUser) => {
        if (firebaseUser) {
          //do something
        }
      })
      .catch((error) => {
        alert(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function logOut() {
    setLoading(true);
    return signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function resetPassword(email){
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  //  useMemo that allows you to memoize expensive functions so that you can avoid calling them on every render
  const memoedValue = useMemo(
    () => ({
      user,
      signIn,
      logOut,
      signUp,
      loading,
      error,
      resetPassword,
    }),
    [user, error, loading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
