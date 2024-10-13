import { Route, Routes, Navigate } from "react-router-dom";
import IndexPage from "@/pages/index"; // Ensure this is also declared in your global.d.ts if needed
import Login from "@/pages/login"; // Ensure this is declared in your global.d.ts if needed
import AboutPage from "@/pages/about";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";


function App() {
  const { user } = useFirebaseAuth(); // Get user from auth hook

  return (
    <Routes>
      <Route path="/" element={user ? <IndexPage /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
