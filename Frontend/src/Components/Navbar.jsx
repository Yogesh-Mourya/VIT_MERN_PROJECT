import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const Navbar = () => {
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
            error.response?.data?.error || "Failed to fetch the role."
          );
          setUserRole(null); // Reset user role on error
        }
      }
    };

    fetchUserRole(); // Call the function to fetch user role
  }, [isLoggedIn]); // Dependency array to run effect when isLoggedIn changes

  const handleLogout = function () {
    localStorage.removeItem("token");
    toast.success("Logout successful");
    window.location.href = "/";
  };

  const renderLinks = () => {
    if (!isLoggedIn || !userRole) {
      return (
        <>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </>
      );
    }

    switch (userRole) {
      case "User":
        return (
          <>
            <Link to="/">Home</Link>
            <Link to="/books">Books</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/my-orders">My Orders</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      case "Vendor":
        return (
          <>
            <Link to="/seller-dashboard">Home</Link>
            <Link to="/my-products">My Products</Link>
            <Link to="/add-books">Add Books</Link>
            <Link to="/orders">Orders</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      case "Admin":
        return (
          <>
            <Link to="/admin-dashboard">Home</Link>
            <Link to="/users">Users</Link>
            <Link to="/sellers">Sellers</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        );
      default:
        return <Link to="/">Home</Link>;
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <div className="text-white font-bold">Book Store</div>
        <div className="space-x-4">{renderLinks()}</div>
      </div>
    </nav>
  );
};

export default Navbar;
