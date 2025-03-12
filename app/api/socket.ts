// pages/api/socket.ts
import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Socket } from 'net';

export interface SocketServer extends NetServer {
  io?: IOServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: Socket & {
    server: SocketServer;
  };
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  // Check if Socket.io is already initialized
  if (res.socket.server.io) {
    console.log('Socket is already initialized');
    res.end();
    return;
  }

  console.log('Initializing Socket.io server...');

  // Initialize Socket.io server with CORS configuration
  const io = new IOServer(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',  // In production, specify your domain
      methods: ['GET', 'POST'],
      credentials: true
    },
    // More reliable configuration for development environments
    transports: ['polling', 'websocket'],
    pingTimeout: 30000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    maxHttpBufferSize: 1e8
  });
  
  // Store the io instance on the server
  res.socket.server.io = io;

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Basic ping/pong to test connection
    socket.on('ping', (callback: Function | undefined) => {
      console.log(`Received ping from ${socket.id}`);
      const response = { 
        status: 'ok', 
        time: new Date().toISOString(),
        socketId: socket.id
      };
      
      if (typeof callback === 'function') {
        try {
          callback(response);
          console.log(`Sent ping response to ${socket.id} via callback`);
        } catch (error) {
          console.error(`Error sending ping callback:`, error);
          socket.emit('pong', response);  // Fallback
        }
      } else {
        socket.emit('pong', response);
        console.log(`Sent ping response to ${socket.id} via event`);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason: string) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
    });
    
    // Error handling
    socket.on('error', (error: Error) => {
      console.error(`Socket error on ${socket.id}:`, error);
    });

    socket.on('connect_error', (error: Error) => {
      console.error(`Socket connect_error on ${socket.id}:`, error);
    });
  });

  console.log('Socket.io server initialized successfully');
  res.end();
};

export default SocketHandler;

// Configure the API route
export const config = {
  api: {
    bodyParser: false,
  },
};