import { FaBars, FaTimes, FaShieldAlt } from 'react-icons/fa';

function MobileHeader({ isOpen, onToggle }) {
  return (
    <div className="md:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-md">
          <FaShieldAlt size={18} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black text-text leading-none mt-1">سيرنا</span>
          <span className="text-[10px] font-bold text-muted mt-1">لوحة التحكم</span>
        </div>
      </div>

      <button 
        onClick={onToggle} 
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-alt text-text hover:bg-soft-teal hover:text-primary transition-colors"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>
      
    </div>
  );
}

export default MobileHeader;