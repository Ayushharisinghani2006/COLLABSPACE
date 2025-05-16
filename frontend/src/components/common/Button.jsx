import React from 'react';

const Button = ({ label, className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded focus:outline-none ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;