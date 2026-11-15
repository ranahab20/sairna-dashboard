import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobaileHeader';// استدعاء الملف الجديد

function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col md:flex-row" dir="rtl">
      
      <MobileHeader isOpen={isMobileMenuOpen} onToggle={toggleMenu} />

      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border absolute top-[65px] right-0 left-0 z-40 shadow-lg max-h-[calc(100vh-65px)] overflow-y-auto">
          <Sidebar onClose={closeMenu} />
        </div>
      )}

      <div className="hidden md:block w-64 shrink-0 bg-surface border-l border-border min-h-screen  sticky top-0 h-screen">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}

export default DashboardLayout;