import React from 'react';
import {
  Flame,
  Sparkles,
  Download,
  Clock,
  ShieldAlert,
  Star,
  Gift,
  Wand2,
  ArrowLeft,
} from 'lucide-react';
import { CursorProject } from '../types/cursor';
import { SPECIAL_CURSORS } from '../data/specialCursors';
import { CursorCard } from '../components/CursorCard';
import { exportAsZip } from '../utils/exportCursor';
import { useCollection } from '../context/CollectionContext';

interface SpecialsProps {
  onSelectCursor: (cursor: CursorProject) => void;
  onRemixCursor: (cursor: CursorProject) => void;
  onNavigateHome?: () => void;
}

export const Specials: React.FC<SpecialsProps> = ({ onSelectCursor, onRemixCursor, onNavigateHome }) => {
  const { showToast } = useCollection();

  const specialDrops = SPECIAL_CURSORS;

  const handleDownloadPack = async (packName: string, cursors: CursorProject[]) => {
    try {
      showToast(`Packaging ${packName}...`, 'Compiling binary .cur and asset files', 'info');
      // Export primary cursor in pack as zip
      if (cursors[0]) {
        await exportAsZip(cursors[0]);
        showToast(`Downloaded ${packName}!`, 'Unpack and apply via Windows Mouse Settings', 'download');
      }
    } catch {
      showToast('Export failed', undefined, 'info');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Specials Hero Banner */}
      <section className="relative rounded-3xl bg-[var(--card-bg)] border border-[var(--border)] p-6 sm:p-10 overflow-hidden shadow-xl">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: 'var(--accent)' }}
        />

        <div className="relative z-10 max-w-3xl space-y-4">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Options Hub</span>
            </button>
          )}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5" />
            <span>25 Exclusive Special Releases</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            Special Drops & Mythic Master Releases
          </h1>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            25 standalone, ultra-detailed exclusive cursor sets combined from the pinnacle of every category — completely distinct from the main gallery.
          </p>
        </div>
      </section>

      {/* Featured Master Bundles */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <Gift className="w-4 h-4 text-[var(--accent)]" />
          <span>Curated Special Bundles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bundle 1: Mythic Armory */}
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  MYTHIC ARMORY
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">4 Cursors</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Dark Moon, Halo & Blades</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Includes Dark Moon Greatsword, Halo Plasma Sword, Cloud Buster Sword, and Leviathan Frost Axe.
              </p>
            </div>

            <button
              onClick={() => handleDownloadPack('Mythic Armory Pack', [specialDrops[0], specialDrops[7], specialDrops[13], specialDrops[20]])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Armory Pack (.ZIP)</span>
            </button>
          </div>

          {/* Bundle 2: Kawaii & Aesthetic Specials */}
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30">
                  KAWAII SPECIALS
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">4 Cursors</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Kuromi, Totoro & Axolotl</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Includes Kuromi Jester Crown, Totoro Rain Leaf, Axolotl Boba Tea, and Cinnamoroll Angel Cloud.
              </p>
            </div>

            <button
              onClick={() => handleDownloadPack('Kawaii Specials Pack', [specialDrops[3], specialDrops[10], specialDrops[16], specialDrops[23]])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Kawaii Pack (.ZIP)</span>
            </button>
          </div>

          {/* Bundle 3: Legendary Meme & Tech Vault */}
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  MEME & TECH VAULT
                </span>
                <span className="text-xs text-[var(--text-muted)] font-mono">4 Cursors</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text)]">Rickroll, Galaxy Brain & Quantum</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Includes Rickroll Golden Mic, Keyboard Cat, Transcendent Galaxy Brain, and 1024-Qubit Quantum Chip.
              </p>
            </div>

            <button
              onClick={() => handleDownloadPack('Meme & Tech Pack', [specialDrops[4], specialDrops[17], specialDrops[24], specialDrops[12]])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Vault Pack (.ZIP)</span>
            </button>
          </div>
        </div>
      </section>

      {/* All 25 Special Drops Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[var(--text)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>25 Exclusive Special Releases ({specialDrops.length})</span>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">Independent Collection</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {specialDrops.map(cursor => (
            <CursorCard
              key={cursor.id}
              project={cursor}
              onSelect={onSelectCursor}
              onRemix={onRemixCursor}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
