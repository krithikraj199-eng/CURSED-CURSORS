import React, { createContext, useContext, useState, useEffect } from 'react';
import { CursorProject } from '../types/cursor';
import { FEATURED_CURSORS } from '../data/featuredCursors';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'download';
}

interface CollectionContextType {
  collectedIds: string[];
  collectedCursors: CursorProject[];
  addToCollection: (cursor: CursorProject) => void;
  removeFromCollection: (cursorId: string) => void;
  isCollected: (cursorId: string) => boolean;
  toggleCollection: (cursor: CursorProject) => void;
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'download') => void;
  removeToast: (id: string) => void;
  activeLiveCursor: CursorProject | null;
  setActiveLiveCursor: (cursor: CursorProject | null) => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collectedIds, setCollectedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cursed_user_collection') || localStorage.getItem('sweezy_user_collection');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default with 2 popular cursors pre-saved
    return ['feat-cyber-dagger', 'feat-diamond-sword'];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeLiveCursor, setActiveLiveCursor] = useState<CursorProject | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('cursed_user_collection', JSON.stringify(collectedIds));
    } catch {
      // ignore
    }
  }, [collectedIds]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'download' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev.slice(-3), { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCollection = (cursor: CursorProject) => {
    if (!collectedIds.includes(cursor.id)) {
      setCollectedIds(prev => [...prev, cursor.id]);
      showToast(`Added "${cursor.title}"`, 'Saved to your active collection & extension sync', 'success');
    }
  };

  const removeFromCollection = (cursorId: string) => {
    setCollectedIds(prev => prev.filter(id => id !== cursorId));
    showToast('Removed from collection', undefined, 'info');
  };

  const isCollected = (cursorId: string) => collectedIds.includes(cursorId);

  const toggleCollection = (cursor: CursorProject) => {
    if (isCollected(cursor.id)) {
      removeFromCollection(cursor.id);
    } else {
      addToCollection(cursor);
    }
  };

  // Resolve collected objects from FEATURED_CURSORS + custom
  const collectedCursors = FEATURED_CURSORS.filter(c => collectedIds.includes(c.id));

  return (
    <CollectionContext.Provider
      value={{
        collectedIds,
        collectedCursors,
        addToCollection,
        removeFromCollection,
        isCollected,
        toggleCollection,
        toasts,
        showToast,
        removeToast,
        activeLiveCursor,
        setActiveLiveCursor,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
};
