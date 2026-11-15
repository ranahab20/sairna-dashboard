import { useGetMyProfile } from '../../hooks/use-profile';
import { FaUserShield, FaEnvelope, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';

function Profile() {
  const { data: profile, isLoading, isError } = useGetMyProfile();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SY', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (isLoading) return <div className="text-center py-20 text-muted">جاري تحميل البيانات...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ في جلب البيانات</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text mb-1">الملف الشخصي</h1>
        <p className="text-sm text-muted">معلومات حسابك وبياناتك الأساسية.</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        
        <div className="bg-primary/10 p-8 flex items-center gap-6 border-b border-border">
          <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg shrink-0">
            {profile?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">{profile?.name}</h2>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary mt-1">
              <FaUserShield /> مسؤول النظام (Admin)
            </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex items-start gap-3 p-4 bg-surface-alt rounded-xl">
            <div className="text-primary mt-1"><FaEnvelope size={18} /></div>
            <div>
              <p className="text-xs text-muted font-bold mb-1">البريد الإلكتروني</p>
              <p className="font-bold text-text" dir="ltr">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-surface-alt rounded-xl">
            <div className="text-primary mt-1"><FaIdBadge size={18} /></div>
            <div>
              <p className="text-xs text-muted font-bold mb-1">معرف الحساب</p>
              <p className="font-bold text-text">#{profile?.id}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-surface-alt rounded-xl md:col-span-2">
            <div className="text-primary mt-1"><FaCalendarAlt size={18} /></div>
            <div>
              <p className="text-xs text-muted font-bold mb-1">تاريخ الانضمام</p>
              <p className="font-bold text-text">{formatDate(profile?.createdAt)}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;