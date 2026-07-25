import React, { useState } from 'react';
import { ShopSettings } from '../types';
import { saveShopSettings, importBackupJSON, exportBackupJSON } from '../utils/storage';
import { Settings, Save, HardDriveDownload, Upload, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

interface BackupSettingsModalProps {
  settings: ShopSettings;
  onSettingsSaved: (updated: ShopSettings) => void;
  onDataImported: () => void;
}

export const BackupSettingsModal: React.FC<BackupSettingsModalProps> = ({
  settings,
  onSettingsSaved,
  onDataImported,
}) => {
  const [formSettings, setFormSettings] = useState<ShopSettings>(settings);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveShopSettings(formSettings);
    onSettingsSaved(formSettings);
    setToastMessage('Shop details updated successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importBackupJSON(content);
        if (result.success) {
          setImportStatus(`Successfully restored database! Added ${result.count} new reports.`);
          onDataImported();
        } else {
          setImportStatus(`Import Error: ${result.error || 'Failed to process JSON file'}`);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {toastMessage && (
        <div className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shop Information Form */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
      >
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-amber-400" />
              <span>Shop Branding & Invoice Header Settings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize shop title and default values printed on customer PDF certificates.
            </p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 shadow-md"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Shop Name (Printed on Top of Certificates)
            </label>
            <input
              type="text"
              value={formSettings.shopName}
              onChange={(e) =>
                setFormSettings((prev) => ({ ...prev, shopName: e.target.value }))
              }
              placeholder="e.g. Shree Charbhuja Tyres"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-amber-400 text-sm font-bold uppercase focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Shop Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formSettings.tagline}
              onChange={(e) =>
                setFormSettings((prev) => ({ ...prev, tagline: e.target.value }))
              }
              placeholder="e.g. Multi-Brand Tyre Sales, Wheel Alignment & Complete Tyre Care"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Shop Contact Phone Numbers
            </label>
            <input
              type="text"
              value={formSettings.mobileNo}
              onChange={(e) =>
                setFormSettings((prev) => ({ ...prev, mobileNo: e.target.value }))
              }
              placeholder="+91 98290 12345"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Default Technician Name
            </label>
            <input
              type="text"
              value={formSettings.defaultTechnician}
              onChange={(e) =>
                setFormSettings((prev) => ({
                  ...prev,
                  defaultTechnician: e.target.value,
                }))
              }
              placeholder="e.g. Shankar Songar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Shop Address
            </label>
            <input
              type="text"
              value={formSettings.address}
              onChange={(e) =>
                setFormSettings((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="Shop No. 12, Main Highway Road..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Default Tyre Pressure (PSI)
            </label>
            <input
              type="number"
              value={formSettings.defaultPressure}
              onChange={(e) =>
                setFormSettings((prev) => ({
                  ...prev,
                  defaultPressure: parseInt(e.target.value) || 35,
                }))
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-amber-400 font-bold font-mono text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </form>

      {/* Database Backup & Restore Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Database Backup & Restore (Offline Safety)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Export all saved customer reports into a JSON backup file or restore database onto another device/phone.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Download Backup */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <HardDriveDownload className="w-4 h-4 text-amber-400" />
              <span>Download Database Backup</span>
            </h4>
            <p className="text-xs text-slate-400">
              Saves all customer history, vehicle readings, and settings to a JSON file.
            </p>
            <button
              type="button"
              onClick={exportBackupJSON}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs border border-slate-700 transition-colors"
            >
              Export JSON Backup File
            </button>
          </div>

          {/* Restore Database */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Restore from Backup</span>
            </h4>
            <p className="text-xs text-slate-400">
              Select a JSON backup file to load past customer reports into this app.
            </p>
            <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-colors flex items-center justify-center cursor-pointer">
              <span>Select Backup JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
