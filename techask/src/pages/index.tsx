import { useState, useEffect } from "react";
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
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const fetchGodownDetails = async (godown: Godown) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/godown/${godown.id}`);
      const data: Godown = await response.json();
      setSelectedGodown(data);
      setCategories(getUniqueCategories(data.items));
    } catch (error) {
      console.error("Error fetching godown details:", error);
    }
  };

  const getUniqueCategories = (items: Item[]): string[] => {
    const categories = items.map((item) => item.category);
    return Array.from(new Set(categories));
  };

  const getFilteredItems = (): Item[] => {
    if (!selectedGodown || !selectedGodown.items) return [];
    return selectedGodown.items.filter((item) => {
      const matchesCategory =
        !selectedCategory || item.category === selectedCategory;
      const matchesQuery =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesQuery;
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Sidebar Toggle for Mobile */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <i className="fas fa-times"></i> : <i className="fas fa-bars"></i>}
        </button>

        {/* Sidebar for Desktop and Mobile */}
        <div
          className={`fixed inset-y-0 left-0 w-64 z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform md:relative md:translate-x-0`}
        >
          <Sidebar setSelectedGodown={fetchGodownDetails} />
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left side: List of items with scroll */}
          <div className="w-full md:w-2/5 h-1/2 md:h-full overflow-y-auto p-4 scrollbar-hide">
            <div className="mb-4 text-center">
              <label className="font-semibold mr-2">Search Items:</label>
              <input
                type="text"
                placeholder="Search by name, category, status, or brand..."
                className="border p-2 rounded-lg w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              {getFilteredItems().map((item) => (
                <div
                  key={item.item_id}
                  className={`cursor-pointer p-4 flex items-center gap-4 hover:bg-gray-100 rounded-lg transition-all duration-300 ${
                    selectedItem?.item_id === item.item_id ? "bg-blue-100" : "bg-white"
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Product details */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto p-4 scrollbar-hide">
            {selectedItem ? (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
                />
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Item ID:</span> {selectedItem.item_id}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> ${selectedItem.price.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {selectedItem.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Category:</span> {selectedItem.category}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span> {selectedItem.status}
                  </p>
                  <p>
                    <span className="font-semibold">Brand:</span> {selectedItem.brand}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Attributes:</h4>
                  <ul className="list-disc list-inside">
                    <li>
                      <span className="font-semibold">Type:</span> {selectedItem.attributes.type}
                    </li>
                    <li>
                      <span className="font-semibold">Material:</span> {selectedItem.attributes.material}
                    </li>
                    <li>
                      <span className="font-semibold">Warranty:</span>{" "}
                      {selectedItem.attributes.warranty_years} years
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600">Select an item to view details.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
