import { useState } from 'react';
import { useGetTrips, useCreateTrip, useUpdateTrip, useDeleteTrip } from '../../hooks/use-trips';
import { useGetCompanies } from '../../hooks/use-companies';
import { useGetCities } from '../../hooks/use-cities';
import { FaBus, FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Button from '../../components/shared/Button';
import CustomInput from '../../components/shared/CustomInput';

function Trips() {
  const { data: trips, isLoading, isError } = useGetTrips();
  const { data: companies } = useGetCompanies();
  const { data: cities } = useGetCities();
  
  const { mutate: addTrip, isPending: isAdding } = useCreateTrip();
  const { mutate: updateTrip, isPending: isUpdating } = useUpdateTrip();
  const { mutate: deleteTrip, isPending: isDeleting } = useDeleteTrip();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);
  
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const [formData, setFormData] = useState({
    companyId: '', originId: '', destinationId: '', departureAt: '', arrivalAt: '', price: '', totalSeats: '', status: 'AVAILABLE'
  });

  const activeCompanies = companies?.filter(c => c.isActive === true);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-SY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const filteredTrips = trips?.filter((trip) => {
    const term = searchTerm.toLowerCase();
    return trip.company.name.toLowerCase().includes(term) || trip.code.toLowerCase().includes(term);
  });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const openAddModal = () => {
    setEditingTrip(null);
    setFormData({ companyId: '', originId: '', destinationId: '', departureAt: '', arrivalAt: '', price: '', totalSeats: '', status: 'AVAILABLE' });
    setIsModalOpen(true);
  };

  const openEditModal = (trip) => {
    setEditingTrip(trip);
    const formatForInput = (dateStr) => new Date(dateStr).toISOString().slice(0, 16);
    
    setFormData({
      companyId: trip.companyId,
      originId: trip.originId,
      destinationId: trip.destinationId,
      departureAt: formatForInput(trip.departureAt),
      arrivalAt: formatForInput(trip.arrivalAt),
      price: trip.price,
      totalSeats: trip.totalSeats,
      status: trip.status
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = {
      companyId: Number(formData.companyId),
      originId: Number(formData.originId),
      destinationId: Number(formData.destinationId),
      price: Number(formData.price),
      totalSeats: Number(formData.totalSeats),
      departureAt: new Date(formData.departureAt).toISOString(),
      arrivalAt: new Date(formData.arrivalAt).toISOString(),
    };

    if (editingTrip) {
      dataToSend.status = formData.status;
      
      updateTrip({ id: editingTrip.id, data: dataToSend }, { 
        onSuccess: () => {
          setIsModalOpen(false);
          showToast('تم تعديل الرحلة بنجاح', 'success');
        },
        onError: (err) => {
          setIsModalOpen(false);
          const errorMsg = err.response?.data?.message;
          
          if (errorMsg === 'CANNOT_CHANGE_RESERVED_TRIP_ROUTE_OR_SEATS') {
            showToast('لا يمكن تعديل مسار أو مقاعد رحلة تم حجز مقاعد عليها.', 'error');
          } else if (errorMsg === 'INVALID_COMPANY') {
            showToast('لا يمكن استخدام شركة غير نشطة أو ملغاة.', 'error');
          } else if (errorMsg === 'CONFLICT') {
            showToast('يوجد تعارض في وقت الرحلة أو المسار.', 'error');
          } else {
            showToast('حدث خطأ أثناء التعديل. يرجى المحاولة لاحقاً.', 'error');
          }
        }
      });

    } else {
      addTrip(dataToSend, { 
        onSuccess: () => {
          setIsModalOpen(false);
          showToast('تمت إضافة الرحلة بنجاح', 'success');
        },
        onError: (err) => {
          setIsModalOpen(false);
          const errorMsg = err.response?.data?.message;
          if (errorMsg === 'INVALID_COMPANY') {
            showToast('لا يمكن إضافة رحلة لشركة غير نشطة.', 'error');
          } else {
            showToast('حدث خطأ أثناء الإضافة. يرجى المحاولة لاحقاً.', 'error');
          }
        }
      });
    }
  };

  const confirmDelete = () => {
    if (deletingTrip) {
      deleteTrip(deletingTrip.id, {
        onSuccess: () => {
          setDeletingTrip(null);
          showToast('تم إلغاء الرحلة بنجاح', 'success');
        },
        onError: () => {
          setDeletingTrip(null);
          showToast('حدث خطأ أثناء إلغاء الرحلة', 'error');
        }
      });
    }
  };

  if (isLoading) return <div className="text-center py-20">جاري التحميل...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ</div>;

  return (
    <div className="relative">
      
      {/* رسالة التوست (تظهر فوق الشاشة) */}
      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 transition-all duration-300 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {toast.type === 'error' ? <FaExclamationTriangle /> : <FaCheckCircle />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-text mb-1">إدارة الرحلات</h1>
          <p className="text-sm text-muted">عرض وإدارة جميع الرحلات المجدولة.</p>
        </div>
        <Button variant="primary" color="primary" className="flex items-center gap-2" onClick={openAddModal}>
          <FaPlus /> إضافة رحلة
        </Button>
      </div>

      <div className="mb-6 max-w-md relative">
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" placeholder="ابحث باسم الشركة أو كود الرحلة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-alt border-b border-border text-sm text-muted">
              <tr>
                <th className="p-4 font-bold">الشركة</th>
                <th className="p-4 font-bold">المسار</th>
                <th className="p-4 font-bold">التوقيت</th>
                <th className="p-4 font-bold">المقاعد</th>
                <th className="p-4 font-bold">السعر</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTrips?.map((trip) => (
                <tr key={trip.id} className="hover:bg-surface-alt/50">
                  <td className="p-4">
                    <span className="font-bold text-sm">{trip.company.name}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      {trip.origin.name} <FaBus className="text-muted text-xs" /> {trip.destination.name}
                    </div>
                    <span className="text-xs text-muted mt-1 block">كود: {trip.code}</span>
                  </td>
                  <td className="p-4 text-sm">
                    <div>انطلاق: {formatDateTime(trip.departureAt)}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className="text-green-600 font-bold">{trip.availableSeats}</span> / {trip.totalSeats}
                  </td>
                  <td className="p-4 font-bold text-sm">{trip.price.toLocaleString()} ل.س</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${trip.status === 'AVAILABLE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {trip.status === 'AVAILABLE' ? 'متاحة' : 'ملغاة'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEditModal(trip)} className="w-8 h-8 flex items-center justify-center bg-surface-alt text-text rounded-lg hover:bg-gray-200 transition-colors" title="تعديل">
                        <FaEdit />
                      </button>
                      <button onClick={() => setDeletingTrip(trip)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="إلغاء">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* نافذة الإضافة والتعديل */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingTrip ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-red-500"><FaTimes size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">الشركة</label>
                <select name="companyId" value={formData.companyId} onChange={handleChange} required className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary">
                  <option value="">اختر الشركة...</option>
                  {activeCompanies?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">مدينة الانطلاق</label>
                <select name="originId" value={formData.originId} onChange={handleChange} required className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary">
                  <option value="">اختر المدينة...</option>
                  {cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">مدينة الوصول</label>
                <select name="destinationId" value={formData.destinationId} onChange={handleChange} required className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary">
                  <option value="">اختر المدينة...</option>
                  {cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <CustomInput label="السعر (ل.س)" name="price" type="number" value={formData.price} onChange={handleChange} required />
              <CustomInput label="عدد المقاعد الكلي" name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} required />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">وقت الانطلاق</label>
                <input type="datetime-local" name="departureAt" value={formData.departureAt} onChange={handleChange} required className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold">وقت الوصول</label>
                <input type="datetime-local" name="arrivalAt" value={formData.arrivalAt} onChange={handleChange} required className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary" />
              </div>

              {editingTrip && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold">حالة الرحلة</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="border border-border rounded-xl px-3 py-3 bg-surface text-sm outline-none focus:border-primary">
                    <option value="AVAILABLE">متاحة</option>
                    <option value="CANCELLED">ملغاة</option>
                  </select>
                </div>
              )}

              <div className="col-span-full flex justify-end gap-3 mt-4">
                <Button type="button" variant="outline" color="secondary" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                <Button type="submit" variant="primary" color="primary" disabled={isAdding || isUpdating}>
                  {isAdding || isUpdating ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal تأكيد الإلغاء/الحذف */}
      {deletingTrip && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaExclamationTriangle />
            </div>
            <h2 className="text-xl font-bold text-text mb-2">تأكيد الإلغاء</h2>
            <p className="text-sm text-muted mb-6">هل أنت متأكد من إلغاء الرحلة <span className="font-bold text-text">"{deletingTrip.code}"</span>؟ سيتم تغيير حالتها إلى "ملغاة".</p>
            
            <div className="flex justify-center gap-3">
              <Button type="button" variant="outline" color="secondary" onClick={() => setDeletingTrip(null)} disabled={isDeleting}>إلغاء</Button>
              <Button type="button" variant="primary" color="primary" className="!bg-red-500 hover:!bg-red-600" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trips;