import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../firebaseConfig';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  function signUp(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signIn(email, password) {
    setLoading(true);
    return auth.signInWithEmailAndPassword(email, password)
      .then((firebaseUser) => {
        if (firebaseUser) {
          //do something
        }
      })
      .catch((error) => {
        alert(error);
        setError(error);
      })
      .finally(() => setLoading(false))
  }

  function logOut() {
    setLoading(true);
    return auth.signOut()
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {

        setUser(currentUser);
      }
      else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, [])

  //  useMemo that allows you to memoize expensive functions so that you can avoid calling them on every render
  const memoedValue = useMemo(() => ({
    user,
    signIn,
    logOut,
    signUp,
    loading,
    error
  }), [user, error, loading]);

  return (
    <AuthContext.Provider value={memoedValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext);
}
