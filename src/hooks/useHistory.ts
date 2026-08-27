import { useState, useCallback, useRef } from 'react';

export function useHistory<T>(initialPresent: T, maxHistoryLength = 30) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initialPresent);
  const [future, setFuture] = useState<T[]>([]);
  
  const presentRef = useRef(present);
  presentRef.current = present;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const undo = useCallback(() => {
    setPast(prevPast => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setFuture(prevFuture => [presentRef.current, ...prevFuture]);
      setPresent(previous);
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture(prevFuture => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setPast(prevPast => [...prevPast, presentRef.current]);
      setPresent(next);
      return newFuture;
    });
  }, []);

  const set = useCallback(
    (newPresent: T | ((curr: T) => T), recordHistory = true) => {
      const resolved =
        typeof newPresent === 'function'
          ? (newPresent as (curr: T) => T)(presentRef.current)
          : newPresent;

      if (!recordHistory) {
        setPresent(resolved);
        return;
      }

      setPast(prevPast => {
        const updated = [...prevPast, presentRef.current];
        if (updated.length > maxHistoryLength) {
          return updated.slice(updated.length - maxHistoryLength);
        }
        return updated;
      });
      setPresent(resolved);
      setFuture([]);
    },
    [maxHistoryLength]
  );

  const reset = useCallback((newPresent: T) => {
    setPast([]);
    setPresent(newPresent);
    setFuture([]);
  }, []);

  return {
    state: present,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historyLength: past.length,
  };
}
