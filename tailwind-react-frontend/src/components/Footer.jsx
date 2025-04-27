import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-black py-6 w-full">
      <div className="container mx-auto flex justify-between items-center px-6">
        
        {/* Logo */}
        <div className="text-white font-bold text-xl">
          LOGO
        </div>

        {/* Footer Links */}
        <div className="flex space-x-6 text-white text-lg">
          <a href="#" className="hover:text-gray-200">Privacy Policy</a>
          <a href="#" className="hover:text-gray-200">Terms of Service</a>
          <a href="#" className="hover:text-gray-200">Help Center</a>
          <a href="#" className="hover:text-gray-200">Contact Us</a>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-facebook"></i> {/* Facebook Icon */}
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-twitter"></i> {/* Twitter Icon */}
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-instagram"></i> {/* Instagram Icon */}
          </a>
          <a href="#" className="text-white hover:text-gray-200">
            <i className="fab fa-linkedin"></i> {/* LinkedIn Icon */}
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-white text-sm mt-4">
        <p>&copy; 2025 Food Delivery App. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
