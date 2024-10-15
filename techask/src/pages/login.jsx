import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import Loader from "../components/Loader/Loader";
import TV from "../models/TV";
import { Canvas } from "@react-three/fiber";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

function Login() {
  const [showLoader, setShowLoader] = useState(false);
  const { login, loginWithGoogle, signUp } = useFirebaseAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLoginOrSignUp = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
        console.log("User signed up:", email);
      } else {
        await login(email, password);
        console.log("User logged in:", email);
      }
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      setShowLoader(false);
      setError(
        isSignUp
          ? "Failed to sign up. Please try again."
          : "Failed to log in. Please check your credentials."
      );
    }
  };

  const handleGoogleLogin = async () => {
    setShowLoader(true);
    try {
      await loginWithGoogle();
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      setShowLoader(false);
      setError("Failed to sign in with Google.");
    }
  };

  const animations = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div
      className="h-screen flex flex-col items-center relative overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 20, 147, 0.3), transparent 80%)`,
        backdropFilter: "blur(10px)",
      }}
    >
      {showLoader && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-70">
          <Loader />
        </div>
      )}

      <motion.div
        className="absolute top-10 flex gap-[30px] items-center"
        {...animations}
      >
        <div className="text-5xl font-bold">GOLDFORKGP</div>
      </motion.div>

      <div className="flex justify-center items-center h-[100vh] mt-20 w-full">
        <motion.div className="w-[40%] h-[700px]" {...animations}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={5} castShadow />
            <Suspense fallback={null}>
              <TV
                position={[0, -0.65, 1]}
                rotation={[0, -1.8, 0]}
                scale={[0.15, 0.15, 0.15]}
              />
            </Suspense>
          </Canvas>
        </motion.div>

        <motion.div
          className="w-1/2 flex justify-center items-center"
          {...animations}
        >
         <div
  className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg w-full max-w-md text-center"
  style={{
    background: "rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    padding: "32px",
  }}
>
  <div className="text-lg font-semibold text-gray-600">
    {isSignUp ? "Sign Up" : "Log In"}
  </div>
  <div className="text-3xl font-semibold text-black mt-2 mb-4">
    {isSignUp ? "Create an Account" : "Welcome Back!"}
  </div>

  <form onSubmit={handleLoginOrSignUp} className="space-y-4">
    {error && <p className="text-red-500">{error}</p>}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    <button
      type="submit"
      className="w-full bg-white shadow-2xl py-3 rounded-md  transition duration-300"
    >
      {isSignUp ? "Sign Up" : "Log In"}
    </button>
  </form>

  <button
    onClick={handleGoogleLogin}
    className="w-full bg-white  py-3 mt-4 rounded-md  transition duration-300 flex items-center justify-center"
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png
"
      alt="Google"
      className="w-5 h-5 mr-2"
    />
    Sign in with Google
  </button>

  <button
    onClick={() => setIsSignUp(!isSignUp)}
    className="mt-4 text-sm text-gray-600 hover:underline"
  >
    {isSignUp
      ? "Already have an account? Log In"
      : "Don't have an account? Sign Up"}
  </button>
</div>

        </motion.div>
      </div>
    </div>
  );
}

export default Login;
