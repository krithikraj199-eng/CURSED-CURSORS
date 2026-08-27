import React, { useState } from 'react';
import { Laptop, Gamepad2, Mail, Instagram, Copy, Check } from 'lucide-react';
import { LogoCC } from './LogoCC';
import { NavigationPage } from './Header';

interface FooterProps {
  setActivePage: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('krithikraj199@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer id="main-app-footer" className="w-full border-t border-[var(--border)] bg-[var(--surface)]/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* 1. Brand and Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <LogoCC size={32} />
              <span className="font-extrabold text-base tracking-wider text-[var(--text)]">CURSED CURSORS</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--accent)] border border-[var(--border)]">
                PRO
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Custom cursors for modern browsers, Windows 10/11 mouse properties, and Roblox player clients. Dual-pair previews with live hover physics.
            </p>
          </div>

          {/* 2. Navigation Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-[var(--text)] uppercase tracking-wider text-[11px]">Platform & Gallery</h4>
            <ul className="space-y-1.5 text-[var(--text-muted)]">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('gallery')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  Cursor Gallery
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('specials')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  Limited Edition Drops
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('sandbox')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  Hover Physics Arena
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('collection')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  My Collection
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('constructor')} className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1">
                  <span>Custom Constructor</span>
                  <span className="text-[9px] font-bold px-1 rounded bg-[var(--accent)]/15 text-[var(--accent)]">PRO</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Guides & Platforms */}
          <div className="space-y-2.5 text-xs">
            <h4 className="font-bold text-[var(--text)] uppercase tracking-wider text-[11px]">Installation & Guides</h4>
            <ul className="space-y-1.5 text-[var(--text-muted)]">
              <li>
                <button onClick={() => setActivePage('guides')} className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Windows 10/11 Setup</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('guides')} className="hover:text-[var(--accent)] transition-colors cursor-pointer flex items-center gap-1.5">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Roblox Custom Pointers</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('guides')} className="hover:text-[var(--accent)] transition-colors cursor-pointer">
                  Safety & Privacy FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Corner Bar with Discreet Contact Links */}
        <div className="pt-6 border-t border-[var(--border)]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} CURSED CURSORS. 100% Free & Open Tools.</p>

          {/* Discreet corner contact links */}
          <div className="flex items-center gap-4 text-xs">
            <a
              id="corner-instagram-link"
              href="https://www.instagram.com/__one__piece_z"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--text-muted)] hover:text-pink-400 transition-colors inline-flex items-center gap-1.5 font-medium"
              title="Instagram: @__one__piece_z"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@__one__piece_z</span>
            </a>

            <span className="text-[var(--border)]">•</span>

            <div className="inline-flex items-center gap-1.5">
              <a
                id="corner-email-link"
                href="mailto:krithikraj199@gmail.com"
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors inline-flex items-center gap-1.5 font-medium"
                title="Send email"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>krithikraj199@gmail.com</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
