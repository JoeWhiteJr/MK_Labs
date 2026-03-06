const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const logger = require('../config/logger');

let io = null;

// Track online users: Map<userId, Set<socketId>>
const onlineUsers = new Map();

/**
 * Initialize Socket.io with HTTP server
 */
const initialize = (httpServer, corsOrigin) => {
  io = new Server(httpServer, {
    cors: {
      origin: corsOrigin || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Apply authentication middleware
  io.use(socketAuth);

  // Handle connections
  io.on('connection', handleConnection);

  logger.info('Socket.io initialized');
  return io;
};

/**
 * Handle new socket connection
 */
const handleConnection = async (socket) => {
  const userId = socket.userId;
  const userName = socket.user.name;

  logger.info({ userId, userName }, 'User connected');

  // Track online status
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
    // Broadcast that user came online
    socket.broadcast.emit('user_online', { userId, userName });
  }
  onlineUsers.get(userId).add(socket.id);

  // Join user's personal room for direct notifications
  socket.join(`user:${userId}`);

  // Send current online users to the newly connected user
  socket.emit('online_users', Array.from(onlineUsers.keys()));

  // Event handlers
  socket.on('disconnect', () => handleDisconnect(socket));
};

/**
 * Handle socket disconnect
 */
const handleDisconnect = (socket) => {
  const userId = socket.userId;
  const userName = socket.user?.name;

  logger.info({ userId, userName }, 'User disconnected');

  // Remove socket from online tracking
  if (onlineUsers.has(userId)) {
    onlineUsers.get(userId).delete(socket.id);

    // If no more sockets for this user, they're offline
    if (onlineUsers.get(userId).size === 0) {
      onlineUsers.delete(userId);
      socket.broadcast.emit('user_offline', { userId, userName });
    }
  }
};

// ============================================
// Public API for use by routes
// ============================================

/**
 * Emit event to a specific user (all their connected sockets)
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to all connected clients
 */
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Get list of online user IDs
 */
const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

/**
 * Check if a user is online
 */
const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

/**
 * Get Socket.io instance
 */
const getIO = () => io;

module.exports = {
  initialize,
  emitToUser,
  emitToAll,
  getOnlineUsers,
  isUserOnline,
  getIO
};
