
import { StudentRecord, AnalyticsData } from '../types';

// 在生產環境中，API_BASE 設為絕對路徑或根據環境調整
const API_BASE = '/api';

export const dataService = {
  getStudents: async (): Promise<StudentRecord[]> => {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) throw new Error('無法獲取學生名單');
    const data = await response.json();
    return data.map((s: any) => ({
      id: s.id.toString(),
      name: s.name,
      email: s.email,
      nationality: s.nationality,
      checkInTime: s.check_in_time,
      personalizedLetter: s.letter
    }));
  },

  saveStudent: async (
    name: string,
    email: string,
    nationality: string
  ): Promise<StudentRecord> => {
    const response = await fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, nationality }),
    });

    if (!response.ok) {
      // Try to extract error message from response
      let errorMessage = '打卡失敗';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        // If can't parse JSON, use status text
        errorMessage = response.statusText || '打卡失敗';
      }
      throw new Error(errorMessage);
    }

    const s = await response.json();
    return {
      id: s.id.toString(),
      name: s.name,
      email: s.email,
      nationality: s.nationality,
      checkInTime: s.check_in_time,
      personalizedLetter: s.letter
    };
  },

  getAnalytics: async (): Promise<AnalyticsData[]> => {
    const response = await fetch(`${API_BASE}/analytics`);
    if (!response.ok) throw new Error('無法獲取分析數據');
    return await response.json();
  },

  exportToCSV: async () => {
    // 使用 a 標籤觸發下載，確保處理檔案流
    const link = document.createElement('a');
    link.href = `${API_BASE}/export`;
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
