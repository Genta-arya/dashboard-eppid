import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import CountUp from "react-countup";
import { 
  Users, Ticket, BrainCircuit, Clock, Search, Calendar, 
  MapPin, ChevronRight, TrendingUp, Globe, Terminal, X, 
  Sparkles, Zap, Info, ShieldAlert, ArrowUpRight 
} from "lucide-react";

import Container from "@/components/container";
import Headers from "@/components/Headers";
import useUserStore from "@/lib/AuthZustand";
import Loading from "@/components/Loading";
import { getAllInsight, getAnalytics } from "@/Services/Auth/Analytic.services";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const Dashboard = () => {
  const { user } = useUserStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false); // State untuk Modal AI

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => (currentYear - 2) + i);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAnalytics(year);
      setAnalytics(response.data);
      setSelectedLocation(null);
      fetchAiInsight();
    } catch (error) {
      toast.error("Gagal sinkronisasi data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsight = async () => {
    setAiLoading(true);
    try {
      const res = await getAllInsight(year);
      if (!res.ready) {
        setTimeout(fetchAiInsight, 5000);
      } else {
        setAiInsight(res.insight);
        setAiLoading(false);
      }
    } catch (err) {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchAddress = async (lat, lng) => {
    setAddress("Mencari alamat...");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      setAddress(data.display_name);
    } catch (error) {
      setAddress("Gagal memuat alamat.");
    }
  };

  const formatLabel = (text) => {
    if (!text) return "Umum";
    if (text === "PERMINTAAN_INFORMASI") return "Permintaan Informasi";
    if (text === "KEBERATAN") return "Pengajuan Keberatan";
    return text.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const visitorTotal = analytics?.traffic_pengunjung?.reduce((a, b) => a + b.total, 0) || 0;
  const ticketTotal = analytics?.traffic_ticket?.reduce((a, b) => a + b.total, 0) || 0;
  const totalInformasi = analytics?.jenis_layanan?.find(l => l.type === "PERMINTAAN_INFORMASI")?._count || 0;
  const totalKeberatan = analytics?.jenis_layanan?.find(l => l.type === "KEBERATAN")?._count || 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <Helmet><title>Dashboard Intelligence | e-PPID</title></Helmet>
      <Headers user={user} />

      <Container>
        {loading ? (
          <div className="">
            <Loading />
          </div>
        ) : (
          <div className="pt-4 md:pt-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
            
            {/* Header & Filter */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  Intelligence Dashboard <Sparkles className="text-red-500 w-5 h-5 md:w-6 md:h-6 animate-pulse" />
                </h1>
                <p className="text-slate-500 font-medium mt-1 text-sm italic">Sistem Monitoring Pelayanan • Tahun {year}</p>
              </div>

              <div className="flex w-full md:w-auto items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex items-center px-4 text-slate-400 gap-2 border-r border-slate-100 font-black text-[10px] uppercase tracking-widest">
                  <Calendar size={16} /> Periode
                </div>
                <select 
                  className="flex-1 md:flex-none bg-transparent pl-3 pr-8 py-2 text-sm font-black text-blue-600 outline-none cursor-pointer appearance-none"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <button onClick={fetchData} className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-red-200 active:scale-95">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
              <StatCard label="Total Visitor" value={visitorTotal} icon={<Users size={20}/>} color="blue" />
              <StatCard label="Permohonan Informasi" value={totalInformasi} icon={<Info size={20}/>} color="indigo" />
              <StatCard label="Pengajuan Keberatan" value={totalKeberatan} icon={<ShieldAlert size={20}/>} color="red" />
              <StatCard label="Rerata Respon" value={analytics?.average_response_time || "0h"} isCountUp={false} icon={<Clock size={20}/>} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              {/* Left Column: Chart & AI Preview */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                <div className="bg-white p-5 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="text-blue-500 w-5 h-5" /> Tren Pelayanan & Trafik
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pengunjung</span></div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Permohonan</span></div>
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <Line 
                      data={{
                        labels: analytics?.traffic_pengunjung?.map(v => v.bulan) || [],
                        datasets: [
                          {
                            label: "Visitor",
                            data: analytics?.traffic_pengunjung?.map(v => v.total) || [],
                            borderColor: "#3b82f6",
                            backgroundColor: "rgba(59, 130, 246, 0.05)",
                            fill: true, tension: 0.4, borderWidth: 3, pointRadius: 3,
                          },
                          {
                            label: "Total Permohonan",
                            data: analytics?.traffic_ticket?.map(v => v.total) || [],
                            borderColor: "#ef4444",
                            backgroundColor: "transparent",
                            borderDash: [5, 5], tension: 0.4, borderWidth: 2, pointRadius: 3,
                          }
                        ]
                      }} 
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { borderDash: [5, 5], color: "#f1f5f9" }, beginAtZero: true }, x: { grid: { display: false } } } }} 
                    />
                  </div>
                </div>

                {/* AI INSIGHT PREVIEW - MINIMALIST */}
                <div className="bg-slate-950 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500"><BrainCircuit size={120} /></div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/40">
                        <Zap size={20} className="text-white" fill="white" />
                      </div>
                      <h3 className="text-lg font-black tracking-tight leading-none">AI Smart Insight</h3>
                    </div>
                    {aiLoading ? <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div> : 
                      <p className="text-sm leading-relaxed text-slate-300 italic font-medium line-clamp-2">"{aiInsight?.insight || 'Menganalisis data permohonan...'}"</p>
                    }
                    <button onClick={() => setShowAiModal(true)} className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95">Lihat detail <ChevronRight size={14}/></button>
                  </div>
                </div>
              </div>

              {/* Right Column: Maps & classified Table */}
              <div className="lg:col-span-4 space-y-6 md:space-y-8">
                {/* Sebaran Map */}
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2 px-2 text-md"><MapPin size={18} className="text-red-500" /> Lokasi Akses</h3>
                   <div className="h-60 rounded-3xl overflow-hidden border border-slate-50 relative z-0 shadow-inner">
                     <MapContainer center={[-2.5, 118]} zoom={4} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        {analytics?.visitor_locations?.map((loc, i) => (
                          <Marker key={i} position={[loc.latitude, loc.longitude]} eventHandlers={{ click: () => { setSelectedLocation(loc); fetchAddress(loc.latitude, loc.longitude); }}} >
                             <Popup><span className="font-bold">IP: {loc.ip}</span></Popup>
                          </Marker>
                        ))}
                     </MapContainer>
                   </div>
                   {selectedLocation && (
                     <div className="bg-slate-900 p-5 rounded-3xl text-white space-y-4 animate-in slide-in-from-top-4 relative border border-white/5 shadow-2xl">
                        <button onClick={() => setSelectedLocation(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X size={16}/></button>
                        <div className="flex gap-3 items-start">
                            <Globe size={18} className="text-blue-400 shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Alamat Terdeteksi</p>
                                <p className="text-[11px] leading-relaxed break-words whitespace-normal font-medium text-slate-200">{address || "Mencari alamat..."}</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-white/10 flex justify-between gap-4">
                            <div className="min-w-0"><p className="text-[9px] text-slate-500 font-bold uppercase truncate">IP Address</p><p className="text-xs font-mono text-emerald-400 font-black tracking-tighter">{selectedLocation.ip}</p></div>
                            <div className="min-w-0 text-left">
                                <p className="text-[9px] text-slate-500 font-bold uppercase truncate">Device/OS</p>
                                <div className="flex items-center gap-1 justify-end"><Terminal size={12} className="text-slate-500"/><p className="text-[10px] text-slate-300  w-24">{selectedLocation.userAgent}</p></div>
                            </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* CLASSIFIED RESPONSE TIME TABLE */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                   <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-md"><Clock size={18} className="text-indigo-500" /> Matriks Respons</h3>
                   <div className="space-y-4">
                      {analytics?.response_time_detail?.map((item, i) => {
                        const isInformasi = item.layanan === "PERMINTAAN_INFORMASI";
                        return (
                          <div key={i} className={`flex justify-between items-center p-4 rounded-2xl border-l-4 transition-all group ${isInformasi ? 'bg-indigo-50/50 border-indigo-500' : 'bg-rose-50/50 border-rose-500'}`}>
                             <div className="min-w-0">
                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isInformasi ? 'text-indigo-400' : 'text-rose-400'}`}>Tipe Layanan</p>
                                <span className="text-xs font-bold text-slate-700 truncate block">{formatLabel(item.layanan)}</span>
                             </div>
                             <span className={`text-sm font-black italic shrink-0 ml-4 ${isInformasi ? 'text-indigo-600' : 'text-rose-600'}`}>{item.avg_response}</span>
                          </div>
                        );
                      })}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* MODAL AI INSIGHT - FULL ANALYTICS */}
      {showAiModal && aiInsight && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-xl text-white"><Zap size={20} fill="currentColor" /></div>
                <h2 className="font-black text-slate-800 text-xl tracking-tight">Hasil Analisis AI Gemini</h2>
              </div>
              <button onClick={() => setShowAiModal(false)} className="p-2 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <section>
                <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] mb-3">Ringkasan Utama</h4>
                <p className="text-slate-700 leading-relaxed font-medium italic">"{aiInsight.insight}"</p>
              </section>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Users size={16} /> Tren Pengunjung</h4>
                  <p className="text-xs text-blue-700 leading-relaxed">{aiInsight.trend_pengunjung}</p>
                </div>
                <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2"><Ticket size={16} /> Tren Layanan</h4>
                  <p className="text-xs text-purple-700 leading-relaxed">{aiInsight.trend_layanan}</p>
                </div>
              </div>

              <section className="bg-slate-900 p-6 rounded-3xl text-white">
                <h4 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] mb-4">Rekomendasi Strategis</h4>
                <ul className="space-y-4">
                  {aiInsight.rekomendasi?.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                      <span className="shrink-0 w-5 h-5 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center font-bold text-[10px] border border-red-500/30">{idx + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setShowAiModal(false)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg">Tutup Laporan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon, color, isCountUp = true, suffix = "" }) => {
    const themes = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        red: "bg-red-50 text-red-600 border-red-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100"
    };

    return (
        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${themes[color]} border transition-all duration-500 group-hover:scale-110 shadow-sm`}>
                    {icon}
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter leading-none italic">
                    {isCountUp ? <CountUp end={value} duration={2} separator="," suffix={suffix} decimals={suffix === "%" ? 1 : 0} /> : value}
                </h2>
            </div>
        </div>
    );
};

export default Dashboard;