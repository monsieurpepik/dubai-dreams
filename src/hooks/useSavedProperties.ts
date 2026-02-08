import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'saved-properties';

export function useSavedProperties() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const clearAll = useCallback(() => setSavedIds([]), []);

  return { savedIds, toggleSave, isSaved, clearAll, count: savedIds.length };
}
