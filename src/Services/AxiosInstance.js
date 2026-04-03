import axios from "axios";

// API Presensi (Tetap seperti semula)
export const type = "production"; // Ubah ke 'local' jika sedang dev
export const baseUrl = `${type === "local" ? "http://localhost:8080" : "https://server-ppid.vercel.app"}`;

export const apiPresensi = axios.create({
  baseURL: "https://api-presensi.kpu-sekadau.my.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// API PPID (Dengan Tambahan X-API-KEY)
export const apiPPID = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
    // MASUKKAN KEY RAHASIA DISINI
    // Pastikan nilainya sama persis dengan X_API_KEY di .env backend
    "x-api-key": "PPID_KPU_SEKADAU_SECRET_GENTA", 
  },
});

// Tambahan: Interceptor (Opsional tapi Bagus)
// Jika kamu ingin menambahkan Token Auth secara dinamis nantinya
apiPPID.interceptors.request.use(
  (config) => {
    // Kamu bisa tambah logika token disini jika sudah ada sistem login
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);