import React, { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaFileUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const MeetingDetail = ({ meeting, socket }) => {
  const [file, setFile] = useState(null);

  if (!meeting) {
    return <p className="text-gray-500 dark:text-gray-400">No meeting selected.</p>;
  }

  const participants = ['Alice', 'Bob', 'Charlie', 'David'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileShare = () => {
    if (file) {
      socket.emit('shareFile', {
        meetingId: meeting.id,
        user: 'You',
        fileName: file.name,
      });
      setFile(null);
      toast.success(`File "${file.name}" shared successfully!`);
    } else {
      toast.error('Please select a file to share.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 dark:text-white"
    >
      <h2 className="text-3xl font-bold">{meeting.title}</h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
        <div className="flex items-center space-x-3">
          <FaCalendarAlt className="text-blue-500" />
          <p>Date: {meeting.date}</p>
        </div>
        <div className="flex items-center space-x-3">
          <FaUsers className="text-blue-500" />
          <p>Participants: {participants.length}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Participants List</h3>
          <ul className="space-y-2">
            {participants.map((participant, idx) => (
              <motion.li
                key={idx}
                className="text-gray-700 dark:text-gray-200"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                {participant}
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Agenda</h3>
          <p className="text-gray-700 dark:text-gray-200">1. Project Updates</p>
          <p className="text-gray-700 dark:text-gray-200">2. Next Steps</p>
          <p className="text-gray-700 dark:text-gray-200">3. Q&A</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Share a File</h3>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              onChange={handleFileChange}
              className="text-gray-700 dark:text-gray-200"
            />
            <button
              onClick={handleFileShare}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaFileUpload className="mr-2" /> Share
            </button>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Join Meeting
        </button>
      </div>
    </motion.div>
  );
};

export default MeetingDetail;