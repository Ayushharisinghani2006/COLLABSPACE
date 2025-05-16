import React, { useState, useContext, Suspense, lazy } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
const Sidebar = lazy(() => import('../components/sidebar/Sidebar'));
const Navbar = lazy(() => import('../components/common/Navbar'));
const MeetingNotes = lazy(() => import('../components/meeting/MeetingNotes'));

const MainLayout = ({ children }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-300`}>
      {/* Top Navbar */}
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Navbar />
      </Suspense>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Suspense fallback={<div className="w-64 p-4">Loading...</div>}>
          <Sidebar isOpen={isLeftSidebarOpen} toggleSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} />
        </Suspense>

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 overflow-auto transition-all duration-300 ${
            isLeftSidebarOpen ? 'ml-64' : 'ml-16'
          } ${isRightSidebarOpen ? 'mr-80' : 'mr-0'}`}
        >
          {children}
        </main>

        {/* Right Sidebar (Meeting Notes) */}
        {isRightSidebarOpen && (
          <div className="fixed top-0 right-0 h-full transition-all duration-300">
            <Suspense fallback={<div className="w-80 p-4">Loading...</div>}>
              <MeetingNotes />
            </Suspense>
            <button
              onClick={() => setIsRightSidebarOpen(false)}
              className="absolute top-4 left-4 focus:outline-none"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Dark Mode Toggle (Bottom Right) */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
};

export default MainLayout;