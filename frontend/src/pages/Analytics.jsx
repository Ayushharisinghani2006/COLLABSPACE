import React from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Analysis = () => {
  const meetingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Meetings Held',
        data: [8, 12, 15, 10, 18],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const whiteboardData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Whiteboards Created',
        data: [3, 5, 7, 4, 8],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const participantData = {
    labels: ['Design Review', 'Sprint Planning', 'Client Sync'],
    datasets: [
      {
        label: 'Participants',
        data: [6, 9, 4],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const fileShareData = {
    labels: ['Documents', 'Images', 'Others'],
    datasets: [
      {
        label: 'Files Shared',
        data: [50, 25, 12],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Collaboration Analytics' },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 dark:text-white"
    >
      <h2 className="text-3xl font-bold">Analytics</h2>
      <p className="text-gray-600 dark:text-gray-300">Track your collaboration metrics over time.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Meetings Over Time</h3>
          <Line data={meetingData} options={options} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Whiteboards Over Time</h3>
          <Line data={whiteboardData} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Meeting Participants</h3>
          <Bar data={participantData} options={options} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Files Shared by Type</h3>
          <Pie data={fileShareData} options={options} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Summary</h3>
        <p>Total Meetings This Year: 78</p>
        <p>Total Whiteboards Created: 35</p>
        <p>Average Participants per Meeting: 7</p>
        <p>Total Collaboration Hours: 450</p>
        <p>Total Files Shared: 87</p>
      </div>
    </motion.div>
  );
};

export default Analysis;