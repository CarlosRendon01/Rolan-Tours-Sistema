import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useResponsive } from "../../../utils/useResponsive";
import "./PrincipalComponente.css";

const PrincipalComponente = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [sidebarHoverExpandido, setSidebarHoverExpandido] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    if (responsive.esMovil) {
      setSidebarAbierto(false);
    } else if (responsive.esTablet) {
      setSidebarAbierto(responsive.ancho > 900);
    } else {
      setSidebarAbierto(false);
    }
  }, [responsive.esMovil, responsive.esTablet, responsive.ancho]);

  useEffect(() => {
    const detectarHoverSidebar = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const tieneHoverExpandido = sidebar.classList.contains('hover-expandido');
        setSidebarHoverExpandido(tieneHoverExpandido);
      }
    };

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const observer = new MutationObserver(detectarHoverSidebar);
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class']
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const cerrarSidebar = (event) => {
    if ((responsive.esMovil || responsive.esTablet) &&
      !event.target.closest('.sidebar') &&
      !event.target.closest('.btn-hamburguesa')) {
      setSidebarAbierto(false);
    }
  };

  const determinarClaseContenido = () => {
    if (responsive.esMovil || responsive.esTablet) {
      return "ancho-completo";
    }

    if (sidebarHoverExpandido) {
      return "sidebar-hover-expandido";
    }

    return sidebarAbierto ? "con-sidebar" : "ancho-completo";
  };

  return (
    <div className="principal-componente">
      <Sidebar
        estaAbierto={sidebarAbierto}
        setEstaAbierto={setSidebarAbierto}
      />

      <Navbar
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto}
        responsive={responsive}
      />

      <div
        className={`contenido-principal ${determinarClaseContenido()}`}
        onClick={cerrarSidebar}
      >
        <main className="contenido-pagina">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PrincipalComponente;