import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ViewerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io('wss://your-websocket-server.com');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('viewerCount', (newCount: number) => {
      setCount(newCount);
    });

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
      // Fallback to simulated count if WebSocket fails
      startFallbackCounter();
    });

    const startFallbackCounter = () => {
      const interval = setInterval(() => {
        setCount(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);
      return () => clearInterval(interval);
    };

    // Start fallback counter immediately while waiting for WebSocket
    const cleanup = startFallbackCounter();

    return () => {
      socket.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm backdrop-blur-sm border border-[#ea384c]/30
                    animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.3)]">
      {count} people watching worldwide
    </div>
  );
};

export default ViewerCount;
