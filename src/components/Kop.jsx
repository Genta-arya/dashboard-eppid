import React from "react";
import logoKiri from "@/assets/icons.png"; 
import logoKanan from "@/assets/icon_kalbar.png"; 

const Kop = () => {
  return (
    <div className=" p-4 bg-white text-black">
      <div className="flex items-center justify-between">
        {/* Logo kiri */}
        <img src={logoKiri} alt="Logo Kiri" className="w-20 object-contain" />

        {/* Teks tengah */}
        <div className="text-center w-full px-4 ">
          <h2 className="text-sm font-medium">
            PEMERINTAH PROVINSI KALIMANTAN BARAT
          </h2>
          <h1 className="text-xl font-bold">SMK NEGERI 2 KETAPANG</h1>
          <p className="text-xs">
            Jalan Gatot Subroto Kabupaten Ketapang, Provinsi Kalimantan Barat,
            Kode Pos 78813 <br />
            <span className="underline decoration-red-500">Telepon</span> /
            Faksimile (0534) 34885 NSS. 401130607004 NPSN. 30103487 <br />
            Pos-el{" "}
            <a
              href="mailto:smkn2ktp@gmail.com"
              className="text-blue-600 underline"
            >
              smkn2ktp@gmail.com
            </a>
            , Laman <span className="underline">www.smkn2ketapang.sch.id</span>
          </p>
        </div>

        {/* Logo kanan */}
        <img src={logoKanan} alt="Logo Kanan" className="w-16 object-contain" />
      </div>

      {/* Garis bawah double */}
      <div className="mt-2 border-t-4 border-black relative">
        <div className="absolute top-1 w-full border-t border-black"></div>
      </div>
    </div>
  );
};

export default Kop;
