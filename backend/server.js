require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

const app = require('./app');
const connectDB = require('./config/db');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Map to track connected users: userId -> Set of socket IDs
const connectedUsers = new Map();

connectDB();

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Register user with their socket ID
  socket.on('registerUser', (userId) => {
    if (!connectedUsers.has(userId)) {
      connectedUsers.set(userId, new Set());
    }
    connectedUsers.get(userId).add(socket.id);
    logger.info(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle new user session (called on login/signup)
  socket.on('newUserSession', (userId) => {
    if (connectedUsers.has(userId)) {
      const userSockets = connectedUsers.get(userId);
      userSockets.forEach((socketId) => {
        if (socketId !== socket.id) { // Don't disconnect the current socket
          io.to(socketId).emit('forceDisconnect', {
            message: 'You have been disconnected because you logged in from another device.',
          });
          logger.info(`User ${userId} disconnected from socket ${socketId}`);
        }
      });
      // Update the user's socket list to only include the current socket
      connectedUsers.set(userId, new Set([socket.id]));
    }
  });

  socket.on('joinMeeting', (meetingId) => {
    socket.join(meetingId);
    io.to(meetingId).emit('userJoined', { userId: socket.id });
    logger.info(`User ${socket.id} joined meeting ${meetingId}`);
  });

  socket.on('draw', (data) => {
    // Broadcast drawing data to all participants in the meeting (except the sender)
    socket.broadcast.to(data.meetingId).emit('draw', data);
    logger.info(`Drawing event broadcast to meeting ${data.meetingId}`);
  });

  socket.on('addStickyNote', (note) => {
    socket.broadcast.emit('addStickyNote', note);
  });

  socket.on('shareFile', (data) => {
    io.to(data.meetingId).emit('fileShared', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
    // Remove the socket from connectedUsers
    for (const [userId, sockets] of connectedUsers.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          connectedUsers.delete(userId);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});