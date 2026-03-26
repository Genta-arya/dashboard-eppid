import React, { useState, useEffect } from "react";

import {
  FaTrash,
  FaWhatsapp,
  FaFileDownload,
  FaUser,
  FaSearch,
  FaSync,
  FaStickyNote,
  FaPaperPlane,
  FaHistory,
} from "react-icons/fa";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import {
  deleteForm,
  getAllForm,
  SearchForm,
  updateStatus,
} from "@/Services/Auth/Form.services";
import { baseUrl } from "@/Services/AxiosInstance";
import useSession from "@/hooks/use-session";

const mapEnum = {
  JenisPemohon: {
    PERORANGAN: "Perorangan",
    KELOMPOK_ORANG: "Kelompok Orang",
    BADAN_HUKUM: "Badan Hukum",
  },
  JenisIdentitas: {
    KTP: "KTP",
    SIM: "SIM",
    PASPOR: "Paspor",
    SURAT_KUASA: "Surat Kuasa",
  },
  CaraMemperoleh: {
    EMAIL: "Email",
    WHATSAPP: "WhatsApp",
    AMBIL_DI_KANTOR: "Ambil di Kantor",
  },
  StatusTicket: {
    DIPROSES: {
      label: "Diproses",
      color:
        "text-yellow-700 bg-yellow-50 border-yellow-200 focus:ring-yellow-400",
    },
    SELESAI: {
      label: "Selesai",
      color: "text-green-700 bg-green-50 border-green-200 focus:ring-green-400",
    },
    DITOLAK: {
      label: "Ditolak",
      color: "text-red-700 bg-red-50 border-red-200 focus:ring-red-400",
    },
  },
};

const PermohonanKeberatan = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const { user} = useSession();
  const fetchData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getAllForm(
        "KEBERATAN",
        statusFilter,
        dateFilter,
        page,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      setData(response.data.data || []); // Ambil data dari properti data
      setPagination(response.data.pagination); // Simpan info halaman
    } catch (error) {
      toast.error("Gagal memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Jalankan fetchData setiap kali filter berubah
  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFilter]);
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      fetchData();
      return;
    }

    setIsLoading(true);
    try {
      const response = await SearchForm(searchTerm);
      // Memastikan data selalu dalam bentuk array
      const result = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setData(result.filter((item) => item !== null));
      toast.success("Data berhasil ditemukan.");
    } catch (error) {
      setData([]);
      toast.error("Nomor tiket tidak ditemukan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    let adminNote = "";

    // 1. Cek jika status yang baru adalah SELESAI atau DITOLAK
    if (newStatus === "SELESAI" || newStatus === "DITOLAK") {
      const userInput = prompt(
        `Berikan catatan tindak lanjut untuk status ${mapEnum.StatusTicket[newStatus].label}:`,
      );

      // Jika user menekan 'Cancel' atau input kosong
      if (userInput === null) {
        // Kembalikan dropdown ke status sebelumnya (opsional, tergantung kebutuhan UX)
        return;
      }

      if (userInput.trim() === "") {
        toast.error("Catatan wajib diisi untuk status ini.");
        return;
      }

      adminNote = userInput;
    }
    if (adminNote.length > 100) {
      toast.info("Catatan tidak boleh lebih dari 100 karakter.");
      return;
    }

    try {
      setIsUpdating((prev) => ({ ...prev, [id]: true }));

      // 2. Kirim status DAN catatan ke API
      // Pastikan backend Anda sudah mendukung field catatanAdmin atau sesuai nama field di DB
      await updateStatus(
        id,
        { status: newStatus },
        adminNote || null,
        true,
        user.id,
        user.name,
      );

      // 3. Update Local State (Termasuk update catatanAdmin agar UI langsung berubah)
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
                catatanAdmin: adminNote || item.catatanAdmin,
              }
            : item,
        ),
      );

      toast.success(
        `Status diperbarui ke: ${mapEnum.StatusTicket[newStatus].label}`,
      );
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status.");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };
  const handleEditNote = async (item) => {
    // 1. Ambil catatan saat ini sebagai default value di prompt
    const currentNote = item.catatanAdmin || "";

    if (item.status !== "SELESAI" && item.status !== "DITOLAK") {
      return toast.info(
        "Hanya status SELESAI dan DITOLAK yang dapat diubah catatan.",
      );
    }
    const newNote = prompt("Edit Catatan Tindak Lanjut Admin:", currentNote);

    // Jika user klik 'Batal' (null), jangan lakukan apa-apa
    if (newNote === null) return;

    // Validasi panjang karakter (opsional, mengikuti logic status change Anda)
    if (newNote.length > 100) {
      toast.info("Catatan tidak boleh lebih dari 100 karakter.");
      return;
    }

    try {
      setIsUpdating((prev) => ({ ...prev, [item.id]: true }));

      // 2. Panggil API updateStatus
      // Kirim status yang sekarang (item.status) agar status tidak berubah
      // Kirim newNote sebagai catatan baru
      await updateStatus(item.id, { status: item.status }, newNote);

      // 3. Update Local State agar UI langsung berubah
      setData((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, catatanAdmin: newNote } : row,
        ),
      );

      toast.success("Catatan berhasil diperbarui.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui catatan.");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteForm(id);
      toast.success("Data berhasil dihapus.");
      setData(data.filter((item) => item.id !== id));
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatWA = (phone) => {
    if (!phone) return "#";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) cleaned = "62" + cleaned.substring(1);
    return `https://wa.me/${cleaned}`;
  };

  return (
    <>
      <div className=" ">
        <Navigation />
      </div>
      <div className="">
        <div className="mt-4 ">
          {/* Header & Improved Search UI */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                Pengajuan Keberatan
              </h2>
              <div className="flex items-center gap-2 text-red-100 text-sm mt-1 font-medium italic opacity-90">
                <FaHistory />
                <span>Monitoring & Manajemen Berkas PPID</span>
              </div>
            </div>

            {/* Search Form (Submit on Enter) */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-white p-1 rounded-xl shadow-inner w-full lg:w-auto"
            >
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Cari Nomor Tiket..."
                  className="w-full pl-10 pr-4 py-1 rounded-lg text-sm text-gray-900 border-none outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                  fetchData();
                }}
                className="ml-1 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Reset Data"
              >
                <FaSync className={isLoading ? "animate-spin" : ""} />
              </button>
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-red-700 transition-all shadow active:scale-95"
              >
                Cari
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-4 bg-red-800/30 p-4  border border-red-400/30">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-red-100">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-white"
              >
                <option value="all">Semua Status</option>
                <option value="BELUM">Belum diverifikasi</option>
                <option value="DIPROSES">Sedang Diproses</option>
                <option value="SELESAI">Selesai</option>
                <option value="DITOLAK">Ditolak</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase tracking-widest text-red-100">
                Tanggal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter === "all" ? "" : dateFilter}
                  onChange={(e) => setDateFilter(e.target.value || "all")}
                  className="w-full bg-white text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg outline-none"
                />
                {dateFilter !== "all" && (
                  <button
                    onClick={() => setDateFilter("all")}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] text-red-600 font-black hover:underline"
                  >
                    RESET
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="">
                <tr className="bg-gray-50 border-b-2 border-gray-200 text-gray-500 uppercase text-[10px] font-black tracking-[0.1em]">
                  <th className="p-5 text-center">Waktu & Tiket</th>
                  <th className="p-5 text-center">Detail Pemohon</th>

                  <th className="p-5 text-center">Permintaan Informasi</th>
                  <th className="p-5 text-center uppercase">Berkas</th>
                  <th className="p-5 text-center">Update Status</th>
                  <th className="p-5 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="overflow-auto">
                {isLoading ? (
                  // SKELETON LOADING STATE
                  [...Array(5)].map((_, index) => (
                    <tr
                      key={index}
                      className="animate-pulse overflow-auto border-b border-gray-100"
                    >
                      <td className="p-5">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-100 rounded w-24"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-10 w-10 bg-gray-100 rounded-full mx-auto"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-10 bg-gray-100 rounded-xl w-32"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-10 bg-gray-100 rounded-xl w-24 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {data.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr className="border-b hover:bg-gray-100 border-gray-100 hover:bg-red-50/20 transition-all duration-200">
                          {/* Waktu & Tiket */}
                          <td className="p-5 align-top w-44">
                            <div className="font-bold text-red-600 text-[11px] mb-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 inline-block shadow-sm">
                              {item.ticketNumber}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono leading-relaxed mt-2 uppercase tracking-tight">
                              {new Date(item.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          </td>

                          {/* Pemohon */}
                          <td className="p-5 align-top w-64">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                <FaUser className="text-gray-500 text-xs" />
                              </div>
                              <div>
                                <p className="font-bold text-[13px] text-gray-900 leading-none">
                                  {item.nama}
                                </p>
                                <p className="text-[10px] text-red-600 mt-1.5 font-bold uppercase">
                                  {mapEnum.JenisPemohon[item.jenisPemohon] ||
                                    item.jenisPemohon}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1.5 border-l-2 border-gray-200 pl-4 ml-4">
                              <p className="text-[11px] text-gray-600 font-medium">
                                {item.pekerjaan}
                              </p>
                              <a
                                href={formatWA(item.telepon)}
                                target="_blank"
                                className="text-[10px] font-black text-green-600 flex items-center gap-2 hover:bg-green-600 hover:text-white transition-all bg-green-50 px-3 py-1 rounded-full border border-green-200 w-fit"
                              >
                                <FaWhatsapp size={12} /> WHATSAPP
                              </a>
                            </div>
                          </td>

                          {/* Rincian (No Truncate) */}
                          <td className="p-5 align-top min-w-[320px]">
                            <div className="mb-4">
                              <span className="text-[9px] font-black text-gray-300 uppercase block mb-2 tracking-widest">
                                Informasi:
                              </span>
                              <p className="text-[12px] text-gray-800 font-medium leading-relaxed break-words whitespace-pre-wrap">
                                {item.rincianInformasi || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                              <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">
                                Tujuan:
                              </span>
                              <p className="text-[11px] text-gray-600 italic leading-relaxed break-words whitespace-pre-wrap">
                                "{item.tujuanPenggunaan || "-"}"
                              </p>
                            </div>
                          </td>

                          {/* Lampiran */}
                          <td className="p-5 align-top text-center">
                            {item.dokumenUrl ? (
                              <a
                                href={`${baseUrl}/form/file/download?id=${item.ticketNumber}`}
                                target="_self"
                                className="flex flex-col items-center gap-2 group"
                              >
                                <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg group-hover:bg-red-700 transition-all group-active:scale-90">
                                  <FaFileDownload size={16} />
                                </div>
                                <span className="text-[9px] font-black text-red-600 mt-1">
                                  UNDUH
                                </span>
                              </a>
                            ) : (
                              <div className="flex flex-col items-center opacity-20">
                                <FaFileDownload size={16} />
                                <span className="text-[9px] font-black mt-1 uppercase">
                                  Tidak ada lampiran
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Status Update (Select) */}
                          <td className="p-5 align-top">
                            <div className="flex flex-col gap-3">
                              <select
                                disabled={isUpdating[item.id]}
                                // Jika item.status null atau undefined, gunakan string kosong agar match dengan option "Belum ditentukan"
                                value={item.status || ""}
                                onChange={(e) =>
                                  handleStatusChange(item.id, e.target.value)
                                }
                                className={`text-[11px] font-black px-4 py-2.5 rounded-xl border-2 outline-none transition-all 
    ${isUpdating[item.id] ? "opacity-50 cursor-not-allowed" : "cursor-pointer focus:ring-2"}
    ${mapEnum.StatusTicket[item.status]?.color || "bg-gray-100 border-gray-300 text-gray-500"}`}
                              >
                                {/* Opsi tambahan jika data status masih null */}
                                {!item.status && (
                                  <option
                                    value=""
                                    className="bg-white text-gray-400 font-bold"
                                  >
                                    Belum diverifikasi
                                  </option>
                                )}

                                {Object.keys(mapEnum.StatusTicket).map(
                                  (key) => (
                                    <option
                                      key={key}
                                      value={key}
                                      className="bg-white text-gray-800 font-bold"
                                    >
                                      {mapEnum.StatusTicket[key].label}
                                    </option>
                                  ),
                                )}
                              </select>
                              <div className="flex items-center gap-2 px-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                                  {/* Gunakan variabel bantuan atau logical AND untuk memastikan label ada */}
                                  {item.caraMemperoleh
                                    ? `Cara memperoleh Dikirim Via ${mapEnum.CaraMemperoleh[item.caraMemperoleh] || item.caraMemperoleh}`
                                    : "Cara memperoleh belum ditentukan"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Aksi */}
                          <td className="p-5 align-top">
                            <div className="flex flex-col gap-2">
                              <button
                                disabled={isUpdating[item.id]} // Nonaktifkan saat sedang loading
                                onClick={() => handleEditNote(item)} // Kirim seluruh objek 'item'
                                className={`flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-600 border-2 border-amber-100 rounded-xl hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm font-bold text-[10px] ${
                                  isUpdating[item.id]
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
                              >
                                <FaStickyNote /> Edit Catatan
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border-2 border-red-100 rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm font-bold text-[10px]"
                              >
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Admin Log Row */}
                        <tr className="bg-gray-50/40">
                          <td
                            colSpan="6"
                            className="px-8 py-4 border-b border-gray-200"
                          >
                            <div className="flex items-start gap-4 bg-white/60 p-4 rounded-xl border border-gray-100 shadow-sm">
                              <div className="flex items-center gap-2 shrink-0">
                                <FaPaperPlane
                                  className="text-red-500"
                                  size={12}
                                />
                                <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">
                                  Catatan:
                                </span>
                              </div>
                              <div className="flex-1 text-[12px] text-gray-700 leading-relaxed font-semibold">
                                {item.catatanAdmin ? (
                                  <span className="whitespace-pre-wrap break-words">
                                    {item.catatanAdmin}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic font-medium tracking-tight">
                                    Belum ada catatan tindak lanjut. Gunakan
                                    tombol 'Catatan' untuk memperbarui
                                    perkembangan berkas ini.
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </>
                )}
              </tbody>
            </table>

            {searchTerm === "" && (
              <div className="flex items-center justify-between p-6 bg-white border-t border-gray-100">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Halaman {pagination.currentPage} dari{" "}
                    {pagination.totalPages}
                  </p>
                  <p className="text-xs text-gray-500 font-bold uppercase">
                    Total Data ({pagination.totalData})
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.currentPage === 1 || isLoading}
                    onClick={() => fetchData(pagination.currentPage - 1)}
                    className="px-4 py-2 text-xs font-bold bg-gray-100 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 transition-all"
                  >
                    SEBELUMNYA
                  </button>
                  <button
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      isLoading
                    }
                    onClick={() => fetchData(pagination.currentPage + 1)}
                    className="px-4 py-2 text-xs font-bold bg-gray-100 rounded-lg hover:bg-red-600 hover:text-white disabled:opacity-50 transition-all"
                  >
                    SELANJUTNYA
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {data.length === 0 && !isLoading && (
            <div className="py-32 text-center bg-gray-50/30">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-gray-100 rotate-12">
                <FaSearch className="text-gray-200 text-4xl -rotate-12" />
              </div>
              <h3 className="text-gray-800 font-black text-xl">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2 font-medium">
                Silakan periksa kembali nomor tiket yang Anda masukkan atau muat
                ulang seluruh data.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchData();
                  setDateFilter("all");
                  setPagination({});
                  setStatusFilter("all");
                }}
                className="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
              >
                Muat Ulang Data
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PermohonanKeberatan;
