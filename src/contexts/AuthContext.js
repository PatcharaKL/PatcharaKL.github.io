import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "@firebase/auth";
const AuthContext = createContext({
  currentUser: null,
  register: () => Promise,
  login: () => Promise,
  logout: () => Promise,
  signInWithGoogle: () => Promise,
});

export const useAuth = () => useContext(AuthContext);
export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  function signInWithGoogle(){
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
  }

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  function login(email, password) {
    return signInWithEmailAndPassword(auth,email, password);
  }

  function logout(){
    return signOut(auth)
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  },[])

  const value = {
    currentUser,
    register,
    login,
    logout,
    signInWithGoogle,
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
