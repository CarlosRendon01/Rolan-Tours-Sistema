import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useResponsive } from "../../../utils/useResponsive";
import "./PrincipalComponente.css";

/**
 * Componente Principal que contiene Sidebar y Navbar
 * Este componente será reutilizable en todas las páginas del sistema
 * Ahora con manejo responsive mejorado y control del botón hamburguesa
 */
const PrincipalComponente = ({ children }) => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [sidebarHoverExpandido, setSidebarHoverExpandido] = useState(false);
  const responsive = useResponsive();

  // Manejo inteligente del estado inicial del sidebar
  useEffect(() => {
    if (responsive.esMovil) {
      // En móvil, el sidebar empieza cerrado
      setSidebarAbierto(false);
    } else if (responsive.esTablet) {
      // En tablet, puede empezar cerrado o abierto dependiendo del espacio
      setSidebarAbierto(responsive.ancho > 900);
    } else {
      // En desktop, empieza colapsado (solo iconos) por defecto
      setSidebarAbierto(false);
    }
  }, [responsive.esMovil, responsive.esTablet, responsive.ancho]);

  // Cerrar sidebar automáticamente cuando se redimensiona a móvil
  useEffect(() => {
    if (responsive.esMovil && sidebarAbierto) {
      setSidebarAbierto(false);
    }
  }, [responsive.esMovil]);

  // Detectar cuando el sidebar está expandido por hover
  useEffect(() => {
    const detectarHoverSidebar = () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const tieneHoverExpandido = sidebar.classList.contains('hover-expandido');
        setSidebarHoverExpandido(tieneHoverExpandido);
      }
    };

    // Observar cambios en las clases del sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      const observer = new MutationObserver(detectarHoverSidebar);
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // Función para cerrar sidebar solo cuando se hace click fuera del sidebar
  const cerrarSidebar = (event) => {
    // Solo cerrar si el click no es en el sidebar o en el botón hamburguesa
    if (responsive.esMovil || responsive.esTablet) {
      const sidebar = document.querySelector('.sidebar');
      const hamburguesa = document.querySelector('.btn-hamburguesa');
      
      if (sidebar && !sidebar.contains(event.target) && 
          hamburguesa && !hamburguesa.contains(event.target)) {
      setSidebarAbierto(false);
      }
    }
  };

  // Determinar clase de contenido según el dispositivo y estado del sidebar
  const determinarClaseContenido = () => {
    if (responsive.esMovil || responsive.esTablet) {
      return "ancho-completo";
    }
    
    // En desktop, determinar según hover y estado del sidebar
    if (sidebarHoverExpandido) {
      return "sidebar-hover-expandido";
    }
    
    return sidebarAbierto ? "con-sidebar" : "ancho-completo";
  };

  return (
    <div className="principal-componente">
      {/* Sidebar */}
      <Sidebar 
        estaAbierto={sidebarAbierto} 
        setEstaAbierto={setSidebarAbierto}
      />
      
      {/* Navbar - Ahora recibe la función para controlar el sidebar */}
      <Navbar 
        sidebarAbierto={sidebarAbierto}
        setSidebarAbierto={setSidebarAbierto} // Nueva prop para controlar el sidebar
        responsive={responsive}
      />
      
      {/* Área de contenido principal */}
      <div 
        className={`contenido-principal ${determinarClaseContenido()}`}
        onClick={cerrarSidebar} // Cerrar sidebar al hacer click en el contenido en móvil/tablet
      >
        <main className="contenido-pagina">
          {React.cloneElement(children, { 
            responsive, 
            cerrarSidebar,
            sidebarAbierto 
          })}
        </main>
      </div>
    </div>
  );
};

export default PrincipalComponente;