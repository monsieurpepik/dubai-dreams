import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_KEY = 'ov-session-id';

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useTrackView(propertyId: string | undefined) {
  const tracked = useRef(false);

  useEffect(() => {
    if (!propertyId || tracked.current) return;
    tracked.current = true;

    supabase
      .from('property_views')
      .insert({
        property_id: propertyId,
        session_id: getSessionId(),
        referrer: document.referrer || null,
      })
      .then(({ error }) => {
        if (error) console.warn('View tracking failed:', error.message);
      });
  }, [propertyId]);
}
