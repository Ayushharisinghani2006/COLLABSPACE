import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to CollabSpace</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Collaborate in real-time with your team using interactive whiteboards and more.
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Landing;