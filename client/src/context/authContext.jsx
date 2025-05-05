import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';

// 1. Create the context
const UserContext = createContext();

// 2. Create the provider
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true); // optional but explicit

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null); // null = explicitly logged out
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        createUser,
        signIn,
        logout,
        signInWithGoogle,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 3. Custom hook for consuming context
export const UserAuth = () => useContext(UserContext);
