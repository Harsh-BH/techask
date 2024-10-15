import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,  // Import this function correctly
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser, // Optional: Import Firebase User type for TypeScript
} from "firebase/auth";
import { auth } from "../../firebase"; // Make sure the path is correct

// Define the user state type (optional for TypeScript)
interface User {
  uid: string;
  email: string | null;
}

// Custom Firebase authentication hook
export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error; // Rethrow error for handling in component
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return { user, loading, login, signUp, logout, loginWithGoogle };
};
