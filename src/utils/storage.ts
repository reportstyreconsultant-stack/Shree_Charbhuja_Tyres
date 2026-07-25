import { TyreReport, ShopSettings, TyreCheck, TyrePosition } from '../types';
import { DEFAULT_SHOP_SETTINGS, INITIAL_SAMPLE_REPORTS } from '../data/sampleData';

const REPORTS_KEY = 'tyre_health_reports_v1';
const SETTINGS_KEY = 'tyre_shop_settings_v1';

export function getShopSettings(): ShopSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.defaultTechnician === 'Shankarlal Songar') {
        parsed.defaultTechnician = 'Shankar Songar';
      }
      return { ...DEFAULT_SHOP_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load shop settings:', e);
  }
  return DEFAULT_SHOP_SETTINGS;
}

export function saveShopSettings(settings: ShopSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save shop settings:', e);
  }
}

export function getReports(): TyreReport[] {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    if (data) {
      const parsed: TyreReport[] = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = parsed.map((r) => ({
          ...r,
          technicianName:
            r.technicianName === 'Shankarlal Songar'
              ? 'Shankar Songar'
              : r.technicianName,
        }));
        return cleaned.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
  } catch (e) {
    console.error('Failed to load reports:', e);
  }
  // Initialize with sample data if empty
  saveReports(INITIAL_SAMPLE_REPORTS);
  return INITIAL_SAMPLE_REPORTS;
}

export function saveReports(reports: TyreReport[]): void {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports:', e);
  }
}

export function saveReport(report: TyreReport): TyreReport {
  const current = getReports();
  const existingIndex = current.findIndex((r) => r.id === report.id);
  let updatedReports: TyreReport[];

  const updatedReport: TyreReport = {
    ...report,
    updatedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    updatedReports = [...current];
    updatedReports[existingIndex] = updatedReport;
  } else {
    updatedReports = [updatedReport, ...current];
  }

  saveReports(updatedReports);
  return updatedReport;
}

export function deleteReport(id: string): void {
  const current = getReports();
  const filtered = current.filter((r) => r.id !== id);
  saveReports(filtered);
}

export function generateReportNumber(): string {
  const reports = getReports();
  const year = new Date().getFullYear();
  const count = reports.length + 1;
  const seq = String(count).padStart(3, '0');
  return `TCR-${year}-${seq}`;
}

export function createBlankTyreCheck(defaultPressure = 35): TyreCheck {
  return {
    pressurePsi: defaultPressure,
    treadDepthMm: '',
    unevenWear: 'OK',
    shapeOut: 'NO',
    crackCut: 'NO',
    brand: '',
    mfgCode: '',
    mfgDate: '',
  };
}

export function createBlankReport(shopSettings: ShopSettings): TyreReport {
  const today = new Date().toISOString().split('T')[0];
  const positions: TyrePosition[] = ['FR_RH', 'FR_LH', 'RR_RH', 'RR_LH', 'STEPNEY'];
  
  const tyres: Record<TyrePosition, TyreCheck> = {
    FR_RH: createBlankTyreCheck(shopSettings.defaultPressure),
    FR_LH: createBlankTyreCheck(shopSettings.defaultPressure),
    RR_RH: createBlankTyreCheck(shopSettings.defaultPressure),
    RR_LH: createBlankTyreCheck(shopSettings.defaultPressure),
    STEPNEY: createBlankTyreCheck(shopSettings.defaultPressure),
  };

  return {
    id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    reportNo: generateReportNumber(),
    date: today,
    driverName: '',
    mobileNo: '',
    vehicleNo: '',
    model: '',
    mileage: '',
    tyres,
    overallCondition: 'Good',
    recommendedWork: ['Wheel Alignment', 'Wheel Balancing'],
    remarks: '',
    nextCheckDate: '',
    nextCheckKm: '',
    technicianName: shopSettings.defaultTechnician,
    shopName: shopSettings.shopName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function calculateAutoCondition(report: TyreReport): 'Excellent' | 'Good' | 'Average' | 'Replace Soon' | 'Immediate Replacement' {
  const positions: TyrePosition[] = ['FR_RH', 'FR_LH', 'RR_RH', 'RR_LH'];
  let minDepth = 10;
  let hasCuts = false;
  let hasShapeOut = false;
  let hasUnevenWear = false;

  for (const pos of positions) {
    const t = report.tyres[pos];
    const depth = parseFloat(t.treadDepthMm || '8');
    if (!isNaN(depth) && depth < minDepth) {
      minDepth = depth;
    }
    if (t.crackCut === 'YES') hasCuts = true;
    if (t.shapeOut === 'YES') hasShapeOut = true;
    if (t.unevenWear === 'NEED ATTENTION') hasUnevenWear = true;
  }

  if (minDepth <= 1.6 || (hasCuts && minDepth <= 2.5)) {
    return 'Immediate Replacement';
  }
  if (minDepth <= 3.0 || hasCuts || hasShapeOut) {
    return 'Replace Soon';
  }
  if (minDepth <= 4.5 || hasUnevenWear) {
    return 'Average';
  }
  if (minDepth <= 6.5) {
    return 'Good';
  }
  return 'Excellent';
}

export function exportBackupJSON(): void {
  const reports = getReports();
  const settings = getShopSettings();
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings,
    reports,
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `tyre_reports_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importBackupJSON(jsonText: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || !Array.isArray(parsed.reports)) {
      return { success: false, count: 0, error: 'Invalid backup JSON file structure' };
    }
    const current = getReports();
    const existingIds = new Set(current.map((r) => r.id));
    const newReports = [...current];
    let addedCount = 0;

    for (const report of parsed.reports) {
      if (report.id && !existingIds.has(report.id)) {
        newReports.push(report);
        addedCount++;
      }
    }

    saveReports(newReports);
    if (parsed.settings) {
      saveShopSettings(parsed.settings);
    }
    return { success: true, count: addedCount };
  } catch (e: any) {
    return { success: false, count: 0, error: e.message || 'Failed to parse JSON file' };
  }
}
