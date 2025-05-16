import React from 'react';

const WhiteboardCard = ({ title }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
};

export default WhiteboardCard;