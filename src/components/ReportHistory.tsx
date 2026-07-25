import React, { useState, useMemo } from 'react';
import { TyreReport } from '../types';
import {
  Search,
  Car,
  Calendar,
  Phone,
  User,
  Printer,
  Edit3,
  Trash2,
  Copy,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ReportHistoryProps {
  reports: TyreReport[];
  onSelectReportToPrint: (report: TyreReport) => void;
  onBatchPrint?: (filteredReports: TyreReport[]) => void;
  onEditReport: (report: TyreReport) => void;
  onDuplicateReport: (report: TyreReport) => void;
  onDeleteReport: (id: string) => void;
  onNewReportClick: () => void;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  onSelectReportToPrint,
  onBatchPrint,
  onEditReport,
  onDuplicateReport,
  onDeleteReport,
  onNewReportClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const term = searchTerm.toLowerCase().trim();
      const cleanTerm = term.replace(/[^a-z0-9]/gi, '');

      const matchesVehicle = (r.vehicleNo || '').toLowerCase().includes(term) || (cleanTerm !== '' && (r.vehicleNo || '').toLowerCase().replace(/[^a-z0-9]/gi, '').includes(cleanTerm));
      const matchesName = (r.driverName || '').toLowerCase().includes(term);
      const matchesPhone = (r.mobileNo || '').toLowerCase().includes(term) || (cleanTerm !== '' && (r.mobileNo || '').replace(/[^0-9]/g, '').includes(cleanTerm));
      const matchesReportNo = (r.reportNo || '').toLowerCase().includes(term);
      const matchesModel = (r.model || '').toLowerCase().includes(term);

      const matchesSearch =
        !term ||
        matchesVehicle ||
        matchesName ||
        matchesPhone ||
        matchesReportNo ||
        matchesModel;

      let matchesCondition = true;
      if (conditionFilter === 'ACTION_NEEDED') {
        matchesCondition =
          r.overallCondition === 'Replace Soon' ||
          r.overallCondition === 'Immediate Replacement' ||
          r.overallCondition === 'Average';
      } else if (conditionFilter === 'GOOD') {
        matchesCondition =
          r.overallCondition === 'Excellent' || r.overallCondition === 'Good';
      }

      return matchesSearch && matchesCondition;
    });
  }, [reports, searchTerm, conditionFilter]);

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Good':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Average':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Replace Soon':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Immediate Replacement':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">
              Tyre Check History & Database
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Search past customer records by vehicle number, mobile, driver name, or report ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {filteredReports.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  onBatchPrint
                    ? onBatchPrint(filteredReports)
                    : onSelectReportToPrint(filteredReports[0])
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs sm:text-sm border border-slate-700 shadow-md transition-all flex items-center space-x-2"
                title={`Batch print or export all ${filteredReports.length} filtered reports as a single multi-page PDF`}
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Batch Print Filtered ({filteredReports.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onNewReportClick}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              + Create New Inspection
            </button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Live Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, vehicle plate number, or phone number..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-slate-100 text-sm font-medium focus:outline-none focus:border-amber-500 placeholder-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-0.5 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Condition Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 ml-2 mr-1" />
            <button
              type="button"
              onClick={() => setConditionFilter('ALL')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                conditionFilter === 'ALL'
                  ? 'bg-slate-800 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setConditionFilter('GOOD')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                conditionFilter === 'GOOD'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Good
            </button>
            <button
              type="button"
              onClick={() => setConditionFilter('ACTION_NEEDED')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                conditionFilter === 'ACTION_NEEDED'
                  ? 'bg-slate-800 text-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Attention
            </button>
          </div>
        </div>
      </div>

      {/* Reports List / Cards */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Car className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? `No tyre health checks matching "${searchTerm}". Try a different vehicle number or phone number.`
              : 'Your database is currently empty. Start by creating a new inspection report!'}
          </p>
          <button
            type="button"
            onClick={onNewReportClick}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs inline-block mt-2"
          >
            Create First Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-lg space-y-4"
            >
              {/* Card Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-center">
                    <span className="text-xs font-mono text-slate-400 block uppercase">
                      Vehicle No.
                    </span>
                    <span className="text-base font-black text-amber-400 tracking-wider">
                      {report.vehicleNo || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">
                        {report.model || 'Vehicle Check'}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getConditionBadge(
                          report.overallCondition
                        )}`}
                      >
                        {report.overallCondition}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{report.driverName || 'Walk-in Customer'}</span>
                      </span>
                      {report.mobileNo && (
                        <span className="flex items-center space-x-1 font-mono text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{report.mobileNo}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Report Number & Date */}
                <div className="text-left sm:text-right">
                  <span className="font-mono text-xs font-bold text-slate-400 block">
                    {report.reportNo}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center sm:justify-end space-x-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{report.date}</span>
                  </span>
                </div>
              </div>

              {/* Tyre Tread Depths Snapshot Grid */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center bg-slate-950 border border-slate-800/80 rounded-xl p-2.5">
                {[
                  { pos: 'FR_RH', label: 'FR RH' },
                  { pos: 'FR_LH', label: 'FR LH' },
                  { pos: 'RR_RH', label: 'RR RH' },
                  { pos: 'RR_LH', label: 'RR LH' },
                  { pos: 'STEPNEY', label: 'STEP' },
                ].map(({ pos, label }) => {
                  const t = report.tyres[pos as keyof typeof report.tyres];
                  const depth = parseFloat(t?.treadDepthMm || '0');
                  let colorClass = 'text-emerald-400';
                  if (depth > 0 && depth < 3) colorClass = 'text-rose-400';
                  else if (depth >= 3 && depth < 5) colorClass = 'text-amber-400';

                  return (
                    <div key={pos} className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block">
                        {label}
                      </span>
                      <span className={`text-xs sm:text-sm font-black font-mono ${colorClass}`}>
                        {t?.treadDepthMm ? `${t.treadDepthMm}mm` : '--'}
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        {t?.pressurePsi ? `${t.pressurePsi} PSI` : '35 PSI'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Card Actions Bar */}
              <div className="flex items-center justify-end gap-3 pt-1">
                {/* Card Action Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onSelectReportToPrint(report)}
                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    title="View & Print Official PDF Report"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditReport(report)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
                    title="Edit Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateReport(report)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-all border border-slate-700"
                    title="Copy details to create a new report for this vehicle"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete report ${report.reportNo} (${report.vehicleNo})?`
                        )
                      ) {
                        onDeleteReport(report.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition-all border border-slate-700 hover:border-rose-500/30"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
