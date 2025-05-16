import React from 'react';
import { FaUsers, FaChalkboard, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  const stats = [
    { label: 'Total Meetings', value: 25, icon: <FaUsers className="text-blue-500" /> },
    { label: 'Active Whiteboards', value: 8, icon: <FaChalkboard className="text-green-500" /> },
    { label: 'Hours Collaborated', value: 120, icon: <FaClock className="text-yellow-500" /> },
  ];

  const recentActivity = [
    { type: 'Meeting', title: 'Weekly Sync', time: '1 hour ago', status: 'Completed' },
    { type: 'Whiteboard', title: 'Design Brainstorm', time: '3 hours ago', status: 'In Progress' },
    { type: 'Meeting', title: 'Client Review', time: '1 day ago', status: 'Scheduled' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 dark:text-white"
    >
      <h2 className="text-3xl font-bold">Welcome to CollabSpace</h2>
      <p className="text-gray-600 dark:text-gray-300">Your ultimate platform for seamless collaboration.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div>{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <motion.li
              key={idx}
              className="flex justify-between items-center border-b pb-2 dark:border-gray-700"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div>
                <span className="font-medium">{activity.type}:</span> {activity.title}
                <span className={`ml-2 text-sm ${activity.status === 'Completed' ? 'text-green-500' : activity.status === 'In Progress' ? 'text-yellow-500' : 'text-blue-500'}`}>
                  ({activity.status})
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default Home;