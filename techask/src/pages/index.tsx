import  { useState } from "react"; // Import useState and useEffect
import { Navbar } from "@/components/navbar"; // Import Navbar
import Sidebar from "@/components/Sidebar/Sidebar"; // Import the Sidebar component

// Define types for Item and Godown
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

// Ensure Godown includes items and correctly typed parent_godown
interface Godown {
  id: string;
  name: string;
  parent_godown?: string | null; // parent_godown can be a string or null
  items: Item[]; // Ensure items property is included
}

export default function IndexPage() {
  const [selectedGodown, setSelectedGodown] = useState<Godown | null>(null); // State to hold selected godown details
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null); // State to manage expanded item details
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to manage universal search query

  const fetchGodownDetails = async (godown: Godown) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/godown/${godown.id}`);
      const data: Godown = await response.json();

      // Ensure items property exists
      if (!data.items) {
        data.items = [];
      }
      console.log(data)
      setSelectedGodown(data); // Set the fetched godown and items details
      setExpandedItemId(null); // Reset the expanded item id when selecting a new godown
    } catch (error) {
      console.error("Error fetching godown details:", error);
    }
  };

  console.log(selectedGodown)

  const toggleItemDetails = (itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId)); // Toggle the expanded item ID
  };

  // Universal filter logic: Filter items based on name, category, status, or brand
  const getFilteredItems = (): Item[] => {
    if (!selectedGodown || !selectedGodown.items) return []; // Return empty array if no godown or items

    return selectedGodown.items.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen overflow-hidden">
        <Sidebar setSelectedGodown={fetchGodownDetails} /> {/* Sidebar for selecting godown */}

        {/* Main content area */}
        <div className="flex-1 flex flex-col p-4">
          {selectedGodown ? (
            <>
            

                {/* Universal Filter */}
                <div className="mb-4 text-center">
                  <label className="font-semibold mr-2">Search Items:</label>
                  <input
                    type="text"
                    placeholder="Search by name, category, status, or brand..."
                    className="border p-2 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Items List */}
                <div className="rounded-2xl shadow-md p-6 overflow-y-auto max-h-[70vh] scrollbar-hide ml-8">
                  <h3 className="text-xl font-semibold mb-4">Items:</h3>
                  {getFilteredItems().length > 0 ? (
                    <ul className="space-y-4">
                      {getFilteredItems().map((item) => (
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
                              className={`fas ${
                                expandedItemId === item.item_id ? "fa-chevron-up" : "fa-chevron-down"
                              }`}
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
                                  <li>
                                    Warranty (years): {item.attributes.warranty_years}
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found matching your search criteria.</p>
                  )}
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
