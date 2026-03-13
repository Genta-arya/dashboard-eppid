import React from "react";
import MenuManagement from "./MenuManagement";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Management = () => {
  return (
    <>
      <Helmet>
        <title>Management Pengaduan - e-PPID KPU Kabupaten Sekadau</title>
      </Helmet>
      <MenuManagement />
    </>
  );
};

export default Management;
