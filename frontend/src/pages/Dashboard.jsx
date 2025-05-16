import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaChalkboard, FaChartLine, FaSignOutAlt, FaBars, FaPlus, FaArrowRight, FaMoon, FaSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import io from 'socket.io-client';
import Home from './Home';
import Meetings from './Meetings';
import MeetingDetail from './MeetingDetail';
import Whiteboard from './Whiteboard';
import Analysis from './Analytics';

const socket = io('http://localhost:5000', { withCredentials: true });

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for taskbar, content, theme, and loading
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply dark mode to the entire app
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Socket.IO event listeners
    socket.on('userJoined', (data) => {
      toast.success(`User ${data.userId} joined the meeting!`);
    });

    socket.on('fileShared', (data) => {
      toast.success(`${data.user} shared a file: ${data.fileName}`);
    });

    return () => {
      socket.off('userJoined');
      socket.off('fileShared');
    };
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      navigate('/login', { replace: true });
      setIsLoading(false);
      toast.success('Logged out successfully!');
    }, 1000);
  };

  const tabs = [
    { name: 'Home', icon: <FaHome />, commands: [{ label: 'Welcome', action: () => setActiveTab('Home') }] },
    {
      name: 'Meetings',
      icon: <FaUsers />,
      commands: [
        { label: 'Create Meeting', action: () => openModal('createMeeting') },
        { label: 'Join Meeting', action: () => openModal('joinMeeting') },
      ],
    },
    {
      name: 'Whiteboards',
      icon: <FaChalkboard />,
      commands: [
        { label: 'New Whiteboard', action: () => openModal('createWhiteboard') },
        { label: 'Open Whiteboard', action: () => setActiveTab('Whiteboard') },
      ],
    },
    { name: 'Analysis', icon: <FaChartLine />, commands: [{ label: 'View Analytics', action: () => setActiveTab('Analysis') }] },
  ];

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
  };

  const handleModalSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalType === 'createMeeting') {
        toast.success(`Meeting "${data.title}" created!`);
        setActiveTab('Meetings');
      } else if (modalType === 'joinMeeting') {
        socket.emit('joinMeeting', data.meetingId);
        setSelectedMeeting({ id: data.meetingId, title: 'Sample Meeting' });
        setActiveTab('MeetingDetail');
        toast.success(`Joined meeting ${data.meetingId}!`);
      } else if (modalType === 'createWhiteboard') {
        toast.success(`Whiteboard "${data.whiteboardName}" created!`);
        setActiveTab('Whiteboard');
      }
      closeModal();
      setIsLoading(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Meetings':
        return <Meetings setActiveTab={setActiveTab} setSelectedMeeting={setSelectedMeeting} />;
      case 'MeetingDetail':
        return <MeetingDetail meeting={selectedMeeting} socket={socket} />;
      case 'Whiteboard':
        return <Whiteboard socket={socket} meetingId={selectedMeeting?.id} />;
      case 'Analysis':
        return <Analysis />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark:bg-gray-900' : 'bg-gray-100'}`}>
      {/* Toaster for Notifications */}
      <Toaster position="top-right" />

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full shadow-lg ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-800 text-white'}`}
        initial={{ width: 64 }}
        animate={{ width: isSidebarOpen ? 256 : 64 }}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className={`${isSidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>CollabSpace</h2>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white focus:outline-none">
            <FaBars />
          </button>
        </div>
        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center w-full p-4 hover:bg-gray-700 ${activeTab === tab.name ? 'bg-gray-700' : ''}`}
            >
              {tab.icon}
              <span className={`${isSidebarOpen ? 'block ml-4' : 'hidden'}`}>{tab.name}</span>
            </button>
          ))}
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center w-full p-4 hover:bg-gray-700">
            {isDarkMode ? <FaSun /> : <FaMoon />}
            <span className={`${isSidebarOpen ? 'block ml-4' : 'hidden'}`}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleLogout} className="flex items-center w-full p-4 hover:bg-gray-700">
            <FaSignOutAlt />
            <span className={`${isSidebarOpen ? 'block ml-4' : 'hidden'}`}>Logout</span>
          </button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        {/* Taskbar */}
        <div className={`shadow-md p-2 flex items-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'}`}>
          {tabs.map((tab) => (
            <div key={tab.name} className="relative group">
              <button
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 font-semibold ${activeTab === tab.name ? 'text-blue-600 border-b-2 border-blue-600' : 'hover:text-blue-600'}`}
              >
                {tab.name}
              </button>
              {tab.commands.length > 0 && (
                <div className={`absolute top-full left-0 shadow-lg rounded-md hidden group-hover:block z-10 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-700'}`}>
                  {tab.commands.map((command, idx) => (
                    <button
                      key={idx}
                      onClick={command.action}
                      className={`block w-full text-left px-4 py-2 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
                    >
                      {command.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader color={isDarkMode ? '#ffffff' : '#000000'} size={50} />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Modal for Create/Join Actions */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className={`p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-lg font-bold mb-4">
              {modalType === 'createMeeting' ? 'Create a New Meeting' : 
               modalType === 'joinMeeting' ? 'Join a Meeting' : 
               'Create a New Whiteboard'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                handleModalSubmit(data);
              }}
              className="space-y-4"
            >
              {modalType === 'createMeeting' && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Meeting Title</label>
                    <input
                      type="text"
                      name="title"
                      className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="datetime"
                      className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                      required
                    />
                  </div>
                </>
              )}
              {modalType === 'joinMeeting' && (
                <div>
                  <label className="block text-sm font-medium">Meeting ID</label>
                  <input
                    type="text"
                    name="meetingId"
                    className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
              )}
              {modalType === 'createWhiteboard' && (
                <div>
                  <label className="block text-sm font-medium">Whiteboard Name</label>
                  <input
                    type="text"
                    name="whiteboardName"
                    className={`mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {modalType.includes('create') ? 'Create' : 'Join'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;