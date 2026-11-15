import { useState } from 'react';
import { useGetCompanies, useCreateCompany, useUpdateCompany, useDeleteCompany } from '../../hooks/use-companies';
import { FaBuilding, FaPlus, FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../components/shared/Button';
import CustomInput from '../../components/shared/CustomInput';

function Companies() {
  const { data: companies, isLoading, isError } = useGetCompanies();
  const { mutate: addCompany, isPending: isAdding } = useCreateCompany();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany();
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyLogo, setNewCompanyLogo] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLogo, setEditLogo] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const [deletingCompany, setDeletingCompany] = useState(null);

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    addCompany({ 
      name: newCompanyName, 
      logoUrl: newCompanyLogo.trim() || null 
    }, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewCompanyName('');
        setNewCompanyLogo('');
      }
    });
  };

  // دالة فتح التعديل
  const openEditModal = (company) => {
    setEditingCompany(company);
    setEditName(company.name);
    setEditLogo(company.logoUrl || '');
    setEditIsActive(company.isActive);
    setIsEditModalOpen(true);
  };

  // دالة حفظ التعديل
  const handleUpdateCompany = (e) => {
    e.preventDefault();
    updateCompany({ 
      id: editingCompany.id, 
      data: { 
        name: editName, 
        logoUrl: editLogo.trim() || null, 
        isActive: editIsActive 
      } 
    }, {
      onSuccess: () => setIsEditModalOpen(false)
    });
  };

  // دالة تأكيد الحذف
  const confirmDelete = () => {
    if (deletingCompany) {
      deleteCompany(deletingCompany.id, {
        onSuccess: () => setDeletingCompany(null)
      });
    }
  };

  if (isLoading) return <div className="text-center py-20 text-muted">جاري تحميل الشركات...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ في جلب البيانات</div>;

  return (
    <div>
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-text mb-1">إدارة الشركات</h1>
          <p className="text-sm text-muted">عرض وإضافة شركات النقل.</p>
        </div>
        <Button variant="primary" color="primary" className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <FaPlus /> إضافة شركة
        </Button>
      </div>

      {/* شريط البحث */}
      <div className="mb-6 max-w-md relative">
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" placeholder="ابحث باسم الشركة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary"
        />
      </div>

      {/* الجدول */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-alt border-b border-border text-sm text-muted">
              <tr>
                <th className="p-4 font-bold">الشركة</th>
                <th className="p-4 font-bold">الشعار</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompanies?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-muted">لا توجد شركات مطابقة للبحث.</td>
                </tr>
              ) : (
                filteredCompanies?.map((company) => (
                  <tr key={company.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-sm text-text">{company.name}</span>
                    </td>
                    
                    <td className="p-4">
                      {company.logoUrl ? (
                        <img 
                          src={company.logoUrl} 
                          alt={company.name} 
                          className="w-10 h-10 rounded-full object-cover border border-border bg-white"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Logo' }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-soft-teal text-primary rounded-full flex items-center justify-center font-bold">
                          {company.name.charAt(0)}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className={`flex items-center gap-1 text-xs font-bold ${company.isActive ? 'text-green-500' : 'text-red-500'}`}>
                        {company.isActive ? <><FaCheckCircle /> نشطة</> : <><FaTimesCircle /> غير نشطة</>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(company)} className="w-8 h-8 flex items-center justify-center bg-surface-alt text-text rounded-lg hover:bg-gray-200 transition-colors" title="تعديل">
                          <FaEdit />
                        </button>
                        <button onClick={() => setDeletingCompany(company)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="حذف">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة إضافة شركة (Modal) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-text mb-4">إضافة شركة جديدة</h2>
            <form onSubmit={handleAddCompany} className="flex flex-col gap-4">
              <CustomInput label="اسم الشركة" value={newCompanyName} onChange={(e) => setNewCompanyName(e.target.value)} placeholder="مثال: شركة النقل الحديثة" required />
              <CustomInput label="رابط الشعار (اختياري)" value={newCompanyLogo} onChange={(e) => setNewCompanyLogo(e.target.value)} placeholder="https://example.com/logo.png" dir="ltr" />
              
              <div className="flex justify-end gap-3 mt-2">
                <Button type="button" variant="outline" color="secondary" onClick={() => setIsAddModalOpen(false)}>إلغاء</Button>
                <Button type="submit" variant="primary" color="primary" disabled={isAdding}>{isAdding ? 'جاري الحفظ...' : 'حفظ'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تعديل شركة (Modal) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-text mb-4">تعديل الشركة</h2>
            <form onSubmit={handleUpdateCompany} className="flex flex-col gap-4">
              <CustomInput label="اسم الشركة" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              <CustomInput label="رابط الشعار (اختياري)" value={editLogo} onChange={(e) => setEditLogo(e.target.value)} dir="ltr" />
              
              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="editActive" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} className="w-5 h-5 accent-primary cursor-pointer" />
                <label htmlFor="editActive" className="text-sm font-bold text-text cursor-pointer">الشركة نشطة</label>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <Button type="button" variant="outline" color="secondary" onClick={() => setIsEditModalOpen(false)}>إلغاء</Button>
                <Button type="submit" variant="primary" color="primary" disabled={isUpdating}>{isUpdating ? 'جاري التعديل...' : 'حفظ التعديلات'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف (Modal أنيق) */}
      {deletingCompany && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaExclamationTriangle />
            </div>
            
            <h2 className="text-xl font-bold text-text mb-2">تأكيد الحذف</h2>
            
            <p className="text-sm text-muted mb-6">
              سيتم حذف شركة <span className="font-bold text-text">"{deletingCompany.name}"</span> نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </p>
            
            <div className="flex justify-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                color="secondary" 
                onClick={() => setDeletingCompany(null)} 
                disabled={isDeleting}
              >
                إلغاء
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                color="primary" 
                className="!bg-red-500 hover:!bg-red-600" 
                onClick={confirmDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;