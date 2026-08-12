import React, { useEffect, useState } from 'react';
import { Share, Smartphone, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

  return isIos && isSafari;
}

function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;

  const nav = window.navigator as NavigatorStandalone;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true
  );
}

interface InstallPromptProps {
  forceShow?: boolean;
  onDismiss?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ forceShow = false, onDismiss }) => {
  const [dismissed, setDismissed] = useLocalStorage<boolean>('a2hs-dismissed', false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setVisible(true);
      return;
    }

    const shouldShow = isIosSafari() && !isStandalonePwa() && !dismissed;
    setVisible(shouldShow);
  }, [forceShow, dismissed]);

  if (!visible) return null;

  const handleDismiss = () => {
    if (!forceShow) {
      setDismissed(true);
    }
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className="fixed inset-x-0 bottom-24 z-[35] flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/15">
              <Smartphone className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Install this app</p>
              <p className="text-xs text-zinc-400">Add to your Home Screen</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-4 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-900">
              1
            </span>
            <div>
              <p className="text-sm font-medium text-white">Tap the Share button</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                Look for
                <Share className="inline h-3.5 w-3.5 text-blue-400" />
                in Safari&apos;s bottom toolbar
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-900">
              2
            </span>
            <div>
              <p className="text-sm font-medium text-white">Tap &quot;Add to Home Screen&quot;</p>
              <p className="mt-1 text-xs text-zinc-400">
                Then tap Add in the top-right corner to install.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
