import type { ReactNode } from 'react';
import { Headset } from 'lucide-react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import nexApproveLogo from '@/assets/nexapprove-logo.png';

interface LayoutProps {
  children: ReactNode;
  /** Center the content vertically (for auth pages like login, set-password). Default: false */
  centered?: boolean;
  /** Show ambient background effects (glow, orbs, grid). Default: true */
  showAmbient?: boolean;
  /** Show the footer. Default: true */
  showFooter?: boolean;
}

const Layout = ({
  children,
  centered = false,
  showAmbient = true,
  showFooter = true,
}: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background transition-colors duration-300">
      {/* ── Ambient Background Effects ── */}
      {showAmbient && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <img
              src={nexApproveLogo}
              alt=""
              aria-hidden="true"
              className="h-[700px] w-[700px] select-none object-contain opacity-[0.04] dark:opacity-[0.03]"
              style={{ filter: 'blur(2px)' }}
            />
          </div>
          <div className="login-glow pointer-events-none absolute inset-0" />
          <div className="login-orb-1 pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full blur-[100px]" />
          <div className="login-orb-2 pointer-events-none absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full blur-[80px]" />
          <div className="login-grid pointer-events-none absolute inset-0" />
        </>
      )}

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <img
            src={nexApproveLogo}
            alt="NexApprove"
            className="h-8 w-8 object-contain drop-shadow-lg"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">NexApprove</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Headset className="size-4" />
            <span className="hidden sm:inline">Contact IT Support</span>
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className={`relative z-10 flex flex-1 px-4 py-8 ${
          centered ? 'items-center justify-center' : 'flex-col items-start px-6 sm:px-10'
        }`}
      >
        {children}
      </main>

      {/* ── Footer ── */}
      {showFooter && (
        <footer className="relative z-10 pb-6 pt-2 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
            © {new Date().getFullYear()} NexApprove • All rights reserved
          </p>
        </footer>
      )}
    </div>
  );
};

export default Layout;
