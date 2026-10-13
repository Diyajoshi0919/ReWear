import React from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLanding from "./pages/HomeLanding";
import BrowseItems from "./pages/BrowseItems";
import MyListings from "./pages/MyListings";
import SwapRequests from "./pages/SwapRequests";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProductDesign from "./pages/ProductDesign";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/browse-items" element={<BrowseItems />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Pages that need a logged-in user */}
        <Route path="/swap-requests" element={<ProtectedRoute><SwapRequests /></ProtectedRoute>} />
        <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="/product-design" element={<ProtectedRoute><ProductDesign /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {shouldShowNavbar && <Footer />}
    </>
  );
}

export default App;
