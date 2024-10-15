import React, { Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import TV from "../models/TV";
import { Canvas } from "@react-three/fiber";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

function Login() {
  const [showLoader, setShowLoader] = useState(false);
  const { login, loginWithGoogle, signUp } = useFirebaseAuth(); // Get sign-up function
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
        await signUp(email, password); // Firebase sign-up
        console.log("User signed up:", email);
      } else {
        await login(email, password); // Firebase login
        console.log("User logged in:", email);
      }
      setShowLoader(false);
      navigate("/"); // Redirect on success
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
      await loginWithGoogle(); // Attempt Google login
      setShowLoader(false);
      navigate("/");
    } catch (error) {
      setShowLoader(false);
      setError("Failed to sign in with Google.");
    }
  };

  const animations = ["Animation"];

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

      <div className="absolute top-10 flex gap-[30px] items-center">
        <div className="text-5xl font-bold">SANT</div>
      </div>

      <div className="flex justify-center items-center h-[100vh] mt-20 w-full">
        <div className="w-[40%] h-[700px]">
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <pointLight position={[0, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <TV
                position={[0, -0.65, 1]}
                rotation={[0, -1.8, 0]}
                scale={[0.15, 0.15, 0.15]}
              />
              <mesh
                position={[0, -3.5, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
              >
                <planeGeometry args={[50, 50]} />
                <shadowMaterial opacity={0.5} />
              </mesh>
            </Suspense>
          </Canvas>
        </div>

        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg w-full max-w-md text-center">
            <div className="text-lg font-semibold text-[#787878]">
              {isSignUp ? "Sign Up" : "Log In"}
            </div>
            <div className="text-3xl font-semibold">
              {isSignUp ? "Create an Account" : "Welcome Back!"}
            </div>
            <form onSubmit={handleLoginOrSignUp} className="space-y-4 mt-4">
              {error && <p className="text-red-500">{error}</p>}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-semibold py-2 rounded-full shadow hover:bg-gray-200"
              >
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black font-semibold py-2 mt-4 rounded-full shadow hover:bg-gray-200"
            >
              Sign in with Google
            </button>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="mt-4 text-sm text-[#787878] hover:underline"
            >
              {isSignUp
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
