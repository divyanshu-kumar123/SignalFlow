import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

// Initialize the socket but prevent it from connecting immediately
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});