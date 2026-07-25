import React, { useState, useEffect } from 'react';
import { TyreReport, ShopSettings, ViewTab } from './types';
import {
  getShopSettings,
  getReports,
  createBlankReport,
  deleteReport,
  generateReportNumber,
} from './utils/storage';
import { Header } from './components/Header';
import { TyreReportForm } from './components/TyreReportForm';
import { ReportHistory } from './components/ReportHistory';
import { StatsDashboard } from './components/StatsDashboard';
import { BackupSettingsModal } from './components/BackupSettingsModal';
import { PrintableReportModal } from './components/PrintableReportModal';

export default function App() {
  const [settings, setSettings] = useState<ShopSettings>(() => getShopSettings());
  const [reports, setReports] = useState<TyreReport[]>(() => getReports());
  const [activeTab, setActiveTab] = useState<ViewTab>('new_report');
  
  const [currentReport, setCurrentReport] = useState<TyreReport>(() =>
    createBlankReport(settings)
  );

  const [printModalReport, setPrintModalReport] = useState<TyreReport | null>(null);
  const [batchReportsToPrint, setBatchReportsToPrint] = useState<TyreReport[] | null>(null);

  // Reload reports when storage updates
  const refreshReports = () => {
    setReports(getReports());
  };

  const handleNewReportClick = () => {
    const blank = createBlankReport(settings);
    setCurrentReport(blank);
    setActiveTab('new_report');
  };

  const handleSaveSuccess = (savedReport: TyreReport) => {
    refreshReports();
    setCurrentReport(savedReport);
    setBatchReportsToPrint(null);
    setPrintModalReport(savedReport);
  };

  const handleEditReport = (reportToEdit: TyreReport) => {
    setCurrentReport(reportToEdit);
    setActiveTab('new_report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateReport = (reportToDuplicate: TyreReport) => {
    const newReport: TyreReport = {
      ...reportToDuplicate,
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      reportNo: generateReportNumber(),
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentReport(newReport);
    setActiveTab('new_report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteReport = (id: string) => {
    deleteReport(id);
    refreshReports();
  };

  const handlePrintReport = (report: TyreReport) => {
    setBatchReportsToPrint(null);
    setPrintModalReport(report);
  };

  const handleBatchPrintReports = (reportsToPrint: TyreReport[]) => {
    setPrintModalReport(null);
    setBatchReportsToPrint(reportsToPrint);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Application Navigation & Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reportCount={reports.length}
        settings={settings}
        onNewReportClick={handleNewReportClick}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'new_report' && (
          <TyreReportForm
            initialReport={currentReport}
            settings={settings}
            onSaveSuccess={handleSaveSuccess}
            onPrintReport={handlePrintReport}
            onReset={handleNewReportClick}
          />
        )}

        {activeTab === 'history' && (
          <ReportHistory
            reports={reports}
            onSelectReportToPrint={handlePrintReport}
            onBatchPrint={handleBatchPrintReports}
            onEditReport={handleEditReport}
            onDuplicateReport={handleDuplicateReport}
            onDeleteReport={handleDeleteReport}
            onNewReportClick={handleNewReportClick}
          />
        )}

        {activeTab === 'dashboard' && (
          <StatsDashboard
            reports={reports}
            settings={settings}
            onNewReportClick={handleNewReportClick}
          />
        )}

        {activeTab === 'settings' && (
          <BackupSettingsModal
            settings={settings}
            onSettingsSaved={(updated) => setSettings(updated)}
            onDataImported={refreshReports}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>
          {settings.shopName} — Tyre Health Check Software v1.0 | Offline Storage & Database
        </p>
      </footer>

      {/* Printable Report Modal */}
      <PrintableReportModal
        report={printModalReport}
        reportsList={batchReportsToPrint}
        settings={settings}
        onClose={() => {
          setPrintModalReport(null);
          setBatchReportsToPrint(null);
        }}
      />
    </div>
  );
}
