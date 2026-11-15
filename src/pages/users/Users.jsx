import { useState } from 'react';
import { useGetUsers } from '../../hooks/use-users';
import { FaSearch, FaUser, FaUserShield } from 'react-icons/fa';

function Users() {
  const { data: users, isLoading, isError } = useGetUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SY', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (isLoading) return <div className="text-center py-20 text-muted">جاري تحميل المستخدمين...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ في جلب البيانات</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-text mb-1">المستخدمون</h1>
          <p className="text-sm text-muted">قائمة بجميع الحسابات المسجلة في المنصة.</p>
        </div>
      </div>

      <div className="mb-6 max-w-md relative">
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" 
          placeholder="ابحث بالاسم أو الإيميل..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-surface border border-border rounded-xl text-sm text-text outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-alt border-b border-border text-sm text-muted">
              <tr>
                <th className="p-4 font-bold">المستخدم</th>
                <th className="p-4 font-bold">البريد الإلكتروني</th>
                <th className="p-4 font-bold">الصلاحية</th>
                <th className="p-4 font-bold">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-muted">لا يوجد مستخدمون مطابقون للبحث.</td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-soft-teal text-primary rounded-full flex items-center justify-center shrink-0">
                          <FaUser />
                        </div>
                        <span className="font-bold text-sm text-text">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text" dir="ltr">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                        {user.role === 'ADMIN' ? <><FaUserShield /> مسؤول</> : 'مستخدم'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {formatDateTime(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Users;