import { Link } from "react-router-dom";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track if sidebar is open

  return (
    <div className={`fixed top-0 left-0 h-full ${isOpen ? "w-[40%]" : "w-16"} bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out z-50`}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          console.log("Sidebar open:", !isOpen); // Debugging: check if state is toggling
        }}
        className="absolute top-4 left-4 text-white bg-gray-700 hover:bg-gray-600 focus:outline-none p-2 rounded-full transition-colors duration-200 ease-in-out z-50"
      >
        {isOpen ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
      </button>

      {/* Sidebar Content */}
      <div className={`flex flex-col ${isOpen ? "w-full" : "w-16"} h-full p-4 transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className={`text-lg font-bold ${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
            My App
          </h1>
        </div>

        <nav className="mt-10">
          <ul className="flex flex-col">
            <li>
              <Link
                to="/"
                className={`block px-4 py-2 mt-2 text-sm font-semibold hover:bg-gray-700 rounded-lg transition-all duration-200 ease-in-out ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block px-4 py-2 mt-2 text-sm font-semibold hover:bg-gray-700 rounded-lg transition-all duration-200 ease-in-out ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                About
              </Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
