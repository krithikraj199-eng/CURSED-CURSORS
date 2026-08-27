import React, { useState, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CollectionProvider } from './context/CollectionContext';
import { useProjects } from './hooks/useProjects';
import { CursorProject } from './types/cursor';
import { FEATURED_CURSORS } from './data/featuredCursors';
import { Header, NavigationPage } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Specials } from './pages/Specials';
import { CollectionPage } from './pages/CollectionPage';
import { Guides } from './pages/Guides';
import { Customize } from './pages/Customize';
import { SandboxPage } from './pages/SandboxPage';
import { CursorDetailModal } from './components/CursorDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ToastContainer } from './components/ToastContainer';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<NavigationPage>('home');
  const [browseCategory, setBrowseCategory] = useState<string | undefined>(undefined);
  const [selectedCursorModal, setSelectedCursorModal] = useState<CursorProject | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [returnToPortalId, setReturnToPortalId] = useState<string | null>(null);

  const { saveProject } = useProjects();

  // Active Project for the Constructor Studio
  const [activeProject, setActiveProject] = useState<CursorProject>(
    FEATURED_CURSORS[0] || {
      id: 'default-cursor',
      title: 'Neon Cyber Pointer',
      description: 'Default neon cursor composition',
      cursorType: 'normal',
      hotspot: { x: 2, y: 2 },
      tags: ['neon', 'glow', 'vector'],
      isFeatured: false,
      layers: [],
    }
  );

  // Remix handler: loads chosen cursor into constructor and navigates to constructor
  const handleRemix = useCallback((projectToRemix: CursorProject) => {
    const remixed: CursorProject = {
      ...projectToRemix,
      id: `remix-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: `${projectToRemix.title} (Remix)`,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveProject(remixed);
    setActivePage('constructor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((page: NavigationPage, category?: string, originCardId?: string) => {
    if (category) {
      setBrowseCategory(category);
    }
    if (originCardId) {
      setReturnToPortalId(originCardId);
    } else if (page === 'home') {
      // If manually navigating to home from header or logo without origin, clear
      setReturnToPortalId(null);
    }
    setActivePage(page);
    try {
      window.history.pushState({ page, originCardId: originCardId || (page !== 'home' ? returnToPortalId : null) }, '');
    } catch {
      // Ignore if iframe history restrictions apply
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [returnToPortalId]);

  // Back button handler: returns to home and keeps returnToPortalId active so Home scrolls to the card
  const handleNavigateHome = useCallback(() => {
    setActivePage('home');
    try {
      window.history.pushState({ page: 'home', originCardId: returnToPortalId }, '');
    } catch {
      // Ignore
    }
  }, [returnToPortalId]);

  // Listen to browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setActivePage(event.state.page);
        if (event.state.page === 'home' && event.state.originCardId) {
          setReturnToPortalId(event.state.originCardId);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)] selection:text-[var(--accent-contrast)]">
      {/* Global Navigation Header */}
      <Header
        activePage={activePage}
        setActivePage={page => {
          if (page === 'home') setReturnToPortalId(null);
          handleNavigate(page);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activePage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            returnToPortalId={returnToPortalId}
            onClearReturnPortal={() => setReturnToPortalId(null)}
          />
        )}

        {(activePage === 'gallery' || activePage === 'browse') && (
          <Browse
            initialCategory={browseCategory}
            onSelectCursor={cursor => setSelectedCursorModal(cursor)}
            onRemixCursor={handleRemix}
            onNavigateConstructor={() => handleNavigate('constructor', undefined, 'constructor')}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {activePage === 'constructor' && (
          <Customize
            project={activeProject}
            onSave={saveProject}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {activePage === 'specials' && (
          <Specials
            onSelectCursor={cursor => setSelectedCursorModal(cursor)}
            onRemixCursor={handleRemix}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {activePage === 'sandbox' && (
          <SandboxPage
            onNavigateHome={handleNavigateHome}
            onNavigateGallery={() => handleNavigate('gallery', undefined, 'gallery')}
          />
        )}

        {activePage === 'collection' && (
          <CollectionPage
            onSelectCursor={cursor => setSelectedCursorModal(cursor)}
            onRemixCursor={handleRemix}
            onNavigateBrowse={() => handleNavigate('browse', undefined, 'gallery')}
            onNavigateHome={handleNavigateHome}
          />
        )}

        {activePage === 'guides' && (
          <Guides onNavigateHome={handleNavigateHome} />
        )}
      </main>

      {/* Footer */}
      <Footer setActivePage={page => handleNavigate(page)} />

      {/* Global Cursor Detail & Live Sandbox Modal */}
      <CursorDetailModal
        cursor={selectedCursorModal}
        onClose={() => setSelectedCursorModal(null)}
        onRemix={handleRemix}
      />

      {/* Global Cmd+K Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCursor={cursor => setSelectedCursorModal(cursor)}
        onNavigate={page => handleNavigate(page as NavigationPage)}
      />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <CollectionProvider>
        <AppContent />
      </CollectionProvider>
    </ThemeProvider>
  );
}

export default App;
