import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="dark:bg-black bg-opacity-50 dark:bg-opacity-50  bg-gray-400 dark:text-gray-300 py-16 px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Email Signup Section */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold dark:text-white mb-2 text-center md:text-left">Stay in the know with the latest movie release</h2>
            <p className="darK:text-gray-400 mb-4 text-center md:text-left">Keep up with CinemaTrails and Updates</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="email"
                placeholder="Enter email address..."
                className="bg-gray-700 text-white rounded-md px-4 py-2 flex-grow"
              />
              <button className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Products Column */}
          <div className="flex flex-col items-end">
            <h3 className="dark:text-white font-semibold mb-4 uppercase">Discover by Mood</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">Discover Comedy Movies</a></li>
              <li><a href="/" className="hover:text-white">Discover Drama Movies</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="flex flex-col items-end">
            <h3 className="dark:text-white font-semibold mb-4 uppercase">Company</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">About Us</a></li>
              <li><a href="/" className="hover:text-white">Changelog</a></li>
              <li><a href="/" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Learn More Column */}
          <div className="flex flex-col items-start">
            <h3 className="dark:text-white font-semibold mb-4 uppercase">Learn More</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white">Blog</a></li>
              <li><a href="/" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-16 flex flex-wrap justify-between items-center">
          <div className="flex space-x-6">
            <a href="/" className="hover:text-white">Privacy Policy</a>
            <a href="/" className="hover:text-white">Responsible Disclosure</a>
            <a href="/" className="hover:text-white">Terms of Service</a>
          </div>
          <p className="text-gray-500 mt-4 sm:mt-0">© 2024 CinemaTrails Inc. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="/" className="text-gray-400 hover:text-white">
              <FaFacebookF />
            </a>
            <a href="/" className="text-gray-400 hover:text-white">
              <FaTwitter />
            </a>
            <a href="/" className="text-gray-400 hover:text-white">
              <FaInstagram />
            </a>
            <a href="/" className="text-gray-400 hover:text-white">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;