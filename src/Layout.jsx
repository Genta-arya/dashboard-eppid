import React, { useEffect, useState } from "react";
// Import useLocation dari react-router-dom
import { Outlet, useLocation } from "react-router-dom"; 
import Container from "./components/container";
import { SidebarProvider } from "./components/ui/sidebar";
import SidebarMenus from "./components/SidebarMenu";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import useSession from "./hooks/use-session";
import Loading from "./components/Loading";
import { CircleFadingArrowUp } from "lucide-react";
import BottomNavigation from "./components/BottomNavigation";

const Layout = () => {
  const { loading, user } = useSession();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Ambil informasi lokasi path saat ini
  const location = useLocation();

  // Logika untuk mengecek apakah Navbar harus disembunyikan
  // Navbar akan sembunyi jika path tepat di "/"
  const hideNavbar = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <SidebarProvider>
      {/* --- Tampilan Desktop (MD ke atas) --- */}
      <div className="w-full gap-4 hidden md:flex">
        <SidebarMenus />
        <div className="flex-1 relative">
          {/* Kondisi: Hanya tampil jika bukan di path "/" */}
          {!hideNavbar && <Navbar />}
          
          <Container>
            <Outlet />
          </Container>

          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-800 transition"
              aria-label="Scroll to Top"
            >
              <CircleFadingArrowUp className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* --- Tampilan Mobile (MD ke bawah) --- */}
      <div className="md:hidden lg:hidden block w-full">
        {/* Kondisi: Hanya tampil jika bukan di path "/" */}
        {!hideNavbar && <Navbar />}

        <Container>
          <Outlet />
        </Container>
        
        {/* BottomNavigation biasanya juga ikut disembunyikan jika path "/" 
            Jika ingin sembunyi juga, gunakan: {!hideNavbar && <BottomNavigation />} */}
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

export default Layout;