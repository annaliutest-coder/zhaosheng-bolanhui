
import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { StudentRecord } from '../types';

interface Props {
  onComplete: (record: StudentRecord) => void;
}

const CheckInForm: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    setStatus('正在與伺服器連線並生成專屬信件...');

    try {
      // Logic now resides in the backend to ensure data is saved to PostgreSQL
      const record = await dataService.saveStudent(formData.name, formData.email);
      setStatus('完成！');
      onComplete(record);
    } catch (error) {
      console.error(error);
      setStatus('伺服器忙碌中，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          立即打卡，開啟你的 <span className="text-blue-600">ABC 旅程</span>
        </h2>
        <p className="text-slate-600 text-lg max-w-xl mx-auto">
          填寫下方資料，我們將立即透過 Email 送上 ABC 系的專屬介紹。
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 max-w-lg mx-auto transform hover:scale-[1.01] transition-transform">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">姓名</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                required
                placeholder="請輸入您的真實姓名"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 text-slate-900"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-400">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                required
                placeholder="example@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-slate-50 text-slate-900"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                處理中...
              </>
            ) : (
              <>
                立即打卡
                <i className="fas fa-paper-plane ml-1"></i>
              </>
            )}
          </button>
        </form>
        
        {status && <p className="mt-4 text-center text-sm font-medium text-blue-600 animate-pulse">{status}</p>}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'fa-database', title: '雲端同步', desc: '資料即時傳入資料庫' },
          { icon: 'fa-robot', title: 'AI 客製化', desc: '生成專屬您的歡迎信' },
          { icon: 'fa-bell', title: '開放提醒', desc: '2026 申請開放時將通知您' }
        ].map((feat, i) => (
          <div key={i} className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className={`fas ${feat.icon} text-xl`}></i>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{feat.title}</h3>
            <p className="text-slate-500 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInForm;
