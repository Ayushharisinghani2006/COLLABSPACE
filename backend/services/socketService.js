const logger = require('../utils/logger');

const setupSocket = (io) => {
  const onlineUsers = new Set();

  io.on('connection', (socket) => {
    logger.info(`A user connected: ${socket.id}`);

    // Handle whiteboard element updates
    socket.on('elementUpdate', (updatedElement) => {
      logger.info(`Element updated: ${JSON.stringify(updatedElement)}`);
      socket.broadcast.emit('elementUpdate', updatedElement); // Broadcast to other users
    });

    // Handle user presence in meetings
    socket.on('joinMeeting', (userName) => {
      onlineUsers.add(userName);
      logger.info(`User joined meeting: ${userName}`);
      io.emit('userPresence', Array.from(onlineUsers));
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
      // Note: In a real app, you'd track user-specific sessions to remove them from onlineUsers
    });
  });
};

module.exports = setupSocket;