import React from 'react';
import { TyreReport, ShopSettings, TyreCheck } from '../types';
import { BarChart3, Car, AlertTriangle, CheckCircle2, Shield, Wrench, Calendar, HardDriveDownload } from 'lucide-react';
import { exportBackupJSON } from '../utils/storage';

interface StatsDashboardProps {
  reports: TyreReport[];
  settings: ShopSettings;
  onNewReportClick: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  reports,
  settings,
  onNewReportClick,
}) => {
  const totalInspections = reports.length;

  const replaceSoonCount = reports.filter(
    (r) =>
      r.overallCondition === 'Replace Soon' ||
      r.overallCondition === 'Immediate Replacement'
  ).length;

  const alignmentRecommendedCount = reports.filter((r) =>
    r.recommendedWork?.includes('Wheel Alignment')
  ).length;

  const brandCounts: Record<string, number> = {};
  reports.forEach((r) => {
    (Object.values(r.tyres) as TyreCheck[]).forEach((t) => {
      if (t.brand) {
        const b = t.brand.toUpperCase().trim();
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      }
    });
  });

  const sortedBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Inspections */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Checks Saved
            </span>
            <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">
              {totalInspections}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Saved in local database
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Car className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Replacement Needed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Tyres Needing Replace
            </span>
            <span className="text-3xl font-black text-rose-400 font-mono mt-1 block">
              {replaceSoonCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Replace Soon or Immediate
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Alignment Recommended */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Wheel Alignment Due
            </span>
            <span className="text-3xl font-black text-blue-400 font-mono mt-1 block">
              {alignmentRecommendedCount}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Alignment service needed
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Database Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Database Status
            </span>
            <span className="text-lg font-black text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>Offline Active</span>
            </span>
            <button
              onClick={exportBackupJSON}
              className="text-[11px] text-amber-400 hover:underline mt-1 inline-flex items-center space-x-1"
            >
              <HardDriveDownload className="w-3 h-3" />
              <span>Backup JSON</span>
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Brands Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Inspected Brands */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span>Top Tyre Brands Inspected</span>
          </h3>

          <div className="space-y-3">
            {sortedBrands.length === 0 ? (
              <p className="text-xs text-slate-500">No brand data recorded yet.</p>
            ) : (
              sortedBrands.map(([brand, count]) => {
                const totalTyresCount = totalInspections * 5 || 1;
                const percentage = Math.round((count / totalTyresCount) * 100);

                return (
                  <div key={brand} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>{brand}</span>
                      <span className="font-mono text-amber-400">
                        {count} tyres ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                        style={{ width: `${Math.min(100, percentage * 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Shop Profile */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>Shop Info & Quick Actions</span>
          </h3>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <p className="font-black text-amber-400 text-sm uppercase">
              {settings.shopName}
            </p>
            <p className="text-slate-300 font-medium">{settings.tagline}</p>
            <p className="text-slate-400">{settings.address}</p>
            <p className="text-slate-400 font-mono">Mobile: {settings.mobileNo}</p>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onNewReportClick}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all text-center"
            >
              + New Inspection
            </button>
            <button
              type="button"
              onClick={exportBackupJSON}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 flex items-center space-x-1.5"
            >
              <HardDriveDownload className="w-4 h-4 text-slate-400" />
              <span>Export DB</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
