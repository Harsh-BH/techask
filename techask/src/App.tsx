import { Route, Routes, Navigate } from "react-router-dom";
import IndexPage from "@/pages/index";
import Login from "@/pages/login";
import AboutPage from "@/pages/about";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";

function PrivateRoute({ children }) {
  const { user } = useFirebaseAuth(); // Check if the user is logged in

  return user ? children : <Navigate to="/login" replace />; // Redirect to login if not authenticated
}

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
