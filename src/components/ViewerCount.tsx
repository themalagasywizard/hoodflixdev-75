import React, { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';

const ViewerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const viewersRef = ref(database, 'viewers');
    
    // Update viewer count on connection
    const connectionRef = ref(database, '.info/connected');
    onValue(connectionRef, (snap) => {
      if (snap.val()) {
        // Increment viewer count
        onValue(viewersRef, (snapshot) => {
          const currentCount = snapshot.val() || 0;
          set(viewersRef, currentCount + 1);
        }, { onlyOnce: true });

        // Decrease count when user disconnects
        viewersRef.onDisconnect().set(serverValue => {
          return (serverValue || 1) - 1;
        });
      }
    });

    // Listen for count updates
    onValue(viewersRef, (snapshot) => {
      setCount(snapshot.val() || 0);
    });
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm animate-pulse border border-[#ea384c]/30 backdrop-blur-sm
                    shadow-[0_0_15px_rgba(234,56,76,0.3)]">
      {count} people watching worldwide
    </div>
  );
};

export default ViewerCount;