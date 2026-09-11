// components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#2E2E2E] text-gray-200 py-12 px-6 md:px-12">

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid 
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                      gap-12">

        {/* BRAND & SOCIAL */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            ReWear Clothing
          </h2>

          <p className="text-gray-400 mb-5 leading-relaxed text-sm">
            Give your clothes a second life. Join our mission for  
            sustainable fashion and conscious living.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* IMPORTANT LINKS */}
        <div>
          <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">
            Important Links
          </h3>

          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Donate Clothes</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Request Pickup</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Partner With Us</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Our Projects</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Careers</a></li>
          </ul>
        </div>

        {/* LEARN MORE */}
        <div>
          <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">
            Learn More
          </h3>

          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Refund Policy</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">FAQs</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Sustainability Report</a></li>
            <li><a href="#" className="hover:text-white text-gray-300 text-sm">Media & Press</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">
            Contact Us
          </h3>

          <p className="text-gray-300 text-sm mb-1">info@rewear.org</p>
          <p className="text-gray-300 text-sm">+91 96XXX XXXXX</p>

          <p className="text-gray-400 mt-4 text-sm">
            Office & Collection Center:
          </p>

          <p className="text-gray-300 text-sm leading-relaxed">
            12 Green Street, Sector 22,<br /> Gurugram, Haryana 122015
          </p>
        </div>

      </div>

      {/* SEPARATOR */}
      <hr className="my-10 border-gray-700" />

      {/* COPYRIGHT */}
      <div className="text-center text-gray-400 text-xs sm:text-sm">
        © 2025 ReWear Clothing — Fashion that goes further ♻️
      </div>

    </footer>
  );
};

export default Footer;
