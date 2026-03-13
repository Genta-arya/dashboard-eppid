import { ArrowLeftCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Navigation = ({ text }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Jika ada riwayat sebelumnya, navigasi ke -1, kalau tidak ke "/"
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex mt-4 lg:flex-row md:flex-row flex-col justify-between md:items-center gap-2 lg:items-center">
      <div
        className="flex items-center  gap-2 cursor-pointer text-sm font-semibold hover:opacity-80"
        onClick={handleBack}
      >
        <ArrowLeftCircle />
        <p>Kembali</p>
      </div>
    </div>
  );
};

export default Navigation;
