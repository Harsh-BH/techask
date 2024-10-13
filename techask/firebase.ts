// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth"; // Import Auth type

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA40xSRZv1w6QvhRS-JoExCcwebWNVyf3I",
  authDomain: "devtask-df3ce.firebaseapp.com",
  projectId: "devtask-df3ce",
  storageBucket: "devtask-df3ce.appspot.com",
  messagingSenderId: "613577849418",
  appId: "1:613577849418:web:20ecfeccb59f5dffee04b3",
  measurementId: "G-CYP9SY0HXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth: Auth = getAuth(app); // Specify the type of auth
