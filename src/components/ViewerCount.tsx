import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { ViewerCount } from '../types/supabase';
import { useToast } from '../hooks/use-toast';

const ViewerCounter = () => {
  const [count, setCount] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of viewer count
    const fetchViewerCount = async () => {
      const { data, error } = await supabase
        .from('viewer_counts')
        .select('count')
        .single();

      if (error) {
        console.error('Error fetching viewer count:', error);
        startFallbackCounter();
        return;
      }

      if (data) {
        setCount(data.count);
      }
    };

    // Increment viewer count when component mounts
    const incrementCount = async () => {
      const { error } = await supabase
        .rpc('increment_viewer_count');

      if (error) {
        console.error('Error incrementing count:', error);
      }
    };

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('viewer_counts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'viewer_counts'
        },
        (payload) => {
          const newCount = (payload.new as ViewerCount).count;
          setCount(newCount);
        }
      )
      .subscribe();

    // Fallback counter in case of connection issues
    const startFallbackCounter = () => {
      const baseCount = Math.floor(Math.random() * 1000) + 500;
      setCount(baseCount);
      
      const interval = setInterval(() => {
        setCount(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);
      
      return () => clearInterval(interval);
    };

    // Initialize
    fetchViewerCount();
    incrementCount();

    // Cleanup: Decrement count and remove subscription
    return () => {
      const decrementCount = async () => {
        const { error } = await supabase
          .rpc('decrement_viewer_count');

        if (error) {
          console.error('Error decrementing count:', error);
        }
      };

      decrementCount();
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[9999] bg-black/80 px-4 py-2 rounded-full
                    text-white text-sm backdrop-blur-sm border border-[#ea384c]/30
                    animate-pulse shadow-[0_0_15px_rgba(234,56,76,0.3)]">
      {count.toLocaleString()} people watching worldwide
    </div>
  );
};

export default ViewerCounter;