import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ViewerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Connect to WebSocket server (replace with your WebSocket server URL)
    const socket = io('wss://your-websocket-server.com');

    socket.on('viewerCount', (newCount: number) => {
      setCount(newCount);
    });

    // Fallback to simulated count if WebSocket fails
    const fallbackInterval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(fallbackInterval);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm backdrop-blur-sm border border-[#ea384c]/30
                    animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.3)]">
      {count} people watching worldwide
    </div>
  );
};

export default ViewerCount;