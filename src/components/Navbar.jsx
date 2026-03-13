import React, { useEffect, useState } from "react";
import { LogOut, Bell, CheckCheck, Trash2, X } from "lucide-react";
import { responseHandler } from "@/lib/utils";
import { ServiceLogout } from "@/Services/Auth/Auth.services";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/lib/AuthZustand";
import { toast } from "sonner";
import {
  deleteNotificationsAll,
  getNotification,
  getStreamNotificationUrl,
  patchMarkAsRead,
  patchReadAll,
} from "@/Services/Auth/Analytic.services";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  // 1. Inisialisasi State (Kosong karena nanti ambil dari DB)
  const [notifications, setNotifications] = useState([]);

  // 2. Fungsi Helper Text (Tetap dipertahankan agar UI bersih)
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

  // 3. Efek untuk Fetch Riwayat (Nanti kalau Route sudah ada) & Real-time SSE
  useEffect(() => {
    // --- A. AMBIL RIWAYAT DARI DB ---
    const fetchHistory = async () => {
      try {
        const response = await getNotification();
        setNotifications(response.data);
      } catch (err) {
        console.log("Riwayat notif belum bisa diakses (Route belum ada)");
      }
    };
    fetchHistory();

    // --- B. SETUP SSE (REAL-TIME) ---
    // Ganti dengan route stream kamu nanti, misal: /api/notifications/stream
    const eventSource = new EventSource(getStreamNotificationUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const newNotif = {
        ...data,
        id: data.id || Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setNotifications((prev) => [newNotif, ...prev]);
      window.dispatchEvent(new Event("refresh-ticket-table"));

      toast.info(formatTypeText(data.type), {
        description: cleanMessage(data.message),
        action: {
          label: "Lihat",
          onClick: () => {
            const target =
              data.type === "PERMINTAAN_INFORMASI"
                ? "/pengaduan/permohonan-informasi"
                : "/pengaduan/pengajuan-keberatan";
            navigate(target);
          },
        },
      });
    };

    eventSource.onerror = () => {
      console.log("Koneksi SSE terputus/sedang menunggu server...");
    };

    return () => {
      eventSource.close();
    };
  }, [navigate]);

  // Logika Handlers
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    // 1. Optimistic Update (UI dulu)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      // 2. Sync ke Backend
      await patchMarkAsRead(id);
    } catch (err) {
      console.error("Gagal update status baca");
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await patchReadAll();
      toast.success("Semua notifikasi ditandai dibaca");
    } catch (err) {
      console.error("Gagal update semua status baca");
    }
  };

  const clearNotifications = async () => {
    if (window.confirm("Hapus semua riwayat notifikasi secara permanen?")) {
      try {
        await deleteNotificationsAll();
        setNotifications([]);
        setShowModal(false);
        toast.success("Riwayat notifikasi dibersihkan");
      } catch (err) {
        toast.error("Gagal menghapus riwayat notifikasi");
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await ServiceLogout(localStorage.getItem("token"));
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      responseHandler(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 pt-4 pb-2 border-b-2 bg-white sticky top-0 z-0">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <img
            src="https://sekadaukabppid.kpu.go.id/img/logo.png"
            alt="Logo"
            className="w-14"
          />
          <div>
            <h1 className="text-lg font-bold text-red-600 leading-tight">
              Dashboard Admin
            </h1>
            <p className="text-xs md:text-sm font-bold uppercase text-gray-700 italic">
              e-PPID | KPU Sekadau
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setShowModal(!showModal)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={24} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Modal Notifikasi */}
            {showModal && (
              <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border rounded-lg shadow-2xl overflow-hidden z-[60]">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-700 text-sm">
                    Notifikasi
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-400 text-sm italic">
                      Belum ada notifikasi.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b last:border-0 hover:bg-gray-50 transition-colors ${!notif.isRead ? "bg-red-50/40 border-l-4 border-l-red-600" : ""}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${notif.type === "PERMINTAAN_INFORMASI" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}
                          >
                            {formatTypeText(notif.type)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">
                            {notif.time || "Baru saja"}
                          </span>
                        </div>

                        <p
                          className={`text-sm leading-snug mb-2 ${!notif.isRead ? "font-bold text-gray-800" : "text-gray-500"}`}
                        >
                          {cleanMessage(notif.message)}
                        </p>

                        <div className="flex justify-between items-center">
                          <button
                            onClick={() => {
                              markAsRead(notif.id);
                              navigate(
                                notif.type === "PERMINTAAN_INFORMASI"
                                  ? "/pengaduan/permohonan-informasi"
                                  : "/pengaduan/pengajuan-keberatan",
                              );
                              setShowModal(false);
                            }}
                            className="text-xs text-red-700 font-bold hover:underline"
                          >
                            Detail
                          </button>
                          {!notif.isRead && (
                            <button onClick={() => markAsRead(notif.id)}>
                              <CheckCheck
                                size={16}
                                className="text-gray-400 hover:text-green-600"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-gray-50 border-t flex justify-between">
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-blue-600 flex items-center gap-1"
                    >
                      <CheckCheck size={14} /> Baca Semua
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] font-bold text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Bersihkan
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            title="Logout"
            disabled={loading}
            className="p-2 rounded-md hover:bg-gray-100 transition-all ml-2"
            onClick={handleLogout}
          >
            {loading ? (
              <BeatLoader size={10} color="red" />
            ) : (
              <LogOut size={24} className="text-red-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
