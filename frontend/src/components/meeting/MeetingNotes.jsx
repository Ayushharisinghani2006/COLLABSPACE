import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Participant from './Participant';

const socket = io('http://localhost:5000', { path: '/socket.io' });

const MeetingNotes = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const participants = [
    { name: 'John Doe', initials: 'JD' },
    { name: 'Amy Smith', initials: 'AS' },
    { name: 'Mike Kraus', initials: 'MK' },
    { name: 'Tim Stevens', initials: 'TS' },
  ];

  useEffect(() => {
    socket.on('userPresence', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('userPresence');
    };
  }, []);

  return (
    <div className="w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-4">Q2 Planning Session</h2>
      <div>
        <h3 className="font-semibold">Agenda</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>Review Q1 metrics</li>
          <li>Set Q2 goals</li>
          <li>Assign team responsibilities</li>
          <li>Timeline planning</li>
          <li>Budget discussion</li>
        </ul>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full font-semibold"
        >
          Discussion Points
          <svg
            className={`w-4 h-4 transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <ul className="mt-2 text-gray-700 dark:text-gray-300">
            <li>We need to focus on improving retention rates as they dropped by 9% in Q1.</li>
            <li>Marketing team will work on new engagement strategies.</li>
            <li>Product team will prioritize the new analytics dashboard feature for Q2.</li>
          </ul>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Meet (4)</h3>
        <div className="flex space-x-2 mt-2">
          {participants.map((participant, index) => (
            <div key={index} className="relative">
              <Participant {...participant} />
              {onlineUsers.includes(participant.name) && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingNotes;