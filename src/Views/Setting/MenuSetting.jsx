import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Settings, 
  ChevronRight, 
  MessageSquare, 
  BellRing,
  Cog
} from "lucide-react";

const MenuSetting = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const settingItems = [
    { 
      name: "Notifikasi Whatsapp", 
      href: "/setting/notifikasi",
      icon: <MessageSquare size={15} />,
      desc: "Konfigurasi API & Nomor Admin"
    },
  ];

  return (
    <div className="px-2 py-2">
      {/* Label Kategori */}
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
        Preferences
      </p>

      {/* Parent Menu Card */}
      <div className={`group rounded-[1.5rem] transition-all duration-500 ${
        isOpen ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100" : ""
      }`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] transition-all ${
            isOpen ? "text-red-600" : "text-slate-600 hover:bg-white hover:shadow-lg"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl transition-all duration-500 ${
              isOpen 
                ? "bg-red-600 text-white shadow-lg shadow-red-200" 
                : "bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-500"
            }`}>
              <Settings size={18} />
            </div>
            <div className="text-left">
              <span className="text-sm font-black tracking-tight block">Pengaturan</span>
              {!isOpen && <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Sistem & Notifikasi</span>}
            </div>
          </div>
          
          <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-300"}`}>
            <ChevronRight 
              size={14} 
              className={`transform transition-transform duration-500 ${isOpen ? "rotate-90" : ""}`} 
            />
          </div>
        </button>

        {/* Submenu Area */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-[200px] opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-3 space-y-1">
            {settingItems.map((item, idx) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={idx}
                  to={item.href}
                  className={`relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group/item ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                      : "text-slate-500 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`p-2 rounded-xl transition-colors ${
                    isActive ? "bg-white/10 text-red-400" : "bg-slate-50 text-slate-400 group-hover/item:bg-white group-hover/item:text-red-500"
                  }`}>
                    {item.icon}
                  </div>

                  {/* Text Container */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-black tracking-tight leading-none">
                      {item.name}
                    </span>
                    <span className={`text-[9px] mt-1 font-medium truncate ${
                      isActive ? "text-slate-400" : "text-slate-400 group-hover/item:text-red-300"
                    }`}>
                      {item.desc}
                    </span>
                  </div>

                  {/* Active Indicator baris kanan */}
                  {isActive && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSetting;