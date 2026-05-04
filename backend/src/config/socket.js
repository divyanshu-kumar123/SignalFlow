import { Server } from 'socket.io';

let io;


// Initializes the Socket.io server and defines connection events.
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket Connected: ${socket.id}`);

    // When a user logs in on the frontend, they will emit this event
    // to join a secure room named after their unique database ID.
    socket.on('join-user-room', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their private notification room.`);
    });

    socket.on('disconnect', () => {
      console.log(`WebSocket Disconnected: ${socket.id}`);
    });
  });

  return io;
};


export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized!');
  }
  return io;
};