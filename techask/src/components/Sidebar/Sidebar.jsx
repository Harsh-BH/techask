import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = ({ setSelectedGodown }) => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar state
  const [godowns, setGodowns] = useState([]); // State for godown data
  const [expanded, setExpanded] = useState({}); // State to track expanded godowns

  useEffect(() => {
    // Fetch the godown data from FastAPI
    const fetchGodowns = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/godown'); // FastAPI endpoint to fetch all godowns
        const data = await response.json();
        setGodowns(data); // Set the fetched data into the godowns state
      } catch (error) {
        console.error('Error fetching godowns:', error);
      }
    };
    fetchGodowns();
  }, []);

  const getChildGodowns = (parentId) => {
    return godowns.filter(godown => godown.parent_godown === parentId);
  };

  const toggleDropdown = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] })); // Toggle the expanded state for the given id
  };

  const renderGodownTree = (parentId) => {
    const childGodowns = getChildGodowns(parentId);
    const isExpanded = expanded[parentId]; // Check if this parent is expanded

    return (
      <ul className={`pl-4 transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
        {childGodowns.map((godown) => (
          <li key={godown.id}>
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSelectedGodown(godown); // Set selected godown
                  toggleDropdown(godown.id); // Toggle dropdown for this godown
                }}
                className="text-left block w-full px-4 py-2 hover:bg-gray-700 rounded-lg transition-all flex items-center"
              >
                <i className={`fas fa-warehouse mr-2`}></i>{godown.name}
                <i className={`fas ${expanded[godown.id] ? 'fa-chevron-up' : 'fa-chevron-down'} ml-auto`}></i> {/* Toggle icon */}
              </button>
            </div>
            {/* Render child godowns recursively */}
            {renderGodownTree(godown.id)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`fixed top-0 left-0 h-screen ${isOpen ? 'w-[40%]' : 'w-16'} bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out z-50 overflow-y-auto`}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 left-4 text-white bg-gray-700 hover:bg-gray-600 focus:outline-none p-2 rounded-full transition-colors duration-200 ease-in-out z-50"
      >
        {isOpen ? <i className="fas fa-times" /> : <i className="fas fa-bars" />}
      </button>

      {/* Sidebar Content */}
      <div className={`flex flex-col ${isOpen ? 'w-full' : 'w-16'} h-full p-4 transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <h1 className={`text-lg font-bold ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>Godowns</h1>
        </div>

        {/* Godown Tree */}
        <nav className="mt-10">
          <ul className="flex flex-col">
            {/* Render Base Godowns with null parent ID */}
            {godowns.filter(g => g.parent_godown === null).map((godown) => (
              <li key={godown.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedGodown(godown); // Set selected godown
                      toggleDropdown(godown.id); // Toggle dropdown for this godown
                    }}
                    className="text-left block w-full px-4 py-2 hover:bg-gray-700 rounded-lg transition-all flex items-center"
                  >
                    <i className={`fas fa-warehouse mr-2`}></i>{godown.name}
                    <i className={`fas ${expanded[godown.id] ? 'fa-chevron-up' : 'fa-chevron-down'} ml-auto`}></i> {/* Toggle icon */}
                  </button>
                </div>
                {/* Render child godowns as a dropdown */}
                {renderGodownTree(godown.id)}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
