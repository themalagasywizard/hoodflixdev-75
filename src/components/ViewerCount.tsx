import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ViewerCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial fetch of viewer count
    const fetchViewerCount = async () => {
      const { data, error } = await supabase
        .from('viewer_counts')
        .select('count')
        .single();
      
      if (error) {
        console.error('Error fetching viewer count:', error);
        return;
      }
      
      if (data) {
        setCount(data.count);
      }
    };

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('viewer_counts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'viewer_counts' 
        }, 
        (payload) => {
          if (payload.new) {
            setCount(payload.new.count);
          }
      })
      .subscribe();

    // Update viewer count on mount
    const updateViewerCount = async () => {
      const { error } = await supabase
        .rpc('increment_viewer_count');
      
      if (error) {
        console.error('Error updating viewer count:', error);
      }
    };

    fetchViewerCount();
    updateViewerCount();

    // Cleanup subscription and decrement count on unmount
    return () => {
      subscription.unsubscribe();
      supabase.rpc('decrement_viewer_count').catch(console.error);
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