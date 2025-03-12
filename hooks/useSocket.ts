// hooks/useSocket.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketResponse {
  status: string;
  time: string;
  [key: string]: any;
}

export function useSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const socketInitializedRef = useRef<boolean>(false);

  // Initialize socket connection
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (socketInitializedRef.current) return;
    socketInitializedRef.current = true;
    
    // Initialize Socket.io
    const initSocket = async () => {
      try {
        // First ensure the socket API endpoint is created on the server
        const response = await fetch('/api/socket');
        if (!response.ok) {
          throw new Error(`Failed to initialize socket API: ${response.status}`);
        }
        
        // Create socket connection with proper error handling
        const socketOptions = {
          path: '/api/socket',
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          transports: ['polling', 'websocket'],
          autoConnect: true,
          forceNew: true
        };
        
        // Close any existing connection
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
        
        // Create new connection
        socketRef.current = io('', socketOptions);
        
        // Set up event handlers
        socketRef.current.on('connect', () => {
          console.log(`Socket connected: ${socketRef.current?.id}`);
          setIsConnected(true);
          setError(null);
        });
        
        socketRef.current.on('connect_error', (err: Error) => {
          console.error('Socket connection error:', err);
          setError(`Connection error: ${err.message}`);
          setIsConnected(false);
        });
        
        socketRef.current.on('disconnect', (reason: string) => {
          console.log(`Socket disconnected: ${reason}`);
          setIsConnected(false);
        });
        
        socketRef.current.on('error', (err: Error) => {
          console.error('Socket error:', err);
          setError(`Socket error: ${err.message || 'Unknown error'}`);
        });
        
        // Add a ping timeout to test connection is actually working
        setTimeout(() => {
          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('ping', (response: SocketResponse) => {
              console.log('Initial ping response:', response);
            });
          }
        }, 1000);
        
      } catch (err) {
        console.error('Error initializing socket:', err);
        setError(`Failed to initialize socket: ${(err as Error).message}`);
        setIsConnected(false);
        socketInitializedRef.current = false; // Allow retry
      }
    };
    
    initSocket();
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.removeAllListeners();
        socketRef.current = null;
      }
      socketInitializedRef.current = false;
    };
  }, []);
  
  // Function to emit events
  const emitEvent = useCallback(<T = any>(
    event: string, 
    data: any = null, 
    callback?: (response: T) => void
  ): boolean => {
    if (!socketRef.current) {
      setError('Socket not initialized');
      return false;
    }
    
    if (!socketRef.current.connected) {
      setError('Socket not connected');
      return false;
    }
    
    try {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
      return true;
    } catch (err) {
      console.error(`Error emitting ${event}:`, err);
      setError(`Failed to emit ${event}: ${(err as Error).message}`);
      return false;
    }
  }, []);
  
  // Function to subscribe to events
  const onEvent = useCallback(<T = any>(
    event: string, 
    callback: (data: T) => void
  ): (() => void) => {
    if (!socketRef.current) {
      console.warn('Tried to subscribe to event before socket initialization');
      const checkAndSubscribe = setInterval(() => {
        if (socketRef.current) {
          clearInterval(checkAndSubscribe);
          socketRef.current.on(event, callback);
        }
      }, 500);
      
      return () => {
        clearInterval(checkAndSubscribe);
        if (socketRef.current) {
          socketRef.current.off(event, callback);
        }
      };
    }
    
    socketRef.current.on(event, callback);
    
    // Return unsubscribe function
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);
  
  // Reconnect function
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      // Force a new connection by closing and recreating the socket
      socketRef.current.disconnect();
      
      // Small delay to ensure disconnect completes
      setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.connect();
          console.log("Socket reconnection attempted");
        }
      }, 500);
    } else {
      // Reset the initialization flag so useEffect will create a new socket
      socketInitializedRef.current = false;
      // Force a re-render
      setError(null);
    }
  }, []);
  
  return {
    socket: socketRef.current,
    isConnected,
    error,
    emitEvent,
    onEvent,
    reconnect
  };
}