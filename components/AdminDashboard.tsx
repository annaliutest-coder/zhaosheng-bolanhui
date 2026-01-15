
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dataService } from '../services/dataService';
import { StudentRecord, AnalyticsData } from '../types';

const AdminDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, aData] = await Promise.all([
          dataService.getStudents(),
          dataService.getAnalytics()
        ]);
        setStudents(sData);
        setAnalytics(aData);
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">正在從 PostgreSQL 獲取數據...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">後端管理系統 (2026)</h2>
          <p className="text-slate-500">FastAPI + PostgreSQL 實時數據分析</p>
        </div>
        <button 
          onClick={dataService.exportToCSV}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-all flex items-center gap-2 active:scale-95"
        >
          <i className="fas fa-file-csv"></i> 匯出 CSV 資料庫
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">總資料筆數</p>
          <span className="text-4xl font-black text-slate-900">{students.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">活躍日期數</p>
          <span className="text-4xl font-black text-blue-600">{analytics.length}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">系統狀態</p>
          <div className="flex items-center gap-2 text-green-500 font-bold">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">每日打卡趨勢</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} dot={{r: 4, fill: '#2563eb', strokeWidth: 0}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">學生名單 (最新排序)</h3>
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="搜尋姓名或 Email..."
              className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-[250px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {filteredStudents.map(s => (
              <div key={s.id} className="p-3 rounded-xl bg-slate-50 flex justify-between items-center border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                  <p className="text-slate-500 text-xs">{s.email}</p>
                </div>
                <p className="text-slate-400 text-[10px] font-mono">
                  {new Date(s.checkInTime).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
