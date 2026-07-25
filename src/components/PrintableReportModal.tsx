import React, { useMemo } from 'react';
import { TyreReport, ShopSettings } from '../types';
import { saveReport } from '../utils/storage';
import { Printer, X, Download } from 'lucide-react';
// @ts-ignore - html2pdf.js dynamic library
import html2pdf from 'html2pdf.js';
// @ts-ignore
import shopLogo from '../assets/images/charbhuja_tyre_logo_1784907990309.jpg';

interface PrintableReportModalProps {
  report?: TyreReport | null;
  reportsList?: TyreReport[] | null;
  settings: ShopSettings;
  onClose: () => void;
}

const SingleReportCard: React.FC<{
  report: TyreReport;
  settings: ShopSettings;
  isLast: boolean;
}> = ({ report, settings, isLast }) => {
  return (
    <div
      className={`pdf-report-card bg-white text-black p-4 sm:p-5 max-w-3xl mx-auto border-2 border-black font-sans leading-tight shadow-xl relative ${
        isLast ? '' : 'mb-6 print:mb-0'
      }`}
      style={{
        pageBreakAfter: isLast ? 'auto' : 'always',
        breakAfter: isLast ? 'auto' : 'page',
        pageBreakInside: 'avoid',
        breakInside: 'avoid-page',
      }}
    >
      {/* OFFICIAL LETTERHEAD HEADER */}
      <div className="border-b-[3px] border-black pb-1.5 mb-2.5 flex items-center justify-between">
        {/* Left Logo - Exact C tyre tread & red T emblem image */}
        <div className="flex-shrink-0 mr-3">
          <img
            src={shopLogo}
            alt="Shree Charbhuja Tyre Logo"
            className="w-20 h-20 sm:w-22 sm:h-22 object-contain block bg-white"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Center Shop Title & Contact details matching reference image exactly */}
        <div className="flex-1 text-center -ml-2">
          <h1
            className="text-3xl sm:text-4xl font-bold uppercase tracking-wide leading-none mb-0.5"
            style={{ color: '#ff0000', fontFamily: "'Teko', 'Oswald', sans-serif" }}
          >
            SHREE CHARBHUJA CYCLE MART
          </h1>
          <p
            className="text-base sm:text-lg font-medium tracking-wide leading-tight"
            style={{ color: '#000000', fontFamily: "'Teko', 'Oswald', sans-serif" }}
          >
            Shop No. 4, Ratan Park, Gadital, Hadapsar, Pune - 411 028.
          </p>
          <p
            className="text-base sm:text-lg font-medium tracking-wide leading-tight"
            style={{ color: '#000000', fontFamily: "'Teko', 'Oswald', sans-serif" }}
          >
            Mob.: 9890624682 / 9511648592. Email - shankarsongar@gmail.com
          </p>
        </div>
      </div>

      {/* Document Title Badge */}
      <div className="text-center my-2">
        <span
          className="inline-block px-4 py-1 text-white font-black text-xs uppercase tracking-wider rounded-sm shadow-sm"
          style={{ backgroundColor: '#000000', color: '#ffffff' }}
        >
          TYRE HEALTH CHECK REPORT
        </span>
      </div>

      {/* Customer & Vehicle Details Table */}
      <div className="border-2 border-black mb-2.5 text-xs font-medium">
        <div
          className="font-bold p-1.5 border-b border-black uppercase tracking-wider text-center"
          style={{ backgroundColor: '#e5e7eb', color: '#000000' }}
        >
          CUSTOMER & VEHICLE DETAILS
        </div>
        <div className="grid grid-cols-2 divide-x divide-black">
          <div className="divide-y divide-black">
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Report No.:
              </span>
              <span className="font-mono font-bold text-black" style={{ color: '#000000' }}>
                {report.reportNo}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Date:
              </span>
              <span className="font-bold text-black" style={{ color: '#000000' }}>
                {report.date}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Driver / Customer:
              </span>
              <span className="font-bold text-black" style={{ color: '#000000' }}>
                {report.driverName || 'N/A'}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Mobile No.:
              </span>
              <span className="font-mono font-bold text-black" style={{ color: '#000000' }}>
                {report.mobileNo || 'N/A'}
              </span>
            </div>
          </div>

          <div className="divide-y divide-black">
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Vehicle No.:
              </span>
              <span
                className="font-mono font-black text-black uppercase text-xs sm:text-sm"
                style={{ color: '#000000' }}
              >
                {report.vehicleNo}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Vehicle Model:
              </span>
              <span className="font-bold text-black uppercase" style={{ color: '#000000' }}>
                {report.model || 'N/A'}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Odometer Mileage:
              </span>
              <span className="font-mono font-bold text-black" style={{ color: '#000000' }}>
                {report.mileage ? `${report.mileage} KM` : 'N/A'}
              </span>
            </div>
            <div className="p-1.5 flex justify-between">
              <span className="font-bold text-gray-700" style={{ color: '#374151' }}>
                Technician:
              </span>
              <span className="font-bold text-black" style={{ color: '#000000' }}>
                {report.technicianName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Column Tyre Inspection Grid */}
      <div className="mb-2.5">
        <div
          className="font-bold p-1.5 border-2 border-black border-b-0 uppercase text-xs tracking-wider text-center"
          style={{ backgroundColor: '#e5e7eb', color: '#000000' }}
        >
          TYRE INSPECTION CHECKPOINTS
        </div>
        <table className="w-full text-xs border-2 border-black border-collapse text-center">
          <thead>
            <tr
              className="font-black border-b-2 border-black uppercase"
              style={{ backgroundColor: '#d1d5db', color: '#000000' }}
            >
              <th
                className="p-1.5 text-left border-r border-black w-32"
                style={{ backgroundColor: '#d1d5db', color: '#000000' }}
              >
                Check Point
              </th>
              <th className="p-1.5 border-r border-black">FR RH</th>
              <th className="p-1.5 border-r border-black">FR LH</th>
              <th className="p-1.5 border-r border-black">RR RH</th>
              <th className="p-1.5 border-r border-black">RR LH</th>
              <th className="p-1.5">STEPNEY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black font-semibold">
            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Pressure (PSI)
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.FR_RH?.pressurePsi || 35}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.FR_LH?.pressurePsi || 35}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.RR_RH?.pressurePsi || 35}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.RR_LH?.pressurePsi || 35}
              </td>
              <td className="p-1.5 font-mono font-bold">
                {report.tyres.STEPNEY?.pressurePsi || 35}
              </td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Tread Depth (mm)
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.FR_RH?.treadDepthMm || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.FR_LH?.treadDepthMm || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.RR_RH?.treadDepthMm || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono font-bold">
                {report.tyres.RR_LH?.treadDepthMm || '-'}
              </td>
              <td className="p-1.5 font-mono font-bold">
                {report.tyres.STEPNEY?.treadDepthMm || '-'}
              </td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Uneven Wear
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_RH?.unevenWear === 'OK' ? 'OK' : 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_LH?.unevenWear === 'OK' ? 'OK' : 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_RH?.unevenWear === 'OK' ? 'OK' : 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_LH?.unevenWear === 'OK' ? 'OK' : 'NO'}
              </td>
              <td className="p-1.5">
                {report.tyres.STEPNEY?.unevenWear === 'OK' ? 'OK' : 'NO'}
              </td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Shape Out / Belt Out
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_RH?.shapeOut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_LH?.shapeOut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_RH?.shapeOut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_LH?.shapeOut || 'NO'}
              </td>
              <td className="p-1.5">{report.tyres.STEPNEY?.shapeOut || 'NO'}</td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Crack / Cut
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_RH?.crackCut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.FR_LH?.crackCut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_RH?.crackCut || 'NO'}
              </td>
              <td className="p-1.5 border-r border-black">
                {report.tyres.RR_LH?.crackCut || 'NO'}
              </td>
              <td className="p-1.5">{report.tyres.STEPNEY?.crackCut || 'NO'}</td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Tyre Brand
              </td>
              <td className="p-1.5 border-r border-black uppercase font-bold">
                {report.tyres.FR_RH?.brand || '-'}
              </td>
              <td className="p-1.5 border-r border-black uppercase font-bold">
                {report.tyres.FR_LH?.brand || '-'}
              </td>
              <td className="p-1.5 border-r border-black uppercase font-bold">
                {report.tyres.RR_RH?.brand || '-'}
              </td>
              <td className="p-1.5 border-r border-black uppercase font-bold">
                {report.tyres.RR_LH?.brand || '-'}
              </td>
              <td className="p-1.5 uppercase font-bold">
                {report.tyres.STEPNEY?.brand || '-'}
              </td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Mfg Code
              </td>
              <td className="p-1.5 border-r border-black font-mono">
                {report.tyres.FR_RH?.mfgCode || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono">
                {report.tyres.FR_LH?.mfgCode || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono">
                {report.tyres.RR_RH?.mfgCode || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono">
                {report.tyres.RR_LH?.mfgCode || '-'}
              </td>
              <td className="p-1.5 font-mono">{report.tyres.STEPNEY?.mfgCode || '-'}</td>
            </tr>

            <tr>
              <td
                className="p-1.5 text-left font-bold border-r border-black"
                style={{ backgroundColor: '#f3f4f6', color: '#000000' }}
              >
                Mfg Month / Year
              </td>
              <td className="p-1.5 border-r border-black font-mono uppercase">
                {report.tyres.FR_RH?.mfgDate || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono uppercase">
                {report.tyres.FR_LH?.mfgDate || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono uppercase">
                {report.tyres.RR_RH?.mfgDate || '-'}
              </td>
              <td className="p-1.5 border-r border-black font-mono uppercase">
                {report.tyres.RR_LH?.mfgDate || '-'}
              </td>
              <td className="p-1.5 font-mono uppercase">
                {report.tyres.STEPNEY?.mfgDate || '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Overall Condition Section */}
      <div className="text-xs mb-2.5">
        <div className="border-2 border-black p-2">
          <div
            className="font-bold border-b border-black pb-1 mb-1.5 uppercase text-center"
            style={{ backgroundColor: '#e5e7eb', color: '#000000' }}
          >
            OVERALL CONDITION
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 font-semibold text-center">
            {[
              'Excellent',
              'Good',
              'Average',
              'Replace Soon',
              'Immediate Replacement',
            ].map((cond) => {
              const isMatch = report.overallCondition === cond;
              return (
                <div key={cond} className="flex items-center justify-center space-x-1">
                  <span className="font-bold">{isMatch ? '☑' : '☐'}</span>
                  <span className={isMatch ? 'font-black underline' : ''}>
                    {cond}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FOOTER METADATA BLOCK */}
      <div
        className="mt-3 pt-2 border-t border-black flex justify-between items-end text-xs font-bold"
        style={{ color: '#000000' }}
      >
        <div>
          <p style={{ color: '#374151' }}>
            Date: <span style={{ color: '#000000' }}>{report.date}</span>
          </p>
          <p style={{ color: '#374151' }}>
            Report No: <span style={{ color: '#000000' }}>{report.reportNo}</span>
          </p>
        </div>
        <div className="text-right flex flex-col items-end justify-end">
          {/* Rubber Shop Stamp Box */}
          <div
            className="inline-block border-2 border-double rounded-sm p-1.5 px-2.5 text-center transform -rotate-2 select-none"
            style={{
              borderColor: '#6b21a8',
              color: '#6b21a8',
              backgroundColor: 'rgba(243, 232, 255, 0.3)',
              boxShadow: '0 0 0 1px #6b21a8 inset',
              fontFamily: 'monospace, sans-serif'
            }}
          >
            <p className="font-black text-xs uppercase tracking-wider leading-tight">
              SHREE CHARBHUJA CYCLE MART
            </p>
            <p className="font-bold text-[10px] leading-tight mt-0.5">
              Shop No 4 Ratan Park, Gadital Hadapsar, Pune 411028.
            </p>
            <div className="mt-1.5 pt-0.5 border-t border-dashed border-[#6b21a8] flex justify-between items-center text-[8px] font-extrabold uppercase tracking-widest gap-2">
              <span>★ OFFICIAL STAMP ★</span>
              <span>AUTH. SIGNATORY</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BRAND LOGOS & TREAD GRAPHIC */}
      <div
        className="mt-3 border-t-2 border-black relative overflow-hidden rounded-b-sm"
        style={{ backgroundColor: '#dcfce7' }}
      >
        <div
          className="flex flex-wrap items-center justify-between text-[10px] font-black tracking-tight gap-2 py-1.5 px-2.5 border-b border-black"
          style={{ color: '#000000', backgroundColor: '#dcfce7' }}
        >
          {/* Apollo */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black" style={{ color: '#6b21a8' }}>
              apollo{' '}
              <span className="text-[9px] font-medium" style={{ color: '#a855f7' }}>
                TYRES
              </span>
            </span>
            <span className="text-[7px] font-normal" style={{ color: '#374151' }}>
              ... go the distance
            </span>
          </div>

          {/* JK Tyre */}
          <div className="flex flex-col items-center">
            <span
              className="text-xs font-black tracking-tighter"
              style={{ color: '#000000' }}
            >
              JKTYRE
            </span>
            <span
              className="text-[7px] tracking-widest font-bold"
              style={{ color: '#dc2626' }}
            >
              TOTAL CONTROL
            </span>
          </div>

          {/* Bridgestone */}
          <div className="flex items-center space-x-0.5">
            <span className="font-black text-xs" style={{ color: '#dc2626' }}>
              B
            </span>
            <span
              className="text-[10px] font-black italic tracking-tighter"
              style={{ color: '#000000' }}
            >
              BRIDGESTONE
            </span>
          </div>

          {/* Michelin */}
          <div
            className="px-1.5 py-0.5 rounded text-[10px] font-black tracking-wider flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: '#0284c7', color: '#ffffff' }}
          >
            <span>MICHELIN</span>
          </div>

          {/* Yokohama */}
          <div
            className="flex items-center font-black text-[9px] px-1 py-0.5 rounded text-white"
            style={{ backgroundColor: '#000000' }}
          >
            <span className="mr-0.5 text-[8px]" style={{ color: '#dc2626' }}>
              ▶
            </span>
            <span>YOKOHAMA</span>
          </div>

          {/* Ultramile */}
          <div
            className="border px-1 py-0.5 text-[8px] font-bold tracking-tighter bg-white"
            style={{ borderColor: '#000000', color: '#000000' }}
          >
            - ULTRAMILE -
          </div>
        </div>

        {/* Bottom Right Red Tire Tread Graphic Accent */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-30">
          <svg width="120" height="40" viewBox="0 0 140 50">
            <path
              d="M 20 50 L 50 0 L 70 0 L 40 50 Z M 50 50 L 80 0 L 100 0 L 70 50 Z M 80 50 L 110 0 L 130 0 L 100 50 Z"
              fill="#dc2626"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  report,
  reportsList,
  settings,
  onClose,
}) => {
  const activeReports: TyreReport[] = useMemo(() => {
    if (reportsList && reportsList.length > 0) return reportsList;
    if (report) return [report];
    return [];
  }, [report, reportsList]);

  if (activeReports.length === 0) return null;

  const handleDownloadLocalFile = async () => {
    activeReports.forEach((r) => saveReport(r));

    const exportWrapper = document.getElementById('pdf-export-wrapper');
    if (!exportWrapper) return;

    const filename =
      activeReports.length === 1
        ? `Tyre_Health_Report_${activeReports[0].reportNo}_${
            activeReports[0].vehicleNo || 'Vehicle'
          }.pdf`
        : `Tyre_Health_Reports_Batch_${activeReports.length}_Items.pdf`;

    const opt = {
      margin: [0.15, 0.15, 0.15, 0.15] as [number, number, number, number],
      filename,
      image: { type: 'jpeg' as const, quality: 0.98 },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc: Document) => {
          const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
          styleTags.forEach((style) => {
            if (style.textContent && style.textContent.includes('oklch')) {
              style.textContent = style.textContent.replace(
                /oklch\([^)]+\)/g,
                'transparent'
              );
            }
          });

          const clonedWrapper = clonedDoc.getElementById('pdf-export-wrapper');
          if (clonedWrapper) {
            clonedWrapper.style.backgroundColor = '#ffffff';
            clonedWrapper.style.color = '#000000';
            clonedWrapper.style.padding = '0px';
            clonedWrapper.style.margin = '0 auto';
            clonedWrapper.style.width = '750px';

            const cards = clonedWrapper.querySelectorAll('.pdf-report-card');
            cards.forEach((card, idx) => {
              const cardEl = card as HTMLElement;
              cardEl.style.boxShadow = 'none';
              cardEl.style.margin = idx === cards.length - 1 ? '0' : '0 0 10px 0';
              cardEl.style.padding = '16px';
              cardEl.style.width = '100%';
              cardEl.style.maxWidth = '100%';
              cardEl.style.backgroundColor = '#ffffff';
              cardEl.style.color = '#000000';
              cardEl.style.boxSizing = 'border-box';
              cardEl.style.pageBreakInside = 'avoid';
              cardEl.style.breakInside = 'avoid-page';
            });
          }
        },
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const },
    };

    try {
      await html2pdf().set(opt).from(exportWrapper).save();
    } catch (err) {
      console.error('PDF export fallback:', err);
      window.print();
    }
  };

  const handleTriggerPrint = () => {
    activeReports.forEach((r) => saveReport(r));
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Modal Dialog Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Controls Bar (Hidden during print) */}
        <div className="no-print p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Printer className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {activeReports.length === 1
                  ? 'Official Tyre Health Check Certificate'
                  : `Batch Tyre Health Check Reports (${activeReports.length} Reports)`}
              </h3>
              <p className="text-xs text-slate-400">
                {activeReports.length === 1 ? (
                  <>
                    Report No:{' '}
                    <span className="font-mono text-amber-400">
                      {activeReports[0].reportNo}
                    </span>
                  </>
                ) : (
                  <span>Exporting/Printing multi-page PDF document</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadLocalFile}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs sm:text-sm flex items-center space-x-1.5 border border-slate-700 transition-all"
              title="Save report PDF file directly to your device downloads"
            >
              <Download className="w-4 h-4" />
              <span>SAVE PDF</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerPrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center space-x-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / SAVE PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT AREA */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-950 text-slate-100 print-container">
          <div id="pdf-export-wrapper" className="bg-white p-2 sm:p-4 rounded-sm text-black max-w-3xl mx-auto">
            {activeReports.map((reportItem, idx) => (
              <SingleReportCard
                key={reportItem.id || `rep-${idx}`}
                report={reportItem}
                settings={settings}
                isLast={idx === activeReports.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

