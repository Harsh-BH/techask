import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Login from "@/pages/login";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import { Navbar } from "./components/navbar";
import { useFirebaseAuth } from "./hooks/useFirebaseAuth";


function App() {
  const { user, logout } = useFirebaseAuth();

  return (
  
    <Routes>
      
      <Route element={<IndexPage />} path="/" />
      <Route element={<Login />} path="/login" />
     
      <Route element={<AboutPage />} path="/about" />
     
    </Routes>
  
  );
}

export default App;
