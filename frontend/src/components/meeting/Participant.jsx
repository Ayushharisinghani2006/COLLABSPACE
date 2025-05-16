import React from 'react';

const Participant = ({ name, initials }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center">
        {initials}
      </div>
      <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
    </div>
  );
};

export default Participant;