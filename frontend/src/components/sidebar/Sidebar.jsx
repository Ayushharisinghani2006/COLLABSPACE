import React from 'react';
import SidebarItem from './SidebarItem';
import menuItems from '../../constants/sidebarMenu';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects</h2>}
        <button onClick={toggleSidebar} className="focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>
      <nav className="mt-4">
        {menuItems.map((item, index) => (
          <SidebarItem key={index} item={item} isOpen={isOpen} />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;