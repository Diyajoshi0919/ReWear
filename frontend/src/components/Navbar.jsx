// components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { connect, disconnect, account } = useWallet();

  const [open, setOpen] = useState(false);

  const getBtnClass = (targetPath) =>
    `px-4 py-2 rounded-full transition-colors duration-200 whitespace-nowrap
     ${
       currentPath === targetPath
         ? "bg-[#D94F4F] text-white"
         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
     }`;

  return (
    <nav className="bg-white shadow sticky top-0 z-10 p-3 sm:p-4">

      {/* MOBILE TOP BAR — only hamburger */}
      <div className="flex items-center justify-end sm:hidden">
        <button onClick={() => setOpen(!open)} className="text-gray-800">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR (unchanged) */}
      <div
        className="
          hidden sm:flex
          flex-wrap justify-center items-center
          gap-4
        "
      >
        <NavLink to="/" className={getBtnClass("/")}>Home</NavLink>

        <NavLink to="/my-listings" className={getBtnClass("/my-listings")}>
          My Listings
        </NavLink>

        <NavLink to="/swap-requests" className={getBtnClass("/swap-requests")}>
          Swap Requests
        </NavLink>

        <NavLink to="/product-design" className={getBtnClass("/product-design")}>
          Upload Item
        </NavLink>
      </div>

      {/* MOBILE DROPDOWN (only menu items) */}
      {open && (
        <div className="flex flex-col gap-3 mt-3 sm:hidden">

          <NavLink
            to="/"
            className={getBtnClass("/")}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          <NavLink
            to="/my-listings"
            className={getBtnClass("/my-listings")}
            onClick={() => setOpen(false)}
          >
            My Listings
          </NavLink>

          <NavLink
            to="/swap-requests"
            className={getBtnClass("/swap-requests")}
            onClick={() => setOpen(false)}
          >
            Swap Requests
          </NavLink>

          <NavLink
            to="/product-design"
            className={getBtnClass("/product-design")}
            onClick={() => setOpen(false)}
          >
            Upload Item
          </NavLink>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
