import { useState, useEffect, useCallback } from 'react';
import { CursorProject } from '../types/cursor';
import { FEATURED_CURSORS } from '../data/featuredCursors';

export function useProjects() {
  const [savedProjects, setSavedProjects] = useState<CursorProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedProjects(data);
      }
    } catch (err: any) {
      console.warn('Could not fetch server projects, using local memory state:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProject = useCallback(async (project: CursorProject): Promise<{ success: boolean; project?: CursorProject; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.project) {
        setSavedProjects(prev => {
          const index = prev.findIndex(p => p.id === data.project.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = data.project;
            return next;
          }
          return [data.project, ...prev];
        });
        return { success: true, project: data.project };
      }
      throw new Error(data.error || 'Failed to save project');
    } catch (err: any) {
      // Fallback local save if server request fails
      const fallbackProject: CursorProject = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
      setSavedProjects(prev => {
        const idx = prev.findIndex(p => p.id === project.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = fallbackProject;
          return updated;
        }
        return [fallbackProject, ...prev];
      });
      return { success: true, project: fallbackProject };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    savedProjects,
    featuredProjects: FEATURED_CURSORS,
    isLoading,
    error,
    fetchProjects,
    saveProject,
  };
}
