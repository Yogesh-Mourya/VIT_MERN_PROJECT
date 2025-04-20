import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import SellerHome from "./SellerDashboard"
import AdminDashboard from "./AdminDashboard";  

const Home = () => {
  const [userRole, setUserRole] = useState(null); // State to hold the user role
  const isLoggedIn = !!localStorage.getItem("token"); // Check if user is logged in

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token"); // Get the token from local storage
      if (token) {
        try {
          const response = await api.post("/get-role", { token }); // Make the API call
          setUserRole(response.data.role); // Set the user role from the response
        } catch (error) {
          toast.error(
            error.response?.data?.error || "Error fetching user role."
          );
          console.error("Error fetching user role:", error);
          setUserRole(null); // Reset user role on error
        }
      }
    };

    fetchUserRole(); // Call the function to fetch user role
  }, [isLoggedIn]); // Dependency array to run effect when isLoggedIn changes

  if (userRole == "Vendor") {
    return <SellerHome />;
  }
  if (userRole == "Admin") {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-5xl font-extrabold mb-4 text-indigo-600">
          Welcome to Our Book Store
        </h1>
        <p className="text-lg mb-6 text-gray-700">
          Discover a wide range of books, from bestsellers to classics. Whether
          you&apos;re a reader, a vendor, or an admin, we have something for
          everyone!
        </p>
      </div>

      <div className="mt-10 p-8 bg-white shadow-lg rounded-lg w-3/4">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Features</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>📚 Browse a vast collection of books.</li>
          <li>💖 Add books to your wishlist for later.</li>
          <li>🛒 Purchase books easily and securely.</li>
          <li>📦 Vendors can add their books for sale.</li>
          <li>📊 Admins can manage users, vendors, and orders.</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
