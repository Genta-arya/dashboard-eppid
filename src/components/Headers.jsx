import React, { useEffect, useState } from "react";
import { 
  Bell, ChevronDown, LayoutDashboard, Search, Settings, 
  X, CheckCheck, Trash2, Globe, Terminal, LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";
import useUserStore from "@/lib/AuthZustand";
import { responseHandler } from "@/lib/utils";
import { ServiceLogout } from "@/Services/Auth/Auth.services";
import {
  deleteNotificationsAll,
  getNotification,
  getStreamNotificationUrl,
  patchMarkAsRead,
  patchReadAll,
} from "@/Services/Auth/Analytic.services";

const Headers = ({ user }) => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userName = user?.name || "Administrator";
  const userRole = user?.role || "Petugas PPID";
  const userProfileImage = user?.avatar || `https://ui-avatars.com/api/?name=${userName}`;

  // --- 1. Logika Notifikasi (SSE & Fetch) ---
  const formatTypeText = (type) => {
    if (type === "PERMINTAAN_INFORMASI") return "Permohonan Informasi";
    if (type === "KEBERATAN") return "Pengajuan Keberatan";
    return type;
  };

  const cleanMessage = (msg) => {
    if (!msg) return "";
    return msg
      .replace("PERMINTAAN_INFORMASI", "Permohonan Informasi")
      .replace("KEBERATAN", "Pengajuan Keberatan");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getNotification();
        setNotifications(response.data);
      } catch (err) {
        console.log("Gagal mengambil riwayat notifikasi");
      }
    };
    fetchHistory();

    const eventSource = new EventSource(getStreamNotificationUrl);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newNotif = {
        ...data,
        id: data.id || Date.now(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      window.dispatchEvent(new Event("refresh-ticket-table"));

      toast.info(formatTypeText(data.type), {
        description: cleanMessage(data.message),
        action: {
          label: "Lihat",
          onClick: () => navigate(data.type === "PERMINTAAN_INFORMASI" ? "/pengaduan/permohonan-informasi" : "/pengaduan/pengajuan-keberatan"),
        },
      });
    };
    return () => eventSource.close();
  }, [navigate]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try { await patchMarkAsRead(id); } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await patchReadAll();
      toast.success("Semua notifikasi dibaca");
    } catch (err) { console.error(err); }
  };

  const clearNotifications = async () => {
    if (window.confirm("Hapus semua riwayat notifikasi?")) {
      try {
        await deleteNotificationsAll();
        setNotifications([]);
        setShowNotif(false);
        toast.success("Riwayat dibersihkan");
      } catch (err) { toast.error("Gagal menghapus"); }
    }
  };

  // --- 2. Logika Logout ---
  const handleLogout = async () => {
    setLoadingLogout(true);
    try {
      await ServiceLogout(localStorage.getItem("token"));
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <header className="sticky top-0 z-[50] w-full px-4 pt-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-[1.5rem] px-6 py-3">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">E-PPID</h2>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">KPU KAB. SEKADAU</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            
            {/* Bell Icon & Dropdown Notif */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
                className={`relative p-2 rounded-xl transition-all ${showNotif ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white border border-slate-200 shadow-2xl rounded-[1.5rem] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-700 text-xs uppercase tracking-widest">Notifikasi</h3>
                    <button onClick={() => setShowNotif(false)} className="text-slate-400 hover:text-black"><X size={18} /></button>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center text-slate-400 text-xs italic">Belum ada pemberitahuan.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b last:border-0 transition-colors ${!notif.isRead ? "bg-red-50/30 border-l-4 border-l-red-600" : "hover:bg-slate-50"}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase ${notif.type === "PERMINTAAN_INFORMASI" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                              {formatTypeText(notif.type)}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">{notif.time || "Baru"}</span>
                          </div>
                          <p className={`text-xs leading-relaxed mb-2 ${!notif.isRead ? "font-bold text-slate-800" : "text-slate-500"}`}>{cleanMessage(notif.message)}</p>
                          <div className="flex justify-between items-center">
                            <button onClick={() => { markAsRead(notif.id); navigate(notif.type === "PERMINTAAN_INFORMASI" ? "/pengaduan/permohonan-informasi" : "/pengaduan/pengajuan-keberatan"); setShowNotif(false); }} className="text-[10px] text-red-600 font-black uppercase tracking-widest hover:underline">Detail</button>
                            {!notif.isRead && <button onClick={() => markAsRead(notif.id)}><CheckCheck size={16} className="text-slate-300 hover:text-green-500" /></button>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 bg-slate-50 border-t flex justify-between">
                      <button onClick={markAllAsRead} className="text-[9px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1"><CheckCheck size={12} /> Baca Semua</button>
                      <button onClick={clearNotifications} className="text-[9px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1"><Trash2 size={12} /> Hapus</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-slate-200 mx-1"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div 
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
                className="flex items-center gap-3 pl-1 group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-800 leading-none">{userName}</p>
                  <p className="text-[9px] font-bold text-red-600 mt-1 uppercase tracking-tighter">{userRole}</p>
                </div>
                <div className="relative">
                  <img src={userProfileImage} alt="Avatar" className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </div>

              {showUserMenu && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <Settings size={16} /> Pengaturan Akun
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2"></div>
                    <button 
                      onClick={handleLogout}
                      disabled={loadingLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      {loadingLogout ? <BeatLoader size={8} color="#ef4444" /> : <><LogOut size={16} /> Keluar Sistem</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Headers;