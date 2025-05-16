import React from 'react';

const MeetingCard = ({ title, date }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{date}</p>
    </div>
  );
};

export default MeetingCard;