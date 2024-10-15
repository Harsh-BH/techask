## Steps to Set Up the Project



TechAsk
TechAsk is a web application that provides a platform for users to explore and manage godowns (warehouses) and their associated items. The application features a responsive design, user authentication, interactive 3D elements using Three.js, and a backend powered by FastAPI and MongoDB.

Features
Firebase Authentication: Secure user authentication using Firebase Auth.
Responsive Design: Mobile-first design that adapts to various screen sizes.
Interactive Sidebar: A dynamic sidebar with animations and smooth transitions.
Item Management: View detailed information about items within godowns.
Search and Filter: Search items by name, category, status, or brand.
Three.js Integration: Interactive 3D elements for enhanced user experience.
Backend with FastAPI: A robust backend server built with FastAPI.
MongoDB Integration: Data storage and retrieval using MongoDB.
Framer Motion Animations: Smooth animations for UI components.


Technologies Used

Frontend:
React.js with TypeScript
Tailwind CSS for styling
Framer Motion for animations
Three.js for 3D graphics
Firebase Auth for authentication

Backend:
FastAPI for building APIs
MongoDB for database

Uvicorn for ASGI server



Important: Use mobile data (JIO) ,as on compus wifi mongodb database wil not connect



### 1. Clone the Repository

```bash
git clone https://github.com/Harsh-BH/techask.git
cd techask
npm install
npm run dev


 2. For Backend


git clone https://github.com/Harsh-BH/techask.git
cd backend
pip install fastapi uvicorn pymongo python-dotenv
uvicorn app:app --host 127.0.0.1 --port 8000 --reload

video link:
https://drive.google.com/file/d/1TwUMBuNhrdn9RSm6wViVtdv1pK_7-r7T/view?usp=sharing

run backend locally for deployment and local host both




