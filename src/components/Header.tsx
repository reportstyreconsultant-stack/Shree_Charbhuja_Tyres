import React from 'react';
import { ViewTab, ShopSettings } from '../types';
import { Shield, PlusCircle, Search, BarChart3, Settings, Database, HardDriveDownload } from 'lucide-react';
import { exportBackupJSON } from '../utils/storage';

interface HeaderProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  reportCount: number;
  settings: ShopSettings;
  onNewReportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  reportCount,
  settings,
  onNewReportClick,
}) => {
  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Brand & Shop Title */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  {settings.shopName}
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {settings.tagline || 'Tyre Inspection & Customer Care System'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 self-end md:self-auto">
            <button
              type="button"
              onClick={exportBackupJSON}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Download local database backup"
            >
              <HardDriveDownload className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Backup DB</span>
            </button>

            <button
              type="button"
              onClick={onNewReportClick}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>New Report</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-2 pb-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('new_report')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'new_report'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & History</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 text-[11px] rounded-full font-mono">
              {reportCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings / DB</span>
          </button>
        </div>
      </div>
    </header>
  );
};
