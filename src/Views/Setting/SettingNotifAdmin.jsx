import Navigation from "@/components/Navigation";
import useSession from "@/hooks/use-session";
import {
  getAccountNotif,
  updateAccountNotif,
} from "@/Services/Auth/Notifications.services";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Smartphone, Save, Loader2, Info } from "lucide-react";

const SettingNotifAdmin = () => {
  const {} = useSession();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [noHp, setNoHp] = React.useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAccountNotif();
      if (response.data && response.data.length > 0) {
        const item = response.data[0];
        setData(item);
        setNoHp(item.noHp);
      }
    } catch (error) {
      toast.error("Gagal memuat data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Logika integrasi API update Anda di sini
      await updateAccountNotif({ id: data.id, noHp: noHp });
      fetchData(); // Refresh data setelah update
      toast.success("Nomor WhatsApp berhasil diperbarui");
    } catch (error) {
      toast.error("Gagal memperbarui nomor");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className=" bg-gray-50">
      <Navigation title="Pengaturan Notifikasi" />

      <div className="mx-auto pt-10 ">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
            <p className="text-gray-500 text-sm">Mengambil data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3">
              <div className="p-2 bg-green-50 text-red-600 rounded-lg">
                <Smartphone size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">
                  Nomor WhatsApp Admin
                </h2>
                <p className="text-xs text-gray-500 italic">
                  ID Data: #{data?.id}
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 ml-1">
                  Nomor Aktif (Gunakan format 62)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    +
                  </span>
                  <input
                    type="number"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="6289656519796"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Pesan notifikasi sistem akan dikirimkan ke nomor ini. Pastikan
                  nomor tersebut terdaftar di WhatsApp dan aktif.
                </p>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all shadow-md shadow-red-100"
              >
                {isUpdating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isUpdating ? "Menyimpan..." : "Update Nomor WhatsApp"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingNotifAdmin;
