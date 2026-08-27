import React, { useState } from 'react';
import {
  Compass,
  Wand2,
  Flame,
  Bookmark,
  Zap,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { LogoCC } from '../components/LogoCC';
import { NavigationPage } from '../components/Header';
import { useCollection } from '../context/CollectionContext';

interface HomeProps {
  onNavigate: (page: NavigationPage, category?: string, originCardId?: string) => void;
  returnToPortalId?: string | null;
  onClearReturnPortal?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, returnToPortalId, onClearReturnPortal }) => {
  const { collectedIds } = useCollection();

  // Automatically scroll back down to the exact card the user opened when returning
  React.useEffect(() => {
    if (returnToPortalId) {
      const timer = setTimeout(() => {
        const target = document.getElementById(`portal-card-${returnToPortalId}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('ring-2', 'ring-[var(--accent)]', 'ring-offset-2', 'scale-[1.02]', 'shadow-2xl');
          setTimeout(() => {
            target.classList.remove('ring-2', 'ring-[var(--accent)]', 'ring-offset-2', 'scale-[1.02]', 'shadow-2xl');
            onClearReturnPortal?.();
          }, 1500);
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [returnToPortalId, onClearReturnPortal]);

  // Core Main Options ordered strictly per request:
  // 1. Cursor Gallery
  // 2. Special Drops
  // 3. Hover Sandbox
  // 4. Saved Collection
  // 5. System Guides
  // 6. Constructor Studio (at the last)
  const coreOptions = [
    {
      id: 'gallery' as NavigationPage,
      badge: 'Main Catalog',
      title: 'Cursor Gallery',
      subtitle: '70 Curated Models across 7 Categories',
      desc: 'Explore popular curated models across Games, Anime, Cute, Memes, Cyber & Sci-Fi, Aesthetics, and Tech & OS with custom normal and pointer states.',
      icon: Compass,
      color: 'from-cyan-500/20 to-blue-500/20',
      borderGlow: 'hover:border-cyan-500/40',
      accentColor: 'text-cyan-400',
      stats: '70 Quality Pairs',
    },
    {
      id: 'specials' as NavigationPage,
      badge: 'Limited Edition',
      title: 'Special Drops',
      subtitle: '25 Standalone Mythic Releases',
      desc: 'Exclusive top releases combining the finest designs across all themes — completely independent and non-overlapping with the main gallery.',
      icon: Flame,
      color: 'from-amber-500/20 to-rose-500/20',
      borderGlow: 'hover:border-amber-500/40',
      accentColor: 'text-amber-400',
      stats: '25 Unique Specials',
    },
    {
      id: 'sandbox' as NavigationPage,
      badge: 'Interactive Testing',
      title: 'Hover Physics Arena',
      subtitle: 'Dual-Pair Real-Time Playground',
      desc: 'Test precision clicking, target aiming, draggable tokens, and multi-surface responsiveness with custom normal/pointer states.',
      icon: Zap,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderGlow: 'hover:border-emerald-500/40',
      accentColor: 'text-emerald-400',
      stats: 'Live Physics Sandbox',
    },
    {
      id: 'collection' as NavigationPage,
      badge: 'User Workspace',
      title: 'My Collection',
      subtitle: 'Saved & Custom Packs',
      desc: 'Manage your bookmarked presets, active favorites, downloaded bundles, and workspace designs in one centralized hub.',
      icon: Bookmark,
      color: 'from-purple-500/20 to-pink-500/20',
      borderGlow: 'hover:border-purple-500/40',
      accentColor: 'text-purple-400',
      stats: `${collectedIds.length} Saved Cursors`,
    },
    {
      id: 'guides' as NavigationPage,
      badge: 'Documentation',
      title: 'Installation Guides',
      subtitle: 'Windows & Roblox Tutorials',
      desc: 'Step-by-step verified setup instructions for Windows 10/11 mouse properties, registry-free activation, and Roblox asset replacement.',
      icon: HelpCircle,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderGlow: 'hover:border-blue-500/40',
      accentColor: 'text-blue-400',
      stats: '100% Free & Safe',
    },
    {
      id: 'constructor' as NavigationPage,
      badge: 'Custom Builder',
      title: 'Custom Constructor',
      subtitle: 'Vector Layer Canvas & AI Studio',
      desc: 'Design custom cursors from scratch using multi-layer shapes, stars, sparkles, emojis, pixel grids, or AI vector synthesis.',
      icon: Wand2,
      color: 'from-rose-500/20 to-purple-500/20',
      borderGlow: 'hover:border-rose-500/40',
      accentColor: 'text-rose-400',
      stats: 'Full Vector Editor',
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* 1. HERO HEADER SECTION */}
      <section
        id="home-hero-hub"
        className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--card-bg)] via-[var(--surface)] to-[var(--card-bg)] shadow-xl"
      >
        {/* Background decorative ambient glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--accent)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CURSED CURSORS • Options Hub</span>
          </div>

          <div className="flex items-center gap-4">
            <LogoCC size={56} />
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight">
                WELCOME TO CURSED CURSOR
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--accent)] tracking-wider uppercase">
                EXPLORE
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            Choose any portal below to jump directly to its dedicated page — browse handcrafted 3D cursor suites, discover animated special drops, test live hover physics, follow step-by-step installation guides, or build your own custom cursors.
          </p>
        </div>
      </section>

      {/* 2. THE 6 PRIMARY OPTIONS PORTALS GRID */}
      <section id="core-portals-grid" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-bold text-[var(--text)] tracking-wide">
              Explore All Modules
            </h2>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            Click any portal card to open
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                id={`portal-card-${option.id}`}
                onClick={() => onNavigate(option.id, undefined, option.id)}
                className={`group relative rounded-2xl p-6 bg-[var(--card-bg)] border border-[var(--border)] ${option.borderGlow} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden`}
              >
                {/* Subtle top corner gradient highlight */}
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${option.color} rounded-full blur-2xl group-hover:scale-150 transition-transform pointer-events-none`}
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Metadata row */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Icon className={`w-6 h-6 ${option.accentColor}`} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                        0{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                        {option.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">
                      {option.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-3">
                    {option.desc}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-6 mt-4 border-t border-[var(--border)]/60 flex items-center justify-between relative z-10 text-xs font-bold">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {option.stats}
                  </span>

                  <div className="inline-flex items-center gap-1.5 text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. QUICK COMPATIBILITY BADGE BANNER */}
      <section className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-[var(--text)]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block">100% Free & Open Vector Tools</span>
            <span className="text-[var(--text-muted)] text-[11px]">Native Windows .CUR binaries, Roblox textures, zero background bloat.</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('guides', undefined, 'guides')}
            className="px-4 py-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-bold text-[var(--text)] transition-colors cursor-pointer"
          >
            Read Guides
          </button>
          <button
            onClick={() => onNavigate('gallery', undefined, 'gallery')}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-sm hover:brightness-110 transition-all cursor-pointer"
          >
            Open Gallery
          </button>
        </div>
      </section>
    </div>
  );
};
