import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { Menu } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const [openPengaduan, setOpenPengaduan] = useState(false);

  const navItems = [
    { label: "Beranda", icon: <Home size={20} />, path: "/" },
    { label: "Menu", icon: <Menu size={20} />, action: "menu" },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 shadow-md z-50">
        {navItems.map((item, i) => (
          <button
            key={i}
            onClick={() => {
              if (item.action === "menu") {
                setOpenMenu(true);
              } else {
                navigate(item.path);
              }
            }}
            className={`flex flex-col items-center text-xs ${
              location.pathname === item.path
                ? "text-[#8F0D0D]"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenMenu(false)}
        ></div>
      )}

      {/* Sidebar Full Screen */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ${
          openMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-[#8F0D0D]">Menu</h2>

          <button
            onClick={() => setOpenMenu(false)}
            className="text-2xl text-[#8F0D0D]"
          >
            ✕
          </button>
        </div>

        {/* Menu List */}
        <div className="p-4 space-y-4">
          {/* Pengaduan */}
          <div>
            <button
              onClick={() => setOpenPengaduan(!openPengaduan)}
              className="font-semibold text-[#8F0D0D]"
            >
              Pengaduan
            </button>

            {openPengaduan && (
              <div className=" flex flex-col items-start ml-4 gap-2 mt-3 w-full">
                <button
                  onClick={() => {
                    navigate("/pengaduan/permohonan-informasi");
                    setOpenMenu(false);
                  }}
                  className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition "
                >
                  Permohonan Informasi Publik
                </button>

                <button
                  onClick={() => {
                    navigate("/pengaduan/pengajuan-keberatan");
                    setOpenMenu(false);
                  }}
                  className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition "
                >
                  Pengajuan Keberatan
                </button>
              </div>
            )}
          </div>

          {/* Setting */}
          <button
            onClick={() => {
              navigate("/setting/notifikasi");
              setOpenMenu(false);
            }}
            className="font-semibold text-[#8F0D0D]"
          >
            Notifikasi Whatsapp admin
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNavigation;
