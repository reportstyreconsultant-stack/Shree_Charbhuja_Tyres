import React, { useState, useEffect } from 'react';
import {
  TyreReport,
  ShopSettings,
  TyrePosition,
  TyreCheck,
  OverallCondition,
} from '../types';
import {
  calculateAutoCondition,
  saveReport,
  generateReportNumber,
  getReports,
} from '../utils/storage';
import {
  Save,
  Printer,
  RotateCcw,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Car,
  User,
  Phone,
  Calendar,
  Sparkles,
  Search,
} from 'lucide-react';

interface TyreReportFormProps {
  initialReport: TyreReport;
  settings: ShopSettings;
  onSaveSuccess: (savedReport: TyreReport) => void;
  onPrintReport: (report: TyreReport) => void;
  onReset: () => void;
}

const POSITIONS: { key: TyrePosition; label: string; subLabel: string }[] = [
  { key: 'FR_RH', label: 'FR RH', subLabel: 'Front Right' },
  { key: 'FR_LH', label: 'FR LH', subLabel: 'Front Left' },
  { key: 'RR_RH', label: 'RR RH', subLabel: 'Rear Right' },
  { key: 'RR_LH', label: 'RR LH', subLabel: 'Rear Left' },
  { key: 'STEPNEY', label: 'STEPNEY', subLabel: 'Spare Tyre' },
];

const RECOMMENDED_WORK_OPTIONS = [
  'Wheel Alignment',
  'Wheel Balancing',
  'Tyre Rotation',
  'Nitrogen Refill',
  'Tyre Replacement',
  'Puncture Repair',
];

const COMMON_BRANDS = ['MRF', 'APOLLO', 'CEAT', 'GOODYEAR', 'BRIDGESTONE', 'MICHELIN', 'JK TYRE'];

export const TyreReportForm: React.FC<TyreReportFormProps> = ({
  initialReport,
  settings,
  onSaveSuccess,
  onPrintReport,
  onReset,
}) => {
  const [report, setReport] = useState<TyreReport>(initialReport);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isVehicleSearching, setIsVehicleSearching] = useState(false);

  useEffect(() => {
    setReport(initialReport);
  }, [initialReport]);

  const handleCustomerChange = (field: keyof TyreReport, value: any) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleTyreChange = (
    position: TyrePosition,
    field: keyof TyreCheck,
    value: any
  ) => {
    setReport((prev) => ({
      ...prev,
      tyres: {
        ...prev.tyres,
        [position]: {
          ...prev.tyres[position],
          [field]: value,
        },
      },
    }));
  };

  const handleResetAllPressure = (psi = 35) => {
    setReport((prev) => {
      const updatedTyres = { ...prev.tyres };
      POSITIONS.forEach(({ key }) => {
        updatedTyres[key] = { ...updatedTyres[key], pressurePsi: psi };
      });
      return { ...prev, tyres: updatedTyres };
    });
  };

  const handleToggleRecommendedWork = (work: string) => {
    setReport((prev) => {
      const current = prev.recommendedWork || [];
      const exists = current.includes(work);
      const updated = exists
        ? current.filter((item) => item !== work)
        : [...current, work];
      return { ...prev, recommendedWork: updated };
    });
  };

  const handleAutoAssess = () => {
    const autoCondition = calculateAutoCondition(report);
    setReport((prev) => ({ ...prev, overallCondition: autoCondition }));
  };

  const handleLookupVehicle = () => {
    if (!report.vehicleNo.trim()) return;
    setIsVehicleSearching(true);
    const reports = getReports();
    const existing = reports.find(
      (r) =>
        r.vehicleNo.toLowerCase().replace(/\s+/g, '') ===
        report.vehicleNo.toLowerCase().replace(/\s+/g, '')
    );

    if (existing) {
      setReport((prev) => ({
        ...prev,
        driverName: existing.driverName || prev.driverName,
        mobileNo: existing.mobileNo || prev.mobileNo,
        model: existing.model || prev.model,
        tyres: { ...existing.tyres },
        remarks: `Autofilled from last check on ${existing.date} (${existing.reportNo})`,
      }));
      setSaveToast(`Found existing history for vehicle ${existing.vehicleNo}!`);
    } else {
      setSaveToast(`No past records found for ${report.vehicleNo}. Ready for new report.`);
    }
    setTimeout(() => {
      setSaveToast(null);
      setIsVehicleSearching(false);
    }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.vehicleNo.trim()) {
      alert('Please enter a Vehicle Number.');
      return;
    }
    const saved = saveReport(report);
    setSaveToast(`Report ${saved.reportNo} saved successfully!`);
    onSaveSuccess(saved);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handlePrintAndSave = () => {
    if (!report.vehicleNo.trim()) {
      alert('Please enter a Vehicle Number.');
      return;
    }
    const saved = saveReport(report);
    setSaveToast(`Report ${saved.reportNo} saved to system & opening print!`);
    onSaveSuccess(saved);
    onPrintReport(saved);
    setTimeout(() => setSaveToast(null), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-xl font-bold shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header Bar with Action Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-bold text-sm rounded-lg">
              {report.reportNo || generateReportNumber()}
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {report.id ? 'Editing Existing Record' : 'New Health Check'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Tyre Health Inspection Entry
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
            title="Clear Form"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            type="button"
            onClick={handlePrintAndSave}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-colors border border-blue-500/30"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>SAVE REPORT</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CUSTOMER & VEHICLE DETAILS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center space-x-2">
          <Car className="w-4 h-4" />
          <span>1. Customer & Vehicle Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Inspection Date</span>
            </label>
            <input
              type="date"
              value={report.date}
              onChange={(e) => handleCustomerChange('date', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm font-medium focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Vehicle No */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>Vehicle No.*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={report.vehicleNo}
                onChange={(e) =>
                  handleCustomerChange('vehicleNo', e.target.value.toUpperCase())
                }
                placeholder="e.g. MH 12 QA 8821"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-amber-400 text-sm font-bold tracking-wider uppercase focus:outline-none focus:border-amber-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={handleLookupVehicle}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-amber-400"
                title="Lookup previous history for this vehicle number"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Vehicle Model
            </label>
            <input
              type="text"
              value={report.model}
              onChange={(e) => handleCustomerChange('model', e.target.value)}
              placeholder="e.g. SWIFT DZIRE / INNOVA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Driver / Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
              <User className="w-3.5 h-3.5" />
              <span>Driver / Customer Name</span>
            </label>
            <input
              type="text"
              value={report.driverName}
              onChange={(e) => handleCustomerChange('driverName', e.target.value)}
              placeholder="e.g. FM E-MOBILITY LTD"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Mobile No */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile No.</span>
            </label>
            <input
              type="tel"
              value={report.mobileNo}
              onChange={(e) => handleCustomerChange('mobileNo', e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Odometer Mileage */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Current Mileage (KM)
            </label>
            <input
              type="text"
              value={report.mileage}
              onChange={(e) => handleCustomerChange('mileage', e.target.value)}
              placeholder="e.g. 42500"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Technician Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Technician Name</span>
            </label>
            <input
              type="text"
              value={report.technicianName}
              onChange={(e) => handleCustomerChange('technicianName', e.target.value)}
              placeholder="e.g. Shankar Songar"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: TYRE INSPECTION MATRIX */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <Gauge className="w-4 h-4" />
            <span>2. Tyre Inspection Check (5 Tyres)</span>
          </h3>

          {/* Default 35 PSI Helper Button */}
          <button
            type="button"
            onClick={() => handleResetAllPressure(35)}
            className="self-start sm:self-auto px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <span>Set All Pressures to 35 PSI</span>
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                <th className="p-3 w-36">Check Point</th>
                {POSITIONS.map(({ key, label, subLabel }) => (
                  <th key={key} className="p-3 text-center border-l border-slate-800">
                    <div className="font-black text-amber-400 text-sm">{label}</div>
                    <div className="text-[10px] text-slate-500 font-sans font-normal">{subLabel}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Pressure (PSI) */}
              <tr className="bg-slate-900/50">
                <td className="p-3 font-semibold text-slate-200">
                  Pressure (PSI)
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800">
                    <input
                      type="number"
                      value={report.tyres[key].pressurePsi}
                      onChange={(e) =>
                        handleTyreChange(key, 'pressurePsi', parseFloat(e.target.value) || 0)
                      }
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-amber-400 font-bold font-mono text-sm focus:border-amber-500"
                    />
                  </td>
                ))}
              </tr>

              {/* Tread Depth (mm) */}
              <tr>
                <td className="p-3 font-semibold text-slate-200">
                  Tread Depth (mm)
                </td>
                {POSITIONS.map(({ key }) => {
                  const depth = parseFloat(report.tyres[key].treadDepthMm || '0');
                  let depthClass = 'text-emerald-400';
                  if (depth > 0 && depth < 3) depthClass = 'text-rose-400 font-bold';
                  else if (depth >= 3 && depth < 5) depthClass = 'text-amber-400 font-bold';

                  return (
                    <td key={key} className="p-2 border-l border-slate-800">
                      <input
                        type="text"
                        value={report.tyres[key].treadDepthMm}
                        onChange={(e) =>
                          handleTyreChange(key, 'treadDepthMm', e.target.value)
                        }
                        placeholder="e.g. 6.7"
                        className={`w-full text-center bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 font-mono text-sm focus:border-amber-500 ${depthClass}`}
                      />
                    </td>
                  );
                })}
              </tr>

              {/* Uneven Wear */}
              <tr className="bg-slate-900/50">
                <td className="p-3 font-semibold text-slate-200">
                  Uneven Wear
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800 text-center">
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'unevenWear', 'OK')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].unevenWear === 'OK'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'unevenWear', 'NEED ATTENTION')}
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].unevenWear === 'NEED ATTENTION'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        NO
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Shape Out / Belt Out */}
              <tr>
                <td className="p-3 font-semibold text-slate-200">
                  Shape / Belt Out
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800 text-center">
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'shapeOut', 'NO')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].shapeOut === 'NO'
                            ? 'bg-slate-800 text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        NO
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'shapeOut', 'YES')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].shapeOut === 'YES'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'text-slate-500'
                        }`}
                      >
                        YES
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Crack / Cut */}
              <tr className="bg-slate-900/50">
                <td className="p-3 font-semibold text-slate-200">
                  Crack / Cut
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800 text-center">
                    <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'crackCut', 'NO')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].crackCut === 'NO'
                            ? 'bg-slate-800 text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        NO
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTyreChange(key, 'crackCut', 'YES')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          report.tyres[key].crackCut === 'YES'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'text-slate-500'
                        }`}
                      >
                        YES
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Tyre Brand */}
              <tr>
                <td className="p-3 font-semibold text-slate-200">
                  Tyre Brand
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800">
                    <input
                      type="text"
                      list={`brands-${key}`}
                      value={report.tyres[key].brand}
                      onChange={(e) =>
                        handleTyreChange(key, 'brand', e.target.value.toUpperCase())
                      }
                      placeholder="MRF / APOLLO"
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-slate-200 uppercase font-semibold text-xs focus:border-amber-500"
                    />
                    <datalist id={`brands-${key}`}>
                      {COMMON_BRANDS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </td>
                ))}
              </tr>

              {/* Mfg Code */}
              <tr className="bg-slate-900/50">
                <td className="p-3 font-semibold text-slate-200">
                  Mfg Code / Week Year
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800">
                    <input
                      type="text"
                      value={report.tyres[key].mfgCode}
                      onChange={(e) =>
                        handleTyreChange(key, 'mfgCode', e.target.value)
                      }
                      placeholder="e.g. 5225"
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-slate-300 font-mono text-xs focus:border-amber-500"
                    />
                  </td>
                ))}
              </tr>

              {/* Mfg Date */}
              <tr>
                <td className="p-3 font-semibold text-slate-200">
                  Mfg Month / Year
                </td>
                {POSITIONS.map(({ key }) => (
                  <td key={key} className="p-2 border-l border-slate-800">
                    <input
                      type="text"
                      value={report.tyres[key].mfgDate}
                      onChange={(e) =>
                        handleTyreChange(key, 'mfgDate', e.target.value.toUpperCase())
                      }
                      placeholder="e.g. DEC-25"
                      className="w-full text-center bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-2 text-slate-300 font-mono text-xs focus:border-amber-500"
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Responsive Cards View */}
        <div className="lg:hidden space-y-4">
          {POSITIONS.map(({ key, label, subLabel }) => (
            <div
              key={key}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="font-black text-amber-400 text-base">{label}</span>
                  <span className="text-xs text-slate-400 ml-2">({subLabel})</span>
                </div>
                <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400">PSI:</span>
                  <input
                    type="number"
                    value={report.tyres[key].pressurePsi}
                    onChange={(e) =>
                      handleTyreChange(key, 'pressurePsi', parseFloat(e.target.value) || 0)
                    }
                    className="w-12 text-center bg-transparent text-amber-400 font-bold text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Tread Depth (mm)</label>
                  <input
                    type="text"
                    value={report.tyres[key].treadDepthMm}
                    onChange={(e) =>
                      handleTyreChange(key, 'treadDepthMm', e.target.value)
                    }
                    placeholder="e.g. 6.7"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Tyre Brand</label>
                  <input
                    type="text"
                    value={report.tyres[key].brand}
                    onChange={(e) =>
                      handleTyreChange(key, 'brand', e.target.value.toUpperCase())
                    }
                    placeholder="MRF / APOLLO"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 uppercase font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Uneven Wear</label>
                  <select
                    value={report.tyres[key].unevenWear}
                    onChange={(e) => handleTyreChange(key, 'unevenWear', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-semibold"
                  >
                    <option value="OK">OK</option>
                    <option value="NEED ATTENTION">NO (Need Attention)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Crack / Cut</label>
                  <select
                    value={report.tyres[key].crackCut}
                    onChange={(e) => handleTyreChange(key, 'crackCut', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-semibold"
                  >
                    <option value="NO">NO (No Cuts)</option>
                    <option value="YES">YES (Has Cut)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Shape Out</label>
                  <select
                    value={report.tyres[key].shapeOut}
                    onChange={(e) => handleTyreChange(key, 'shapeOut', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 font-semibold"
                  >
                    <option value="NO">NO</option>
                    <option value="YES">YES</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Mfg Code / Month</label>
                  <input
                    type="text"
                    value={report.tyres[key].mfgDate}
                    onChange={(e) =>
                      handleTyreChange(key, 'mfgDate', e.target.value.toUpperCase())
                    }
                    placeholder="DEC-25"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: OVERALL CONDITION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>3. Overall Tyre Condition</span>
          </h3>
          <button
            type="button"
            onClick={handleAutoAssess}
            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Rating</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {(
            [
              { level: 'Excellent', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
              { level: 'Good', color: 'border-blue-500/40 bg-blue-500/10 text-blue-400' },
              { level: 'Average', color: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
              { level: 'Replace Soon', color: 'border-orange-500/40 bg-orange-500/10 text-orange-400' },
              { level: 'Immediate Replacement', color: 'border-rose-500/40 bg-rose-500/10 text-rose-400' },
            ] as const
          ).map(({ level, color }) => {
            const isSelected = report.overallCondition === level;
            return (
              <button
                type="button"
                key={level}
                onClick={() => handleCustomerChange('overallCondition', level)}
                className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? `${color} ring-2 ring-amber-400/30 shadow-md`
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{level}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Save Button for Mobile */}
      <div className="lg:hidden sticky bottom-4 z-30">
        <button
          type="submit"
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-base shadow-2xl shadow-amber-500/30 flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5 stroke-[2.5]" />
          <span>SAVE TYRE REPORT</span>
        </button>
      </div>
    </form>
  );
};
