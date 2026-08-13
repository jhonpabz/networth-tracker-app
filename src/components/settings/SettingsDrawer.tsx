import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Download,
  Fingerprint,
  Share,
  Smartphone,
  Upload,
  X,
} from 'lucide-react';
import { NAV_TAB_CONFIG, NavVisibility } from '../../types/Settings';
import { useWebAuthn } from '../../hooks/useWebAuthn';
import {
  downloadJsonExport,
  importLocalStorageState,
  readJsonFile,
} from '../../utils/localStorageExport';
import ToggleSwitch from './ToggleSwitch';
import ChangePinModal from './ChangePinModal';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navVisibility: NavVisibility;
  biometricsEnabled: boolean;
  autoTriggerBiometricsOnLaunch: boolean;
  onNavVisibilityChange: (key: keyof NavVisibility, enabled: boolean) => void;
  onBiometricsEnabledChange: (enabled: boolean) => void;
  onAutoTriggerBiometricsOnLaunchChange: (enabled: boolean) => void;
  canDisableTab: (key: keyof NavVisibility) => boolean;
  onChangePin: (currentPin: string, newPin: string) => boolean;
  onShowInstallInstructions: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  navVisibility,
  biometricsEnabled,
  autoTriggerBiometricsOnLaunch,
  onNavVisibilityChange,
  onBiometricsEnabledChange,
  onAutoTriggerBiometricsOnLaunchChange,
  canDisableTab,
  onChangePin,
  onShowInstallInstructions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showChangePin, setShowChangePin] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [biometricMessage, setBiometricMessage] = useState<string | null>(null);

  const { isSupported, isProcessing, register, removeCredential } = useWebAuthn();

  if (!isOpen) return null;

  const handleBiometricsToggle = async (enabled: boolean) => {
    setBiometricMessage(null);

    if (enabled) {
      if (!isSupported) {
        setBiometricMessage('Biometrics are not supported on this device or browser.');
        return;
      }

      const success = await register();
      if (success) {
        onBiometricsEnabledChange(true);
        setBiometricMessage('Face ID / Touch ID enabled.');
      }
      return;
    }

    removeCredential();
    onBiometricsEnabledChange(false);
    setBiometricMessage('Biometric authentication disabled.');
  };

  const handleExport = () => {
    downloadJsonExport();
  };

  const handleImportClick = () => {
    setImportError(null);
    setImportSuccess(false);
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    try {
      const json = await readJsonFile(file);
      importLocalStorageState(json);
      setImportSuccess(true);
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-sm pt-8 bg-white border-l border-gray-200 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-5 py-4 overflow-y-auto">
          <section className="mb-8">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Custom Navigation
            </h3>
            <div className="px-4 border border-gray-200 divide-y divide-gray-100 rounded-xl bg-gray-50 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800/50">
              {NAV_TAB_CONFIG.map(({ visibilityKey, label }) => (
                <ToggleSwitch
                  key={visibilityKey}
                  id={`nav-${visibilityKey}`}
                  label={label}
                  checked={navVisibility[visibilityKey]}
                  disabled={navVisibility[visibilityKey] && !canDisableTab(visibilityKey)}
                  onChange={(enabled) => onNavVisibilityChange(visibilityKey, enabled)}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              At least one tab must remain enabled.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Security
            </h3>
            <div className="p-4 space-y-3 border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
              <ToggleSwitch
                id="biometrics-toggle"
                label="Face ID / Touch ID"
                description={
                  isSupported
                    ? 'Unlock with biometrics when available'
                    : 'Not supported on this device'
                }
                checked={biometricsEnabled}
                disabled={!isSupported || isProcessing}
                onChange={handleBiometricsToggle}
              />

              <ToggleSwitch
                id="auto-trigger-biometrics-toggle"
                label="Auto-trigger Face ID / Passkey on Launch"
                description="Prompt biometrics as soon as the lock screen appears"
                checked={autoTriggerBiometricsOnLaunch}
                disabled={!isSupported || !biometricsEnabled || isProcessing}
                onChange={onAutoTriggerBiometricsOnLaunchChange}
              />

              {biometricMessage && (
                <p className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <Fingerprint className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {biometricMessage}
                </p>
              )}

              <button
                type="button"
                onClick={() => setShowChangePin(true)}
                className="w-full px-4 py-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Change PIN
              </button>
            </div>
          </section>

          <section className="mb-8">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Data Management
            </h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold transition-colors rounded-lg bg-amber-400 text-zinc-900 hover:bg-amber-300"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>

              <button
                type="button"
                onClick={handleImportClick}
                className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <Upload className="w-4 h-4" />
                Import JSON
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={handleFileSelected}
              />

              {importError && (
                <div className="flex items-start gap-2 p-3 text-sm text-red-600 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {importError}
                </div>
              )}

              {importSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Import successful. Reloading…
                </p>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              App Install
            </h3>
            <button
              type="button"
              onClick={() => {
                onShowInstallInstructions();
                onClose();
              }}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              <Smartphone className="w-4 h-4" />
              Add to Home Screen
            </button>
            <p className="flex items-start gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Share className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Install this app for a full-screen, offline experience.
            </p>
          </section>
        </div>
      </aside>

      <ChangePinModal
        isOpen={showChangePin}
        onClose={() => setShowChangePin(false)}
        onChangePin={onChangePin}
      />
    </>
  );
};

export default SettingsDrawer;
