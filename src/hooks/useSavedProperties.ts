import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const LOCAL_STORAGE_KEY = 'saved-properties';

export function useSavedProperties() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved properties from DB when logged in
  useEffect(() => {
    if (!user) {
      // Fallback to localStorage for unauthenticated browsing
      try {
        setSavedIds(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'));
      } catch {
        setSavedIds([]);
      }
      setLoading(false);
      return;
    }

    const fetchSaved = async () => {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('property_id')
        .eq('user_id', user.id);

      if (!error && data) {
        const ids = data.map((row) => row.property_id);
        setSavedIds(ids);

        // Migrate any localStorage saved properties to DB
        try {
          const localIds: string[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
          const newIds = localIds.filter((id) => !ids.includes(id));
          if (newIds.length > 0) {
            const inserts = newIds.map((property_id) => ({
              user_id: user.id,
              property_id,
            }));
            await supabase.from('saved_properties').upsert(inserts, { onConflict: 'user_id,property_id' });
            setSavedIds((prev) => [...prev, ...newIds]);
          }
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
          // ignore migration errors
        }
      }
      setLoading(false);
    };

    fetchSaved();
  }, [user]);

  const toggleSave = useCallback(
    async (id: string) => {
      if (!user) {
        // localStorage fallback for guests
        setSavedIds((prev) => {
          const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
        return;
      }

      const isSavedNow = savedIds.includes(id);
      // Optimistic update
      setSavedIds((prev) => (isSavedNow ? prev.filter((x) => x !== id) : [...prev, id]));

      if (isSavedNow) {
        await supabase.from('saved_properties').delete().eq('user_id', user.id).eq('property_id', id);
      } else {
        await supabase.from('saved_properties').insert({ user_id: user.id, property_id: id });
      }
    },
    [user, savedIds]
  );

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const clearAll = useCallback(async () => {
    if (user) {
      await supabase.from('saved_properties').delete().eq('user_id', user.id);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setSavedIds([]);
  }, [user]);

  return { savedIds, toggleSave, isSaved, clearAll, count: savedIds.length, loading };
}
