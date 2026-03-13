import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentikasi from "./Views/Authentikasi/Authentikasi";
import Dashboard from "./Views/Dashboard/Dashboard";

import HalamanNotFound from "./components/HalamanNotFound";
import Layout from "./Layout";

import Management from "./Views/Management/Management";

import { Toaster } from "sonner";

import Setting from "./Views/Setting/Setting";
import PermohonanInformasi from "./Views/Management/PermohonanInformasi";
import PermohonanKeberatan from "./Views/Management/PermohonanKeberatan";


const RouteApp = () => {
  return (
    <Router>
      <Routes>
        {/* Route tanpa Layout */}
        <Route path="/login" element={<Authentikasi />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Pengaduan" element={<Management />} />
          <Route path="/pengaduan/permohonan-informasi" element={<PermohonanInformasi />} />
          <Route path="pengaduan/pengajuan-keberatan" element={<PermohonanKeberatan/>} />

          <Route path="/setting" element={<Setting />} />
        </Route>
        <Route path="*" element={<HalamanNotFound />} />
      </Routes>
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        duration={3000}
      />
    </Router>
  );
};

export default RouteApp;
