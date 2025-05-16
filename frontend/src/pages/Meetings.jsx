import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Meetings = ({ setActiveTab, setSelectedMeeting }) => {
  const [meetings, setMeetings] = useState([
    { id: '1', title: 'Team Sync', date: '2025-05-10', participants: 5 },
    { id: '2', title: 'Project Kickoff', date: '2025-05-12', participants: 8 },
  ]);

  useEffect(() => {
    // Simulate real-time meeting updates
    const interval = setInterval(() => {
      const newMeeting = {
        id: String(meetings.length + 1),
        title: `New Meeting ${meetings.length + 1}`,
        date: '2025-05-15',
        participants: Math.floor(Math.random() * 10) + 1,
      };
      setMeetings((prev) => [...prev, newMeeting]);
      toast.success(`New meeting "${newMeeting.title}" scheduled!`);
    }, 30000); // Every 30 seconds for demo

    return () => clearInterval(interval);
  }, [meetings]);

  const viewMeetingDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setActiveTab('MeetingDetail');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 dark:text-white"
    >
      <h2 className="text-3xl font-bold">Meetings</h2>
      <p className="text-gray-600 dark:text-gray-300">Manage your meetings and collaborate with your team.</p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Upcoming Meetings</h3>
        {meetings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No upcoming meetings. Create one from the taskbar!</p>
        ) : (
          <ul className="space-y-4">
            {meetings.map((meeting, idx) => (
              <motion.li
                key={meeting.id}
                className="flex justify-between items-center border-b pb-2 dark:border-gray-700"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div>
                  <h4 className="text-lg font-medium">{meeting.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date: {meeting.date} | Participants: {meeting.participants}</p>
                </div>
                <button
                  onClick={() => viewMeetingDetails(meeting)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  View Details <FaArrowRight className="ml-2" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Meetings;