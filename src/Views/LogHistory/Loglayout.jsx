import Loading from "@/components/Loading";
import { getLogHistory } from "@/Services/Auth/Log.services";
import React from "react";
import { toast } from "sonner";
import { 
  Clock, 
  User, 
  Tag, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  RefreshCcw
} from "lucide-react"; // Pastikan install lucide-react

const MAP_STATUS_USER = {
  DIPROSES: "Sedang Diproses",
  SELESAI: "Permohonan Selesai / Disetujui",
  DITOLAK: "Permohonan Belum Dapat Disetujui",
};

const Loglayout = () => {
  const [logHistory, setLogHistory] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false,
  });
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [loading, setLoading] = React.useState(false);

  const fetchLogHistory = async () => {
    setLoading(true);
    try {
      const res = await getLogHistory(page, limit);
      const { response, pagination: paginasiBackend } = res.data;
      setLogHistory(response);
      setPagination(paginasiBackend);
    } catch (error) {
      toast.error("Gagal memuat log history");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLogHistory();
  }, [page, limit]);

  const getMessageStyle = (msg) => {
    if (!msg) return "bg-gray-50 text-gray-500 border-gray-200";
    if (msg.includes(MAP_STATUS_USER.SELESAI)) return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-100";
    if (msg.includes(MAP_STATUS_USER.DIPROSES)) return "bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100";
    if (msg.includes(MAP_STATUS_USER.DITOLAK)) return "bg-rose-50 text-rose-700 border-rose-200 shadow-sm shadow-rose-100";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  if (loading) return <div className=""><Loading /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen font-sans pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Clock className="text-blue-600" size={28} />
            Log Aktivitas Sistem
          </h1>
          <p className="text-slate-500 text-sm mt-1">Pantau seluruh perubahan status dan riwayat permohonan secara real-time.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 ml-2 uppercase">Show</span>
          <select
            value={limit}
            onChange={(e) => {setLimit(parseInt(e.target.value)); setPage(1);}}
            className="bg-slate-50 border-none text-slate-700 text-sm rounded-lg focus:ring-0 cursor-pointer font-bold"
          >
            {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <button 
            onClick={fetchLogHistory}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Waktu & User</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Aktivitas</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-bottom border-slate-100">Detail Ticket</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-bottom border-slate-100 text-right">Status Pesan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logHistory.length > 0 ? (
                logHistory.map((log) => {
                  const isUpdateStatus = log.action?.toLowerCase().includes("update status");
                  return (
                    <tr key={log.id} className="group hover:bg-blue-50/30 transition-all duration-200">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-700 text-sm">{log.username || "System Agent"}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} /> {new Date(log.createdAt).toLocaleString("id-ID", {dateStyle: 'medium', timeStyle: 'short'})}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wide ${
                          isUpdateStatus ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200" : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                        }`}>
                          <Tag size={12} />
                          {log.action}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-600 font-mono text-xs bg-slate-50 w-fit px-2 py-1 rounded border border-slate-200">
                          <FileText size={14} className="text-slate-400" />
                          {log.TicketId}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-block px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-300 ${getMessageStyle(log.message)}`}>
                          {log.message}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-20 text-slate-400 italic">Data log tidak ditemukan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs font-medium text-slate-500">
            Menampilkan <span className="text-slate-800">{logHistory.length}</span> dari <span className="text-slate-800">{pagination.total}</span> records
          </div>

          <div className="flex items-center gap-1">
            <PaginationButton onClick={() => setPage(1)} disabled={!pagination.hasPrevPage} icon={<ChevronsLeft size={16} />} />
            <PaginationButton onClick={() => setPage(p => p - 1)} disabled={!pagination.hasPrevPage} icon={<ChevronLeft size={16} />} />
            
            <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-600 shadow-sm">
              {pagination.page} / {pagination.totalPages}
            </div>

            <PaginationButton onClick={() => setPage(p => p + 1)} disabled={!pagination.hasNextPage} icon={<ChevronRight size={16} />} />
            <PaginationButton onClick={() => setPage(pagination.totalPages)} disabled={!pagination.hasNextPage} icon={<ChevronsRight size={16} />} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component tombol paginasi agar kode bersih
const PaginationButton = ({ onClick, disabled, icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-current transition-all shadow-sm"
  >
    {icon}
  </button>
);

export default Loglayout;