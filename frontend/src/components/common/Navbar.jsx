import React from 'react';
import Button from './Button';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex space-x-2">
        <Button label="Whiteboard" className="bg-gray-200 dark:bg-gray-700" />
        <Button label="Documents" className="bg-gray-200 dark:bg-gray-700" />
        <Button label="Calendar" className="bg-gray-200 dark:bg-gray-700" />
        <Button label="Tasks" className="bg-gray-200 dark:bg-gray-700" />
      </div>
      <input
        type="text"
        placeholder="Search notes, text, tasks..."
        className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
      />
    </div>
  );
};

export default Navbar;