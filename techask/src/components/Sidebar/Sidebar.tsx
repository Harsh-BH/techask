import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Define types for Item
interface Item {
  item_id: string;
  name: string;
  quantity: number;
  category: string;
  price: number;
  status: string;
  brand: string;
  image_url: string;
  attributes: {
    type: string;
    material: string;
    warranty_years: number;
  };
}

// Define types for Godown
interface Godown {
  id: string;
  name: string;
  parent_godown?: string | null; // parent_godown can be a string or null
  items: Item[]; // Ensure items property is included
}

// Define props for Sidebar component
interface SidebarProps {
  setSelectedGodown: (godown: Godown) => void; // Function to set selected godown
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedGodown }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true); // Sidebar state
  const [godowns, setGodowns] = useState<Godown[]>([]); // State for godown data
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // State to track expanded godowns
  const [searchQuery, setSearchQuery] = useState<string>(''); // State to manage search query
  const [isMobile, setIsMobile] = useState<boolean>(false); // State to track if the device is mobile

  useEffect(() => {
    // Function to check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768; // Set your mobile breakpoint here
      setIsMobile(mobile);

      // On desktop, always keep sidebar open
      if (!mobile) {
        setIsOpen(true);
      }
    };

    // Initial check
    checkMobile();

    // Add event listener on resize
    window.addEventListener('resize', checkMobile);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Fetch the godown data from FastAPI
    const fetchGodowns = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/godown'); // FastAPI endpoint to fetch all godowns
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Godown[] = await response.json();
        setGodowns(data); // Set the fetched data into the godowns state
      } catch (error) {
        console.error('Error fetching godowns:', error);
      }
    };
    fetchGodowns();
  }, []);

  const getChildGodowns = (parentId: string): Godown[] => {
    return godowns.filter((godown) => godown.parent_godown === parentId);
  };

  const toggleDropdown = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] })); // Toggle the expanded state for the given id
  };

  const renderGodownTree = (parentId: string) => {
    const childGodowns = getChildGodowns(parentId);
    const isExpanded = expanded[parentId]; // Check if this parent is expanded

    return (
      <ul
        className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {childGodowns.map((godown) => (
          <li key={godown.id}>
            <div className="flex items-center">
              <button
                onClick={() => {
                  setSelectedGodown(godown); // Set selected godown
                  toggleDropdown(godown.id); // Toggle dropdown for this godown
                }}
                className="text-left block w-full px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center text-white"
              >
                <i className={`fas fa-warehouse mr-2`}></i>
                {godown.name}
                {/* Only show the toggle icon if the godown has children (sub-godowns) */}
                {getChildGodowns(godown.id).length > 0 && (
                  <i
                    className={`fas ${
                      expanded[godown.id] ? 'fa-chevron-up' : 'fa-chevron-down'
                    } ml-auto`}
                  ></i>
                )}
              </button>
            </div>
            {/* Render child godowns recursively */}
            {renderGodownTree(godown.id)}
          </li>
        ))}
      </ul>
    );
  };

  // Filtered godowns based on the search query
  const filteredGodowns = godowns.filter(
    (godown) =>
      godown.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getChildGodowns(godown.id).some((child) =>
        child.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <>
      {/* Sidebar Toggle Button - only visible on mobile when sidebar is closed */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 text-gray-700 bg-gray-300 hover:bg-gray-400 focus:outline-none p-2 rounded-full transition-colors duration-200 ease-in-out z-50 scrollbar-hide"
        >
          <i className="fas fa-bars" />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)} // Close sidebar when clicking outside
        ></div>
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-screen text-white bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out scrollbar-hide ${
          isMobile
            ? isOpen
              ? 'translate-x-0 w-full' // Full width on mobile when open
              : '-translate-x-full w-full' // Move out of view when closed
            : 'translate-x-0 w-64' // Always open on desktop
        }`}
      >
 
        {/* Sidebar Content */}
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <h1
              className={`text-lg font-bold ${
                isOpen || !isMobile ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            >
              Godowns
            </h1>
          </div>

          {/* Search Input */}
          {(isOpen || !isMobile) && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search Godowns..."
                className="border p-2 rounded-lg w-full bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Godown Tree */}
          <nav className="mt-4 overflow-y-auto flex-1">
            <ul className="flex flex-col">
              {/* Render Filtered Godowns with null parent ID */}
              {filteredGodowns
                .filter((g) => g.parent_godown === null)
                .map((godown) => (
                  <li key={godown.id}>
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setSelectedGodown(godown); // Set selected godown
                          toggleDropdown(godown.id); // Toggle dropdown for this godown
                        }}
                        className="text-left block w-full px-4 py-2 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center text-white"
                      >
                        <i className={`fas fa-warehouse mr-2`}></i>
                        {godown.name}
                        {/* Only show the toggle icon if the godown has children (sub-godowns) */}
                        {getChildGodowns(godown.id).length > 0 && (
                          <i
                            className={`fas ${
                              expanded[godown.id] ? 'fa-chevron-up' : 'fa-chevron-down'
                            } ml-auto`}
                          ></i>
                        )}
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
    </>
  );
};

export default Sidebar;
