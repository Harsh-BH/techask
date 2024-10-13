import { useState } from "react";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

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

interface Godown {
  id: string;
  name: string;
  parent_godown?: string | null;
  items: Item[];
}

export default function IndexPage() {
  const [selectedGodown, setSelectedGodown] = useState<Godown | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // New state for sidebar visibility

  const fetchGodownDetails = async (godown: Godown) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/godown/${godown.id}`);
      const data: Godown = await response.json();
      if (!data.items) {
        data.items = [];
      }
      setSelectedGodown(data);
      setExpandedItemId(null);
    } catch (error) {
      console.error("Error fetching godown details:", error);
    }
  };

  const toggleItemDetails = (itemId: string) => {
    setExpandedItemId((prev) => (prev === itemId ? null : itemId));
  };

  const getFilteredItems = (): Item[] => {
    if (!selectedGodown || !selectedGodown.items) return [];
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
        {/* Mobile Sidebar Toggle Button */}
        <button
          className="md:hidden text-white bg-blue-500 rounded m-3.5"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          
        </button>

        <Sidebar setSelectedGodown={fetchGodownDetails} isOpen={isSidebarOpen} />

        <div className="flex-1 flex flex-col p-4">
          {selectedGodown ? (
            <>
              <div className="mb-4 text-center">
                <label className="font-semibold mr-2">Search Items:</label>
                <input
                  type="text"
                  placeholder="Search by name, category, status, or brand..."
                  className="border p-2 rounded-lg w-full md:w-1/3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="rounded-2xl shadow-md p-6 overflow-y-auto max-h-[70vh] scrollbar-hide ml-2 md:ml-8">
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
