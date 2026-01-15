
import React, { useState, useCallback, useEffect } from 'react';
import { ViewMode, StudentRecord } from './types';
import { APP_CONFIG } from './constants';
import CheckInForm from './components/CheckInForm';
import AdminDashboard from './components/AdminDashboard';
import SuccessScreen from './components/SuccessScreen';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.CHECK_IN);
  const [lastRegistered, setLastRegistered] = useState<StudentRecord | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Hidden entrance logic
  const handleLogoClick = () => {
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= APP_CONFIG.adminEntryClicks) {
        setView(ViewMode.ADMIN);
        return 0;
      }
      return next;
    });
  };

  // Reset click count after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => setClickCount(0), 3000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const onCheckInComplete = useCallback((record: StudentRecord) => {
    setLastRegistered(record);
    setView(ViewMode.SUCCESS);
  }, []);

  const goToHome = () => {
    setView(ViewMode.CHECK_IN);
    setLastRegistered(null);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* Dynamic Header */}
      <header className="p-6 flex justify-between items-center glass sticky top-0 z-50 shadow-sm border-b border-white/20">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-slate-800">{APP_CONFIG.departmentName}</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Recruitment {APP_CONFIG.year}</p>
          </div>
        </div>
        
        {view === ViewMode.ADMIN && (
          <button 
            onClick={goToHome}
            className="px-4 py-2 rounded-full bg-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-300 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i> Exit Admin
          </button>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {view === ViewMode.CHECK_IN && (
          <CheckInForm onComplete={onCheckInComplete} />
        )}

        {view === ViewMode.SUCCESS && lastRegistered && (
          <SuccessScreen record={lastRegistered} onReturn={goToHome} />
        )}

        {view === ViewMode.ADMIN && (
          <AdminDashboard />
        )}
      </main>

      <footer className="p-8 text-center text-slate-400 text-sm">
        <p>&copy; {APP_CONFIG.year} {APP_CONFIG.departmentName}. All rights reserved.</p>
        <p className="mt-2">Powered by Modern Web Technologies & Gemini AI</p>
      </footer>

      {/* Admin Entry Notification - Optional Debug Visual */}
      {clickCount > 0 && (
        <div className="fixed bottom-4 right-4 pointer-events-none transition-opacity">
          <div className="bg-slate-800 text-white px-3 py-1 rounded-full text-xs opacity-50">
            {APP_CONFIG.adminEntryClicks - clickCount} clicks to Admin
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
