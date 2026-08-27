import React, { useState, useEffect } from 'react';
import {
  MousePointer2,
  Sparkles,
  Compass,
  Wand2,
  Bookmark,
  HelpCircle,
  Search,
  Flame,
  Menu,
  X,
  Layers,
  Zap,
} from 'lucide-react';
import { LogoCC } from './LogoCC';
import { ThemePicker } from './ThemePicker';
import { useCollection } from '../context/CollectionContext';

export type NavigationPage = 'home' | 'gallery' | 'browse' | 'constructor' | 'specials' | 'sandbox' | 'collection' | 'guides';

interface HeaderProps {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { collectedIds } = useCollection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavigationPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'home', label: 'Options Hub', icon: Sparkles },
    { id: 'gallery', label: 'Gallery', icon: Compass },
    { id: 'constructor', label: 'Constructor', icon: Wand2, badge: 'PRO' },
    { id: 'specials', label: 'Specials', icon: Flame },
    { id: 'sandbox', label: 'Physics Arena', icon: Zap },
    { id: 'collection', label: 'My Collection', icon: Bookmark, badge: collectedIds.length > 0 ? collectedIds.length : undefined },
    { id: 'guides', label: 'Guides', icon: HelpCircle },
  ];

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 w-full z-40 transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-[var(--border)] shadow-lg shadow-black/10'
          : 'bg-[var(--bg)] border-[var(--border)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo with CC Monogram */}
        <button
          id="brand-logo-btn"
          onClick={() => setActivePage('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <LogoCC size={38} />
          <div>
            <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-base text-[var(--text)]">
              <span className="tracking-wide">CURSED</span>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] shadow-xs">
                CURSORS
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] hidden sm:block">
              Custom Cursors & Icons
            </p>
          </div>
        </button>

        {/* Global Search Bar (Triggers Search Modal) */}
        <div className="hidden md:flex flex-1 max-w-sm items-center">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between pl-3.5 pr-2.5 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Search 24+ cursors, tags, games...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg)] rounded border border-[var(--border)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-[var(--surface)]/80 p-1 rounded-2xl border border-[var(--border)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-black/20 text-white'
                        : 'bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Theme Selector + Mobile Menu */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            title="Search Cursors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Selector */}
          <ThemePicker />

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-150">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'text-[var(--text)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--accent)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
