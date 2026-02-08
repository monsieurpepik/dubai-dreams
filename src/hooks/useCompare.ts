import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'compare-properties';
const MAX_COMPARE = 3;

export function useCompare() {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  }, []);

  const isComparing = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const clearAll = useCallback(() => setCompareIds([]), []);

  const canAdd = compareIds.length < MAX_COMPARE;

  return { compareIds, toggleCompare, isComparing, clearAll, canAdd, count: compareIds.length };
}
