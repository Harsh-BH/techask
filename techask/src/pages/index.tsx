// src/pages/index.js
import React, { useState } from "react"; // Import useState
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import Sidebar from "@/components/Sidebar/Sidebar"; // Import the Sidebar component
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";

export default function IndexPage() {
  const [testData, setTestData] = useState(null); // State to hold test data
  const [loading, setLoading] = useState(false); // State to manage loading
  const [selectedGodown, setSelectedGodown] = useState(null); // State to hold selected godown details
  const [expandedItemId, setExpandedItemId] = useState(null); // State to manage expanded item details

  const handleTestDatabase = async () => {
    setLoading(true);
    try {
      const data = await getTestData(); // Call the API function
      setTestData(data); // Set the response data
    } catch (error) {
      console.error("Error testing database:", error);
      setTestData(null); // Reset test data on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const fetchGodownDetails = async (godown) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/godown/${godown.id}`);
      const data = await response.json();
      setSelectedGodown(data); // Set the fetched godown and items details
      setExpandedItemId(null); // Reset the expanded item id when selecting a new godown
    } catch (error) {
      console.error("Error fetching godown details:", error);
    }
  };

  const toggleItemDetails = (itemId) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId)); // Toggle the expanded item ID
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen overflow-hidden">
        
        <Sidebar setSelectedGodown={fetchGodownDetails} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-4">
          {selectedGodown ? (
            <>
              {/* Godown Details */}
              <div className="shadow-lg rounded-2xl p-6 overflow-auto flex-grow mb-4">
                <h2 className="text-2xl font-bold mb-2 text-center">
                  {selectedGodown.godown.name}
                </h2>
                <p className="mb-2 text-center">ID: {selectedGodown.godown.id}</p>
                {selectedGodown.godown.parent_godown && (
                  <p className="mb-4 text-center">Parent ID: {selectedGodown.godown.parent_godown}</p>
                )}

                {/* Items List */}
                <div className="rounded-2xl shadow-md p-6 overflow-y-auto max-h-[70vh] scrollbar-hide ml-8 ">
                  <h3 className="text-xl font-semibold mb-4">Items:</h3>
                  {selectedGodown.items.length > 0 ? (
                    <ul className="space-y-4">
                      {selectedGodown.items.map((item) => (
                        <li
                          key={item.item_id}
                          className="cursor-pointer p-3 hover:bg-gray-200 rounded-lg transition duration-300"
                        >
                          <div
                            onClick={() => toggleItemDetails(item.item_id)}
                            className="flex justify-between items-center"
                          >
                            <span>{item.name}</span>
                            <i
                              className={`fas ${expandedItemId === item.item_id ? "fa-chevron-up" : "fa-chevron-down"}`}
                            ></i>
                          </div>

                          {/* Item details with animations */}
                          <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden transform ${
                              expandedItemId === item.item_id
                                ? "max-h-full opacity-100 scale-100"
                                : "max-h-0 opacity-0 scale-95"
                            }`}
                          >
                            {expandedItemId === item.item_id && (
                              <div className="ml-4 mt-2 bg-gray-100 p-4 rounded shadow-md transition-transform duration-300">
                                <p>Item ID: {item.item_id}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Category: {item.category}</p>
                                <p>Price: ${item.price.toFixed(2)}</p>
                                <p>Status: {item.status}</p>
                                <p>Brand: {item.brand}</p>
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="mt-2 w-32 h-auto rounded"
                                />
                                <h4 className="mt-2 font-semibold">Attributes:</h4>
                                <ul>
                                  <li>Type: {item.attributes.type}</li>
                                  <li>Material: {item.attributes.material}</li>
                                  <li>Warranty (years): {item.attributes.warranty_years}</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found for this godown.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Message prompting to select a godown
            <div className="flex items-center justify-center h-full">
              <h2 className="text-2xl font-bold text-gray-600">
                Please select a godown to view details.
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
