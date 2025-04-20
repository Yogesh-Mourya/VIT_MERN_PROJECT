import Navbar from "./Components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
