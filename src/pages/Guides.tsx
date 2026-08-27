import React, { useState } from 'react';
import {
  HelpCircle,
  Laptop,
  Gamepad2,
  Chrome,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  FolderOpen,
  MousePointer2,
  ArrowLeft,
} from 'lucide-react';
import { FEATURED_CURSORS } from '../data/featuredCursors';
import { exportAsCur } from '../utils/exportCursor';
import { useCollection } from '../context/CollectionContext';

interface GuidesProps {
  onNavigateHome?: () => void;
}

export const Guides: React.FC<GuidesProps> = ({ onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<'windows' | 'roblox' | 'chrome' | 'safety'>('windows');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { showToast } = useCollection();

  const handleTestDownload = async () => {
    try {
      if (FEATURED_CURSORS[0]) {
        await exportAsCur(FEATURED_CURSORS[0]);
        showToast('Downloaded sample .cur file!', 'Use this to test the Windows guide below', 'download');
      }
    } catch {
      showToast('Download error', undefined, 'info');
    }
  };

  const faqs = [
    {
      q: 'Are these cursor files safe to download and install?',
      a: 'Yes, 100%! All cursor files exported from CURSED CURSORS are native static or animated cursor binaries (.cur / .ani / .png) generated purely in vector canvas. They contain zero executable code, zero background processes, and zero adware.',
    },
    {
      q: 'How do I change mouse cursor size in Windows 11?',
      a: 'In Windows 11, go to Settings > Accessibility > Mouse pointer and touch. You can adjust the slider from size 1 to 15 to scale your cursor dynamically.',
    },
    {
      q: 'Will Roblox update override my custom cursor?',
      a: 'When Roblox updates its client, it creates a new version folder. You simply copy your ArrowFarCursor.png into the new version/content/textures/Cursors/KeyboardMouse directory.',
    },
    {
      q: 'How does the interactive live hover testing work on this site?',
      a: 'We dynamically compile each cursor vector layer into an in-memory 32x32 Data URL and bind it with the exact hotspot coordinates to inline CSS cursor rules. When you hover over any card or sandbox, your physical mouse pointer transforms instantly!',
    },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-6 space-y-2">
        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Options Hub</span>
          </button>
        )}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Documentation & Safety</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text)]">Installation Guides & FAQ</h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)]">
          Step-by-step instructions for Windows 10/11, Roblox player clients, and browser extensions.
        </p>
      </div>

      {/* Guide Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('windows')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'windows'
              ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Windows 10 / 11 (.CUR)</span>
        </button>

        <button
          onClick={() => setActiveTab('roblox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roblox'
              ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Roblox Client (.PNG)</span>
        </button>

        <button
          onClick={() => setActiveTab('chrome')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chrome'
              ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <Chrome className="w-4 h-4" />
          <span>Browser Extension</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'safety'
              ? 'bg-[var(--accent)] text-[var(--accent-contrast)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Safety & Verification</span>
        </button>
      </div>

      {/* Guide 1: Windows 10/11 */}
      {activeTab === 'windows' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                <Laptop className="w-5 h-5 text-[var(--accent)]" />
                <span>How to Install .CUR Cursors in Windows 10 & 11</span>
              </h2>
              <button
                onClick={handleTestDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample .cur</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-black/30">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">1</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Download your preferred cursor in .CUR format</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Click the download icon on any cursor card or inside the modal and choose <strong>Windows (.CUR)</strong>. Move the downloaded file into a permanent folder (e.g. <code className="text-[var(--accent)]">C:\Windows\Cursors</code> or your Documents).
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-black/30">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">2</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Open Windows Mouse Properties</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--card-bg)] border border-[var(--border)] font-mono">Win + R</kbd>, type <code className="text-[var(--accent)] font-mono">main.cpl</code> and hit Enter. This opens the native Windows Mouse Properties dialog.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-black/30">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">3</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Select "Pointers" tab & browse file</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Under the <strong>Pointers</strong> tab, select <em>Normal Select</em> or <em>Link Select</em>, click <strong>Browse...</strong>, select your downloaded <code className="text-[var(--accent)] font-mono">.cur</code> file, and click <strong>Apply</strong>!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide 2: Roblox Custom Cursor */}
      {activeTab === 'roblox' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-rose-400" />
              <span>How to Apply Custom Cursors to Roblox</span>
            </h2>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-rose-500 text-white font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-rose-800">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">1</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Download the Roblox Asset Pack</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Click download on your desired cursor and select <strong>Roblox Asset Pack</strong>. This downloads pre-formatted <code className="text-[var(--accent)] font-mono">ArrowFarCursor.png</code> and <code className="text-[var(--accent)] font-mono">ArrowCursor.png</code> files.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-rose-500 text-white font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-rose-800">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">2</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Locate Roblox Client Directory</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Right-click your <strong>Roblox Player</strong> shortcut on your desktop &gt; click <strong>Open file location</strong>.
                    Navigate into: <code className="text-[var(--accent)] font-mono text-[11px] block mt-1 p-2 rounded bg-[var(--bg)]">content \ textures \ Cursors \ KeyboardMouse</code>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="flex flex-col items-center justify-center min-w-16 px-2.5 py-1.5 rounded-lg bg-rose-500 text-white font-extrabold text-[11px] shadow-sm shrink-0 border-b-2 border-rose-800">
                  <span>STEP</span>
                  <span className="text-sm font-black leading-none mt-0.5">3</span>
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-[var(--text)]">Paste & Replace Asset Files</h4>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Copy and paste the downloaded PNGs into this folder to overwrite the default cursor. Launch any Roblox game (Blox Fruits, Blade Ball, Arsenal) to enjoy your new cursor!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide 3: Browser Extension */}
      {activeTab === 'chrome' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <Chrome className="w-5 h-5 text-amber-400" />
              <span>Browser Extension & Web Sync</span>
            </h2>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              When using the CURSED CURSORS Web Application, any cursor added to <strong>My Collection</strong> is stored directly in your local browser state. When browsing this website or paired web apps, your cursor changes dynamically with full pointer precision.
            </p>

            <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[var(--text)]">Live Web Testing Mode</h4>
                <p className="text-[11px] text-[var(--text-muted)]">No extension needed! Hovering cards or using constructor works right in your browser.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Guide 4: Safety & Security */}
      {activeTab === 'safety' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="p-6 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] space-y-4">
            <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Security, Privacy & Standards</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="font-bold text-xs text-[var(--text)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Executable Binaries (.EXE)</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  We strictly export standard raster and binary formats (.cur, .png, .zip). We never run installers or background background processes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="font-bold text-xs text-[var(--text)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Client-Side Local Storage</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Your custom constructor designs and collection items are stored in your browser's private localStorage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Accordion Section */}
      <section className="space-y-4 pt-4">
        <h3 className="text-base font-bold text-[var(--text)]">Frequently Asked Questions</h3>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[var(--card-bg)] border border-[var(--border)] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-[var(--accent)] shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]/40 pt-3 animate-in fade-in duration-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
