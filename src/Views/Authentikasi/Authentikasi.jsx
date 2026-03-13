import { ServiceSessions } from "@/Services/Auth/Auth.services";
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Authentikasi = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Autentikasi";
  }, []);

  useEffect(() => {
    const secret = searchParams.get("secret");
    if (!secret) {
      toast.error("Silahkan loigin terlebih dahulu.");
      window.location.href = ("https://presensi.kpu-sekadau.my.id/");
      return;
    }

    const verifySecret = async () => {
      try {
        const response = await ServiceSessions(secret);
        const data = response.data;

        if (data.token) {
          localStorage.setItem("token", data.token);
          toast.success("Login berhasil, Selamat datang!");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        toast.error("Autentikasi gagal. Silakan coba lagi.");
      }
    };

    if (secret) {
      verifySecret();
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#8F0D0D", borderTopColor: "transparent" }}
        ></div>

        <p className="font-medium" style={{ color: "#8F0D0D" }}>
          Memverifikasi autentikasi...
        </p>
      </div>
    </div>
  );
};

export default Authentikasi;
