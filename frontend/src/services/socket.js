import { io } from 'socket.io-client'
import { useNotificationStore } from '../store/notificationStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''

let socket = null

let onlineUsers = new Set()
let onlineStatusListeners = []

let connectionStatus = 'disconnected' // 'connected' | 'disconnected' | 'reconnecting'
let connectionStatusListeners = []

const notifyConnectionStatusListeners = () => {
  connectionStatusListeners.forEach((cb) => cb(connectionStatus))
}

export const getConnectionStatus = () => connectionStatus

export const subscribeToConnectionStatus = (callback) => {
  connectionStatusListeners.push(callback)
  return () => {
    connectionStatusListeners = connectionStatusListeners.filter((cb) => cb !== callback)
  }
}

export const connect = (token) => {
  if (socket?.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000
  })

  socket.on('connect', () => {
    connectionStatus = 'connected'
    notifyConnectionStatusListeners()
  })

  socket.on('disconnect', () => {
    connectionStatus = 'reconnecting'
    notifyConnectionStatusListeners()
  })

  socket.on('connect_error', (err) => {
    console.error('[socket] Connection error:', err.message)
    connectionStatus = 'reconnecting'
    notifyConnectionStatusListeners()
  })

  socket.on('online_users', (userIds) => {
    onlineUsers = new Set(userIds)
    notifyOnlineStatusListeners()
  })

  socket.on('user_online', ({ userId }) => {
    onlineUsers.add(userId)
    notifyOnlineStatusListeners()
  })

  socket.on('user_offline', ({ userId }) => {
    onlineUsers.delete(userId)
    notifyOnlineStatusListeners()
  })

  socket.on('notification', (notification) => {
    useNotificationStore.getState().addNotification(notification)
  })

  return socket
}

export const disconnect = () => {
  if (socket) {
    socket.disconnect()
    socket = null
    onlineUsers.clear()
    connectionStatus = 'disconnected'
    notifyConnectionStatusListeners()
  }
}

export const getSocket = () => socket
export const isConnected = () => socket?.connected ?? false

export const isUserOnline = (userId) => onlineUsers.has(userId)
export const getOnlineUsers = () => Array.from(onlineUsers)

export const subscribeToOnlineStatus = (callback) => {
  onlineStatusListeners.push(callback)
  return () => {
    onlineStatusListeners = onlineStatusListeners.filter((cb) => cb !== callback)
  }
}

const notifyOnlineStatusListeners = () => {
  onlineStatusListeners.forEach((cb) => cb(Array.from(onlineUsers)))
}

export default {
  connect,
  disconnect,
  getSocket,
  isConnected,
  isUserOnline,
  getOnlineUsers,
  subscribeToOnlineStatus,
  getConnectionStatus,
  subscribeToConnectionStatus
}
