import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser, // Import User type from Firebase
} from "firebase/auth";
import { auth } from "../../firebase"; // Ensure this path is correct based on your project structure

// Define the type for the user state
interface User {
  uid: string;
  email: string | null; // Email can be null if the user is signed out
  // Add any other user properties you want to track
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null); // User state can be User type or null
  const [loading, setLoading] = useState<boolean>(true); // loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // If a user is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
      } else {
        // If no user is signed in
        setUser(null);
      }
      setLoading(false); // Set loading to false after user state is determined
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Handle post-login actions, like redirecting the user
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error; // Let the component handle the error
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return { user, loading, login, logout, loginWithGoogle };
};
