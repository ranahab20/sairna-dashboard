import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaHome, 
  FaBuilding, 
  FaBus, 
  FaTicketAlt, 
  FaUsers, 
  FaSignOutAlt, 
  FaShieldAlt, 
  FaUser,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { adminLogout } from '../../utils/token-storage';

function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return true;
    if (localStorage.getItem('theme') === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'نظرة عامة', path: '/overview', icon: <FaHome /> },
    { name: 'الشركات', path: '/companies', icon: <FaBuilding /> },
    { name: 'الرحلات', path: '/trips', icon: <FaBus /> },
    { name: 'الحجوزات', path: '/bookings', icon: <FaTicketAlt /> },
    { name: 'المستخدمون', path: '/users', icon: <FaUsers /> },
    { name: 'الملف الشخصي', path: '/profile', icon: <FaUser /> },
  ];

  return (
    <aside className="bg-surface border-l border-border h-full flex flex-col shadow-sm w-full transition-colors duration-300">
      
      <div className="hidden md:flex h-[73px] items-center px-6 border-b border-border gap-3 shrink-0">
        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-md">
          <FaShieldAlt size={20} />
        </div>
        <span className="text-xl font-black text-text">لوحة سيرنا</span>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                isActive ? 'bg-soft-teal text-primary' : 'text-muted hover:bg-surface-alt hover:text-text'
              }`
            }
          >
            {link.icon} {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0 flex flex-col gap-2">
        
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-center gap-2 bg-surface-alt text-text hover:bg-gray-200 dark:hover:bg-gray-700 py-3 rounded-xl font-bold text-sm transition-colors"
        >
          {isDark ? (
            <><FaSun className="text-yellow-500" /> الوضع النهاري</>
          ) : (
            <><FaMoon /> الوضع الليلي</>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100 py-3 rounded-xl font-bold text-sm transition-colors"
        >
          <FaSignOutAlt /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;