import React, { useEffect, useState } from "react";
import Container from "./components/container";
import { SidebarProvider } from "./components/ui/sidebar";
import SidebarMenus from "./components/SidebarMenu";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import useSession from "./hooks/use-session";
import Loading from "./components/Loading";
import { CircleFadingArrowUp } from "lucide-react";
import Headers from "./components/Headers";
import Dashboard from "./Views/Dashboard/Dashboard";
import BottomNavigation from "./components/BottomNavigation";

const Layout = () => {
  const { loading, user } = useSession();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Pantau posisi scroll
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

  // Fungsi scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="w-full gap-4 hidden md:flex">
        <SidebarMenus />
        <div className="flex-1 relative">
          <Navbar />
          <Container>
            <Outlet />
          </Container>

          {/* Tombol Scroll to Top */}
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

      <div className="md:hidden lg:hidden block w-full">
        <Navbar />

          {/* <Dashboard /> */}
        <Container>
          <Outlet />
        </Container>
        <BottomNavigation />
      </div>
    </SidebarProvider>
  );
};

export default Layout;
