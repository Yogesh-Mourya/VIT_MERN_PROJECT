import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import AddBook from "./pages/AddBooks";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Wishlist from "./pages/Wishlist";
import Purchase from "./pages/Purchase";
import Orders from "./pages/Order";
import MyProducts from "./pages/MyProduct";
import SellerOrders from "./pages/SellerOrders";
import SellerHome from "./pages/SellerDashboard";
import AdminUsers from "./pages/AdminUser";
import AdminSeller from "./pages/AdminSeller";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-books" element={<AddBook />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/purchase/:bookId" element={<Purchase />} />
          <Route path="/my-orders" element={<Orders />} />
          <Route path="/my-products" element={<MyProducts />} />
          <Route path="/orders" element={<SellerOrders />} />
          <Route path="/seller-dashboard" element={<SellerHome />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/sellers" element={<AdminSeller />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
