
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  checkInTime: string;
  personalizedLetter?: string;
}

export enum ViewMode {
  CHECK_IN = 'CHECK_IN',
  SUCCESS = 'SUCCESS',
  ADMIN = 'ADMIN'
}

export interface AnalyticsData {
  date: string;
  count: number;
}
