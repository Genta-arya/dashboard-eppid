import { createRoot } from "react-dom/client";
import "./index.css";
import RouteApp from "./Route";
import "leaflet/dist/leaflet.css";
import { HelmetProvider } from "react-helmet-async";
createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <RouteApp />
  </HelmetProvider>
);
