import { useGetOverview } from '../../hooks/use-overview';
import { FaUsers, FaBuilding, FaBus, FaTicketAlt, FaCheckCircle } from 'react-icons/fa';

function Overview() {
  const { data: overview, isLoading, isError } = useGetOverview();

  const cardsData = [
    { id: 1, title: 'إجمالي الزبائن', value: overview?.customers, icon: <FaUsers />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, title: 'شركات النقل', value: overview?.companies, icon: <FaBuilding />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 3, title: 'رحلات قادمة', value: overview?.upcomingTrips, icon: <FaBus />, color: 'text-primary', bg: 'bg-soft-teal' },
    { id: 4, title: 'إجمالي الحجوزات', value: overview?.totalBookings, icon: <FaTicketAlt />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 5, title: 'حجوزات مؤكدة', value: overview?.confirmedBookings, icon: <FaCheckCircle />, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  if (isLoading) return <div className="text-center py-20 text-muted">جاري تحميل البيانات...</div>;
  if (isError) return <div className="text-center py-20 text-red-500">حدث خطأ أثناء جلب البيانات، تأكدي من تسجيل الدخول.</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text mb-1">نظرة عامة</h1>
        <p className="text-sm text-muted">ملخص سريع لأداء المنصة.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cardsData.map((card) => (
          <div key={card.id} className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-muted text-sm font-bold mb-1">{card.title}</h3>
            <p className="text-3xl font-black text-text">{card.value || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Overview;