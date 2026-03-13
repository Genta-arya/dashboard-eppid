import axios from "axios";

// API Presensi

export const type = "locals";
export const baseUrl = `${type === "local" ? "http://localhost:8080/api" : "https://server-ppid.vercel.app/api"}`;
export const apiPresensi = axios.create({
  baseURL: "https://api-presensi.kpu-sekadau.my.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// API PPID (contoh)

export const apiPPID = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
