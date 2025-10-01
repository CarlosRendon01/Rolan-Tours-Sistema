import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useResponsive } from "../../../utils/useResponsive";
import ModalNotificaciones from "./ModalNotificaciones";
import ModalPerfil from "./ModalPerfil";
import "./Navbar.css";

const Navbar = React.memo(({ 
  sidebarAbierto, 
  setSidebarAbierto,
  responsive, 
  onLogout, 
  onEditProfile, 
  userInfo 
}) => {
  // Estados principales
  const [desplegableAbierto, setDesplegableAbierto] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(true);
  const [logoRolanCargado, setLogoRolanCargado] = useState(true);
  const [modalNotificacionesAbierto, setModalNotificacionesAbierto] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);

  // Sistema de notificaciones con datos de ejemplo
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      tipo: 'mensaje',
      titulo: 'Nuevo mensaje de cliente',
      mensaje: 'Juan Pérez ha enviado una consulta sobre el tour de Oaxaca.',
      fecha: new Date(Date.now() - 5 * 60 * 1000),
      leida: false,
      datos: {
        'Cliente': 'Juan Pérez',
        'Tour': 'Oaxaca Cultural'
      }
    },
    {
      id: 2,
      tipo: 'alerta',
      titulo: 'Reservación cancelada',
      mensaje: 'La reservación #1234 ha sido cancelada por el cliente.',
      fecha: new Date(Date.now() - 15 * 60 * 1000),
      leida: false,
      datos: {
        'Reservación': '#1234',
        'Motivo': 'Cambio de planes'
      }
    },
    {
      id: 3,
      tipo: 'sistema',
      titulo: 'Actualización del sistema',
      mensaje: 'El sistema se actualizó correctamente a la versión 2.1.5.',
      fecha: new Date(Date.now() - 2 * 60 * 60 * 1000),
      leida: true
    }
  ]);

  // Referencias
  const refDesplegable = useRef(null);
  const refAvatarImg = useRef(null);
  const refLogoRolan = useRef(null);

  // Hook responsivo interno si no se pasa como prop
  const responsiveHook = useResponsive();
  const responsiveData = responsive || responsiveHook;

  // Información del usuario con fallbacks
  const usuario = useMemo(() => ({
    nombre: userInfo?.nombre || "Fabiola Hernández",
    rol: userInfo?.rol || "Administrador",
    email: userInfo?.email || "fabiola.hernandez@rolantours.com",
    avatar: userInfo?.avatar || "/assets/Usuario.png",
    iniciales: userInfo?.iniciales || "FH"
  }), [userInfo]);

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = useMemo(() => {
    return notificaciones.filter(notif => !notif.leida).length;
  }, [notificaciones]);

  // Función para alternar el sidebar
  const alternarSidebar = useCallback(() => {
    if (setSidebarAbierto) {
      setSidebarAbierto(!sidebarAbierto);
    }
  }, [sidebarAbierto, setSidebarAbierto]);

  // Funciones para manejar notificaciones
  const abrirModalNotificaciones = useCallback(() => {
    setModalNotificacionesAbierto(true);
  }, []);

  const cerrarModalNotificaciones = useCallback(() => {
    setModalNotificacionesAbierto(false);
  }, []);

  const marcarComoLeida = useCallback((id) => {
    setNotificaciones(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, leida: true } : notif
      )
    );
  }, []);

  const eliminarNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const marcarTodasComoLeidas = useCallback(() => {
    setNotificaciones(prev => 
      prev.map(notif => ({ ...notif, leida: true }))
    );
  }, []);

  const eliminarTodas = useCallback(() => {
    setNotificaciones([]);
  }, []);

  // Funciones para el modal de perfil
  const abrirModalPerfil = useCallback(() => {
    setModalPerfilAbierto(true);
    setDesplegableAbierto(false);
  }, []);

  const cerrarModalPerfil = useCallback(() => {
    setModalPerfilAbierto(false);
    setCargandoPerfil(false);
  }, []);

  // Funciones memoizadas
  const alternarDesplegable = useCallback(() => {
    setDesplegableAbierto(prev => !prev);
  }, []);

  const manejarCerrarSesion = useCallback(async () => {
    try {
      setDesplegableAbierto(false);
      if (onLogout) {
        await onLogout();
      } else {
        console.log("Cerrar sesión");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [onLogout]);

  const manejarErrorImagen = useCallback((e) => {
    setImagenCargada(false);
    e.target.style.display = 'none';
  }, []);

  const manejarCargaImagen = useCallback(() => {
    setImagenCargada(true);
  }, []);

  const manejarErrorLogoRolan = useCallback((e) => {
    setLogoRolanCargado(false);
    console.warn("No se pudo cargar el logo de Rolan Tours desde /assets/IconoRolanTours.png");
  }, []);

  const manejarCargaLogoRolan = useCallback(() => {
    setLogoRolanCargado(true);
  }, []);

  // Cerrar desplegable cuando se hace click afuera
  useEffect(() => {
    const manejarClickAfuera = (evento) => {
      if (refDesplegable.current && !refDesplegable.current.contains(evento.target)) {
        setDesplegableAbierto(false);
      }
    };

    if (desplegableAbierto) {
      document.addEventListener("mousedown", manejarClickAfuera);
      return () => document.removeEventListener("mousedown", manejarClickAfuera);
    }
  }, [desplegableAbierto]);

  // Auto-cerrar desplegable en móvil después de un tiempo
  useEffect(() => {
    if (desplegableAbierto && responsiveData.esMovil) {
      const timer = setTimeout(() => {
        setDesplegableAbierto(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [desplegableAbierto, responsiveData.esMovil]);

  // Lazy loading de imágenes
  useEffect(() => {
    if (refAvatarImg.current && 'loading' in HTMLImageElement.prototype) {
      refAvatarImg.current.loading = 'lazy';
    }
    if (refLogoRolan.current && 'loading' in HTMLImageElement.prototype) {
      refLogoRolan.current.loading = 'lazy';
    }
  }, []);

  // Calcular tamaño de iconos según dispositivo
  const tamañoIcono = useMemo(() => {
    if (responsiveData.ancho <= 360) return 14;
    if (responsiveData.esMovil) return 16;
    return 18;
  }, [responsiveData]);

  // Componente de notificaciones mejorado
  const ComponenteNotificaciones = useMemo(() => (
    <div className="contenedor-notificacion">
      <button
        onClick={abrirModalNotificaciones}
        className="btn-notificacion"
        aria-label={`${notificacionesNoLeidas} notificaciones sin leer`}
        title={`Notificaciones${notificacionesNoLeidas > 0 ? ` (${notificacionesNoLeidas} sin leer)` : ''}`}
      >
        <Bell size={tamañoIcono} />
        {notificacionesNoLeidas > 0 && (
          <span className="insignia-notificacion" data-tipo="total">
            {notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas}
          </span>
        )}
      </button>
    </div>
  ), [notificacionesNoLeidas, tamañoIcono, abrirModalNotificaciones]);

  // Determinar si mostrar botón hamburguesa
  const mostrarBotonHamburguesa = responsiveData.esMovil || responsiveData.esTablet;

  return (
    <>
      <header
        className={`navbar ${sidebarAbierto && !responsiveData.esMovil && !responsiveData.esTablet ? "con-sidebar" : "ancho-completo"}`}
        role="banner"
      >
        <div className="contenedor-navbar">
          {/* Sección del Logo */}
          <div className="seccion-logo">
            {/* Botón Hamburguesa - Solo visible en móvil y tablet */}
            {mostrarBotonHamburguesa && (
              <button
                onClick={alternarSidebar}
                className="btn-hamburguesa"
                aria-label={sidebarAbierto ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={sidebarAbierto}
              >
                {sidebarAbierto ? (
                  <X size={responsiveData.esMovil && responsiveData.ancho <= 480 ? 20 : 24} />
                ) : (
                  <Menu size={responsiveData.esMovil && responsiveData.ancho <= 480 ? 20 : 24} />
                )}
              </button>
            )}

            {/* Barras decorativas - Solo en desktop */}
            {!mostrarBotonHamburguesa && (
              <div className="barras-logo" aria-hidden="true">
                <div className="barra-roja"></div>
                <div className="barra-azul"></div>
                <div className="barra-roja"></div>
                <div className="barra-azul"></div>
                <div className="barra-roja"></div>
              </div>
            )}

            <img
              src="/assets/logo.png"
              alt="Logo Rolan Tours"
              className="logo-empresa"
              loading="lazy"
              onError={(e) => e.target.style.display = 'none'}
            />

            {/* Logo de Rolan Tours como imagen */}
            {logoRolanCargado ? (
              <img
                ref={refLogoRolan}
                src="/assets/IconoRolanTours.png"
                alt="Rolan Tours"
                className="logo-rolan"
                loading="lazy"
                onError={manejarErrorLogoRolan}
                onLoad={manejarCargaLogoRolan}
                style={{
                  height: responsiveData.esMovil
                    ? (responsiveData.ancho <= 480 ? '24px' : '28px')
                    : responsiveData.esTablet ? '32px' : '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease, filter 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!responsiveData.esMovil) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.filter = 'brightness(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!responsiveData.esMovil) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.filter = 'brightness(1)';
                  }
                }}
              />
            ) : (
              // Fallback si no se puede cargar la imagen
              !responsiveData.esMovil && !responsiveData.esTablet && (
                <h1 className="nombre-empresa">ROLAN TOURS</h1>
              )
            )}
          </div>

          {/* Sección Derecha */}
          <div className="seccion-usuario">
            {/* Notificaciones */}
            {ComponenteNotificaciones}

            {/* Perfil de Usuario - Oculto en móvil */}
            {!responsiveData.esMovil && (
              <div className="perfil-usuario" ref={refDesplegable}>
              {imagenCargada ? (
                <img
                  ref={refAvatarImg}
                  src={usuario.avatar}
                  alt={`Avatar de ${usuario.nombre}`}
                  className="avatar-usuario"
                  onError={manejarErrorImagen}
                  onLoad={manejarCargaImagen}
                  loading="lazy"
                />
              ) : (
                <div
                  className="avatar-fallback"
                  aria-label={`Avatar de ${usuario.nombre}`}
                  style={{
                    width: responsiveData.esMovil && responsiveData.ancho <= 480 ? '32px' : '40px',
                    height: responsiveData.esMovil && responsiveData.ancho <= 480 ? '32px' : '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: responsiveData.esMovil && responsiveData.ancho <= 480 ? '12px' : '14px',
                    border: '3px solid #ffffff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {usuario.iniciales}
                </div>
              )}

              {/* Información del usuario - ocultar en móvil pequeño */}
              {(!responsiveData.esMovil || responsiveData.ancho > 480) && (
                <div>
                  <p className="nombre-usuario">{usuario.nombre}</p>
                  <span className="rol-usuario">{usuario.rol}</span>
                </div>
              )}

              <button
                className="alternar-desplegable"
                onClick={alternarDesplegable}
                aria-label="Abrir menú de usuario"
                aria-expanded={desplegableAbierto}
                aria-haspopup="true"
              >
                <ChevronDown
                  size={14}
                  className={`icono-desplegable ${desplegableAbierto ? "abierto" : ""}`}
                />
              </button>

              {/* Menú Desplegable */}
              {desplegableAbierto && (
                <div
                  className="menu-desplegable"
                  role="menu"
                  aria-label="Menú de usuario"
                >
                  <button
                    onClick={abrirModalPerfil}
                    className="elemento-desplegable"
                    role="menuitem"
                    aria-label="Ver perfil de usuario"
                  >
                    <User size={16} />
                    <span>Ver Perfil</span>
                  </button>

                  <div className="divisor" role="separator"></div>

                  <button
                    onClick={manejarCerrarSesion}
                    className="elemento-desplegable cerrar-sesion"
                    role="menuitem"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Notificaciones */}
      <ModalNotificaciones
        isOpen={modalNotificacionesAbierto}
        onClose={cerrarModalNotificaciones}
        notificaciones={notificaciones}
        onMarcarComoLeida={marcarComoLeida}
        onEliminarNotificacion={eliminarNotificacion}
        onMarcarTodasComoLeidas={marcarTodasComoLeidas}
        onEliminarTodas={eliminarTodas}
        responsive={responsiveData}
      />

      {/* Modal de Perfil */}
      <ModalPerfil
        isOpen={modalPerfilAbierto}
        onClose={cerrarModalPerfil}
        onEditProfile={onEditProfile}
        userInfo={userInfo}
        cargandoPerfil={cargandoPerfil}
        setCargandoPerfil={setCargandoPerfil}
      />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;