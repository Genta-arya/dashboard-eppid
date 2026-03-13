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
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Container from "@/components/container";
import Headers from "@/components/Headers";
import useUserStore from "@/lib/AuthZustand";

import { Helmet } from "react-helmet-async";

import { toast } from "sonner";
import Loading from "@/components/Loading";

import {
  FaUsers,
  FaTicketAlt,
  FaBrain,
  FaClock,
  FaMapMarkedAlt,
} from "react-icons/fa";

import { getAllInsight, getAnalytics } from "@/Services/Auth/Analytic.services";
import CountUp from "react-countup";
import { Search } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // <-- dan ini
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const { user } = useUserStore();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAnalytics(year);
      setAnalytics(response.data);
      setSelectedLocation(null);

      fetchAiInsight();
    } catch (error) {
      toast.error("Gagal memuat data analitik.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAiInsight = async () => {
    setAiLoading(true);
    try {
      const res = await getAllInsight(year); // endpoint baru /ai-insight-status

      if (!res.ready) {
        setTimeout(fetchAiInsight, 5000);
      } else {
        setAiInsight(res.insight);
        setAiLoading(false);
      }
    } catch (err) {
      console.error("Gagal fetch AI insight:", err);
      setAiLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Dashboard - e-PPID KPU Kabupaten Sekadau";
    fetchData();
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      );

      const data = await res.json();
      setAddress(data.display_name);
    } catch (error) {
      console.error("Gagal mengambil alamat", error);
    }
  };

  const formatLabel = (text) => {
    if (!text) return "Belum Diproses";

    return text
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // =========================
  // STAT
  // =========================

  const visitorTotal =
    analytics?.traffic_pengunjung?.reduce((a, b) => a + b.total, 0) || 0;

  const ticketTotal =
    analytics?.traffic_ticket?.reduce((a, b) => a + b.total, 0) || 0;

  const conversionRate =
    visitorTotal > 0 ? ((ticketTotal / visitorTotal) * 100).toFixed(1) : 0;

  // =========================
  // CHART OPTIONS
  // =========================

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i,
  );
  // =========================
  // CHART DATA
  // =========================

  const sortedVisitorData =
    analytics?.traffic_pengunjung?.slice().sort((a, b) => {
      const [y1, m1] = a.bulan.split("-").map(Number);
      const [y2, m2] = b.bulan.split("-").map(Number);
      return y1 === y2 ? m1 - m2 : y1 - y2;
    }) || [];

  const sortedTicketData =
    analytics?.traffic_ticket?.slice().sort((a, b) => {
      const [y1, m1] = a.bulan.split("-").map(Number);
      const [y2, m2] = b.bulan.split("-").map(Number);
      return y1 === y2 ? m1 - m2 : y1 - y2;
    }) || [];
  const visitorChart = {
    labels: sortedVisitorData.map((v) => v.bulan),
    datasets: [
      {
        label: "Pengunjung",
        data: sortedVisitorData.map((v) => v.total),
        borderWidth: 2,
        tension: 0.4,
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };

  const ticketChart = {
    labels: sortedTicketData.map((v) => v.bulan),
    datasets: [
      {
        label: "Ticket",
        data: sortedTicketData.map((v) => v.total),
        borderWidth: 2,
        tension: 0.4,
        borderColor: "#FF6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const layananChart = {
    labels: analytics?.jenis_layanan?.map((l) => formatLabel(l.type)) || [],
    datasets: [
      {
        data: analytics?.jenis_layanan?.map((l) => l._count) || [],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384AA", "#36A2EBAA"],
      },
    ],
  };
  return (
    <>
      <Helmet>
        <title>ePPID - Dashboard</title>
      </Helmet>

      <Headers user={user} />

      <Container>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* ================= KPI ================= */}
            <form
              className="flex gap-2 mb-4 items-center mt-4"
              onSubmit={(e) => {
                e.preventDefault(); // cegah reload halaman
                if (!year || isNaN(year)) {
                  toast.error("Tahun tidak boleh kosong!");
                  return;
                }
                fetchData();
              }}
            >
              <label className="font-semibold text-gray-700">Tahun</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full outline-none"
                value={year}
                onChange={(e) =>
                  setYear(e.target.value ? parseInt(e.target.value) : "")
                }
                placeholder="Cari berdasarkan tahun"
              />

              <button
                type="submit" // penting biar enter trigger
                className="bg-red-500 text-white px-3 py-1 rounded-full outline-none hover:bg-red-600"
              >
                <Search />
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white shadow rounded-xl p-5 flex gap-4">
                <FaUsers size={26} />

                <div>
                  <p className="text-sm text-gray-500">Total Pengunjung</p>
                  <h2 className="text-2xl font-bold">
                    <CountUp end={visitorTotal} duration={1.5} separator="," />
                  </h2>
                </div>
              </div>

              <div className="bg-white shadow rounded-xl p-5 flex gap-4">
                <FaTicketAlt size={26} />

                <div>
                  <p className="text-sm text-gray-500">
                    Total Pengaduan/Permintaan
                  </p>
                  <h2 className="text-2xl font-bold">
                    <CountUp end={ticketTotal} duration={1.5} separator="," />
                  </h2>
                </div>
              </div>

              <div className="bg-white shadow rounded-xl p-5 flex gap-4">
                <FaBrain size={26} />

                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <h2 className="text-2xl font-bold">
                    <CountUp
                      end={conversionRate}
                      duration={1.5}
                      decimals={1}
                      suffix="%"
                    />
                  </h2>
                </div>
              </div>

              <div className="bg-white shadow rounded-xl p-5 flex gap-4">
                <FaClock size={26} />

                <div>
                  <p className="text-sm text-gray-500">Rata-rata Respon</p>
                  <h2 className="text-xl font-bold">
                    {analytics?.average_response_time}
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow mt-8">
              <h2 className="font-semibold mb-4">Waktu Respon Layanan</h2>

              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-center text-gray-600">
                    <th className="py-2">Layanan</th>
                  
                    <th>Avg Respon</th>
                  </tr>
                </thead>

                <tbody>
                  {analytics?.response_time_detail?.map((item, i) => (
                    <tr key={i} className="border-b text-center">
                      <td>{formatLabel(item.layanan)}</td>
                 
                      <td className="font-semibold text-blue-600">
                        {item.avg_response}
                      </td>
                    </tr>
                  ))}

                  {analytics?.response_time_detail?.length === 0 && (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data layanan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= CHART ================= */}

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">Traffic Pengunjung</h2>

                <Line data={visitorChart} options={chartOptions} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="font-semibold mb-4">
                  Layanan Pengaduan/Permintaan{" "}
                </h2>

                <Line data={ticketChart} options={chartOptions} />
              </div>
            </div>

            {/* ================= PIE ================= */}

            <div className="bg-white p-6 rounded-xl flex justify-center flex-col shadow mt-8">
              <h2 className="font-semibold mb-4">Jumlah Permohonan Tahun {year}</h2>

              {analytics?.jenis_layanan?.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada data permohonan.
                </p>
              ) : (
                <div className="w-full">
                  <Bar
                    data={{
                      labels:
                        analytics?.jenis_layanan?.map((l) =>
                          formatLabel(l.type),
                        ) || [],
                      datasets: [
                        {
                          label: "Jumlah Permohonan ",
                          data:
                            analytics?.jenis_layanan?.map((l) => l._count) ||
                            [],
                          backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: { enabled: true },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                        x: {
                          ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 0,
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* ================= RESPONSE TIME ================= */}

            {/* ================= AI INSIGHT ================= */}

            <div className="bg-white p-6 rounded-xl shadow mt-8">
              <div className="flex items-center lg:flex-row flex-col  justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="https://img.freepik.com/premium-vector/gemini-logo-icon_1273375-853.jpg"
                    alt=""
                    className="w-8 rounded-full"
                  />
                  <h2 className="font-semibold text-lg">Analisis AI Gemini</h2>
                </div>
                <span className="text-xs text-gray-500 italic">
                  Diperbarui otomatis setiap 3 jam dalam 24 jam terakhir
                </span>
              </div>

              {aiLoading && <Loading />}

              {!aiLoading && !analytics?.ai_insight && (
                <p className="text-center text-gray-500 py-10">
                  Tidak ada data analisis AI.
                </p>
              )}

              {aiInsight && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold">Trend Pengunjung</h3>
                    <p>{aiInsight.trend_pengunjung}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Trend Layanan</h3>
                    <p>{aiInsight.trend_layanan}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Analisis Waktu Respon</h3>
                    <p>{aiInsight.analisis_waktu_respon}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Analisis Wilayah Pengunjung
                    </h3>
                    <p>{aiInsight.analisis_lokasi_pengunjung}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Insight Utama</h3>
                    <p>{aiInsight.insight}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Rekomendasi</h3>
                    <ul className="list-disc pl-5">
                      {aiInsight.rekomendasi?.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* ================= MAP ================= */}

            <div className="bg-white p-6 rounded-xl shadow mt-8">
              <div className="flex items-center gap-2 mb-4">
                <FaMapMarkedAlt />
                <h2 className="font-semibold">Peta Pengunjung</h2>
              </div>

              <MapContainer
                center={[-2.5, 118]}
                zoom={5}
                style={{ height: "400px", width: "100%", zIndex: 0 }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {analytics?.visitor_locations?.map((loc, i) => (
                  <Marker
                    key={i}
                    position={[loc.latitude, loc.longitude]}
                    eventHandlers={{
                      click: () => {
                        setSelectedLocation(loc);
                        fetchAddress(loc.latitude, loc.longitude);
                      },
                    }}
                  >
                    <Popup>{selectedLocation?.ip}</Popup>
                  </Marker>
                ))}
              </MapContainer>

              {selectedLocation && (
                <div className="mt-6 p-5 bg-gray-50 rounded-xl border">
                  <h3 className="font-semibold mb-3">Detail</h3>

                  <div className="grid w-full md:grid-cols-2 gap-4 text-sm items-center">
                    {/* Kolom 1 */}
                    <div>
                      <p className="text-gray-500">IP Address</p>
                      <p className="font-semibold">{selectedLocation.ip}</p>
                    </div>

                    {/* Kolom 2 (di ujung kanan) */}
                    <div className="text-right">
                      <p className="text-gray-500">Koordinat</p>
                      <p
                        className="font-semibold underline text-blue-600 cursor-pointer"
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`,
                            "_blank",
                          )
                        }
                      >
                        {selectedLocation.latitude},{" "}
                        {selectedLocation.longitude}
                      </p>
                    </div>

                    {/* Kolom 3 */}
                    <div>
                      <p className="text-gray-500">User Agent</p>
                      <p className="font-semibold break-all">
                        {selectedLocation.userAgent}
                      </p>
                    </div>

                    {/* Kolom 4 (di ujung kanan) */}
                    <div className="text-right">
                      <p className="text-gray-500">Waktu Akses</p>
                      <p className="font-semibold">
                        {new Date(selectedLocation.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Alamat full span */}
                    <div className="md:col-span-2">
                      <p className="text-gray-500">Alamat</p>
                      <p className="font-semibold">
                        {address || "Memuat alamat..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 p-5 bg-gray-50 rounded-xl border">
                <p className="text-gray-500">Catatan:</p>
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    Data lokasi berdasarkan IP, mungkin tidak selalu akurat.
                  </li>
                  <li>
                    Alamat akan memuat jika Anda mengklik pada marker di peta.
                  </li>
                </ul>
              </div>

              {selectedLocation && (
                <div
                  className="mt-4 text-center bg-red-100 text-black rounded-lg py-2 cursor-pointer"
                  onClick={() => setSelectedLocation(null)}
                >
                  <p className="font-bold">Tutup</p>
                </div>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
