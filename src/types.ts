export type TyrePosition = 'FR_RH' | 'FR_LH' | 'RR_RH' | 'RR_LH' | 'STEPNEY';

export interface TyreCheck {
  pressurePsi: number;
  treadDepthMm: string;
  unevenWear: 'OK' | 'NO' | 'NEED ATTENTION';
  shapeOut: 'YES' | 'NO';
  crackCut: 'YES' | 'NO';
  brand: string;
  mfgCode: string;
  mfgDate: string;
}

export type OverallCondition = 'Excellent' | 'Good' | 'Average' | 'Replace Soon' | 'Immediate Replacement';

export interface TyreReport {
  id: string;
  reportNo: string;
  date: string;
  driverName: string;
  mobileNo: string;
  vehicleNo: string;
  model: string;
  mileage: string;
  tyres: Record<TyrePosition, TyreCheck>;
  overallCondition: OverallCondition;
  recommendedWork: string[];
  remarks: string;
  nextCheckDate: string;
  nextCheckKm: string;
  technicianName: string;
  shopName: string;
  createdAt: number;
  updatedAt: number;
}

export interface ShopSettings {
  shopName: string;
  address: string;
  mobileNo: string;
  tagline: string;
  defaultPressure: number;
  defaultTechnician: string;
}

export type ViewTab = 'new_report' | 'history' | 'dashboard' | 'settings';
