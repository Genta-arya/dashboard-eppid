import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Home, Settings, Archive, File } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menus = [
  { label: "Dashboard", icon: <Home />, href: "/" },
  
  { label: "Management Pengaduan", icon: <Archive />, href: "/pengaduan" },
  { label: "Log", icon: <File />, href: "/log" },
  { label: "Setting", icon: <Settings />, href: "/setting" },
];
const SidebarMenus = () => {
  const { pathname } = useLocation();
  if (
    pathname.includes("/pengaduan/") ||
    pathname.includes("/setting/") 
  ) {
    return null;
  }

  return (
    <Sidebar className="group peer bg-white border-t-[12px] border-t-red-500  w-20 hover:w-60 transition-all duration-300 ease-in-out">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((menu, index) => (
                <SidebarMenuItem className="mt-5" key={index}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={menu.href}
                      className={`flex items-center p-2 transition-all duration-300 ease-in-out group relative ${
                        pathname === menu.href ? "bg-red-200" : ""
                      }`}
                    >
                      <div className="flex justify-center items-center w-10 h-10">
                        {menu.icon}
                      </div>

                      <span className="absolute left-14 font-bold hidden group-hover:inline-block">
                        {menu.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarMenus;
