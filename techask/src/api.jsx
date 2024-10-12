// src/api.js
import axios from "axios";

const API_URL = "http://localhost:8000";

// Fetch all items from the FastAPI backend
export const getItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/items/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Create a new item in the database
export const createItem = async (item) => {
  try {
    const response = await axios.post(`${API_URL}/items/`, item);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
  }
};

export const getTestData = async () => {
    try {
      const response = await axios.get(`${API_URL}/test-data/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching test data:", error);
      throw error; // Propagate the error for handling in the component
    }
  };
