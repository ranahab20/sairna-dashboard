import { useState } from 'react';
import { useGetBookings, useCancelBooking } from '../../hooks/use-bookings';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../../components/shared/Button';

function Bookings() {
  const { data: bookings, isLoading, isError } = useGetBookings();
  const { mutate: cancelBooking, isPending } = useCancelBooking();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const filteredBookings = bookings?.filter((booking) => {
    const term = searchTerm.toLowerCase();
    return (
      booking.code.toLowerCase().includes(term) ||
      booking.trip.company.name.toLowerCase().includes(term)
    );
  });

  const confirmCancel = () => {
    if (bookingToCancel) {
      cancelBooking(bookingToCancel.id, {
        onSuccess: () => setBookingToCancel(null)
      });
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ar-SY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) return <div className="text-center py-20 text-muted">جاري تحميل الحجوزات...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ في جلب البيانات</div>;

  return (
    <div>
      {/* رأس الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-text mb-1">إدارة الحجوزات</h1>
          <p className="text-sm text-muted">عرض وتتبع جميع الحجوزات التي تمت على المنصة.</p>
        </div>
      </div>

      {/* البحث */}
      <div className="mb-6 max-w-md relative">
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" 
          placeholder="ابحث بكود الحجز أو اسم الشركة..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 bg-surface border border-border rounded-xl text-sm text-text outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* الجدول */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-alt border-b border-border text-sm text-muted">
              <tr>
                <th className="p-4 font-bold">كود الحجز</th>
                <th className="p-4 font-bold">الشركة / الرحلة</th>
                <th className="p-4 font-bold">تاريخ الحجز</th>
                <th className="p-4 font-bold">الإجمالي</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-muted">لا توجد حجوزات مطابقة للبحث.</td>
                </tr>
              ) : (
                filteredBookings?.map((booking) => (
                  <tr key={booking.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-sm text-primary" dir="ltr">{booking.code}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-sm text-text block">{booking.trip.company.name}</span>
                      <span className="text-xs text-muted mt-1 block">
                        {booking.trip.origin.name} ← {booking.trip.destination.name}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-text">
                      {formatDateTime(booking.createdAt)}
                    </td>
                    <td className="p-4 font-bold text-sm text-text">
                      {booking.totalPrice.toLocaleString()} <span className="text-xs font-normal text-muted">ل.س</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {booking.status === 'CONFIRMED' ? <><FaCheckCircle /> مؤكد</> : <><FaTimesCircle /> ملغى</>}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setBookingToCancel(booking)} 
                          disabled={booking.status !== 'CONFIRMED'}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          إلغاء الحجز
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

      {/* نافذة تأكيد الإلغاء (Modal) */}
      {bookingToCancel && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaExclamationTriangle />
            </div>
            
            <h2 className="text-xl font-bold text-text mb-2">تأكيد الإلغاء</h2>
            
            <p className="text-sm text-muted mb-6">
              هل أنت متأكد من إلغاء الحجز رقم <span className="font-bold text-text" dir="ltr">{bookingToCancel.code}</span>؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            
            <div className="flex justify-center gap-3">
              <Button 
                type="button" 
                variant="outline" 
                color="secondary" 
                onClick={() => setBookingToCancel(null)} 
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button 
                type="button" 
                variant="primary" 
                color="primary" 
                className="!bg-red-500 hover:!bg-red-600" 
                onClick={confirmCancel} 
                disabled={isPending}
              >
                {isPending ? 'جاري الإلغاء...' : 'تأكيد الإلغاء'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;