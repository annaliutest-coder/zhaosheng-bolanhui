
import React from 'react';
import { StudentRecord } from '../types';
import { APP_CONFIG } from '../constants';

interface Props {
  record: StudentRecord;
  onReturn: () => void;
}

const SuccessScreen: React.FC<Props> = ({ record, onReturn }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <i className="fas fa-check text-3xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">打卡成功！</h2>
        <p className="text-slate-600">我們已將歡迎信發送至 <strong>{record.email}</strong></p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-800 p-4 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-slate-400 text-xs font-mono ml-2">Email Preview</span>
        </div>
        <div className="p-8 prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-700">
            {record.personalizedLetter?.replace('[系所官網]', APP_CONFIG.deptWebsite).replace('[申請連結]', APP_CONFIG.applyUrl)}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
            <a 
              href={APP_CONFIG.deptWebsite} 
              target="_blank" 
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="fas fa-globe"></i> 訪問系所網站
            </a>
            <a 
              href={APP_CONFIG.applyUrl} 
              target="_blank" 
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
            >
              <i className="fas fa-external-link-alt"></i> 申請系統 (即將開放)
            </a>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={onReturn}
          className="text-slate-500 font-medium hover:text-blue-600 transition-colors"
        >
          返回打卡首頁
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
