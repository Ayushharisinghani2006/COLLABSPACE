import React from 'react';

const SidebarItem = ({ item, isOpen }) => {
  return (
    <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <img src={item.icon} alt={item.name} className="w-6 h-6" />
      {isOpen && <span className="ml-4 text-gray-900 dark:text-white">{item.name}</span>}
    </div>
  );
};

export default SidebarItem;