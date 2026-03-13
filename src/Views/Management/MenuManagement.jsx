import { Archive, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const MenuManagement = () => {
  const [showManagementSubmenu, setShowManagementSubmenu] = useState(true);

  const managementSubmenu = [
    { name: "Permohonan Informasi Publik", href: "/pengaduan/permohonan-informasi" },
    { name: "Pengajuan Keberatan", href: "/pengaduan/pengajuan-keberatan" },
   
  ];

  return (
    <div className="space-y-4">
    
      <div
        onClick={() => setShowManagementSubmenu(!showManagementSubmenu)}
       className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-red-100 transition flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <p className="text-red-600">
            <Archive />
          </p>
          <span className="font-semibold">Data Master</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform ${
            showManagementSubmenu ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {showManagementSubmenu && (
        <div className="ml-6 space-y-2">
          {managementSubmenu.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="cursor-pointer border-b space-x-2 p-2 rounded-lg hover:bg-red-100 transition flex justify-between items-center"
            >
              <div className="flex justify-between  items-center w-full">
                <span className="font-semibold">{item.name}</span>
                <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
