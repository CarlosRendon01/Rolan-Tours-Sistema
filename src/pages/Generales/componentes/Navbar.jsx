import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Bell, ChevronDown, User, LogOut, Menu, X
} from "lucide-react";
import { useResponsive } from "../../../utils/useResponsive";
import ModalNotificaciones from "./ModalNotificaciones";
import ModalPerfil from "./ModalPerfil";
import "./Navbar.css";

const Navbar = React.memo(({ sidebarAbierto, setSidebarAbierto, responsive }) => {
  const [desplegableAbierto, setDesplegableAbierto] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(true);
  const [logoRolanCargado, setLogoRolanCargado] = useState(true);
  const [modalNotificacionesAbierto, setModalNotificacionesAbierto] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);

  // ✅ CARGAR USUARIO DESDE LOCALSTORAGE
  const [usuario, setUsuario] = useState(() => {
    const userGuardado = localStorage.getItem('user');
    if (userGuardado) {
      try {
        const userData = JSON.parse(userGuardado);
        console.log('📦 Usuario cargado desde localStorage:', userData);
        return userData;
      } catch (e) {
        console.error('❌ Error al parsear usuario:', e);
        return null;
      }
    }
    return null;
  });

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

  const refDesplegable = useRef(null);
  const refAvatarImg = useRef(null);
  const refLogoRolan = useRef(null);

  const responsiveHook = useResponsive();
  const responsiveData = responsive || responsiveHook;

  const usuarioInfo = useMemo(() => {
    const obtenerPrimerRol = (roles) => {
      if (!roles) return "Usuario";

      if (Array.isArray(roles) && typeof roles[0] === 'string') {
        return roles[0];
      }

      if (Array.isArray(roles) && roles[0]?.nombre) {
        return roles[0].nombre;
      }

      if (typeof roles === 'string') {
        return roles;
      }

      return "Usuario";
    };

    return {
      nombre: usuario?.nombre || "Usuario",
      apellido_paterno: usuario?.apellido_paterno || "",
      apellido_materno: usuario?.apellido_materno || "",
      rol: obtenerPrimerRol(usuario?.roles),
      email: usuario?.correo || "usuario@rolantours.com",
      avatar: "/assets/Usuario.png",
      genero: usuario?.genero || "Prefiero no decir",
      iniciales: usuario?.nombre ? usuario.nombre.substring(0, 2).toUpperCase() : "US"
    };
  }, [usuario]);

  const notificacionesNoLeidas = useMemo(() => {
    return notificaciones.filter(notif => !notif.leida).length;
  }, [notificaciones]);

  const alternarSidebar = useCallback(() => {
    if (setSidebarAbierto) {
      setSidebarAbierto(!sidebarAbierto);
    }
  }, [sidebarAbierto, setSidebarAbierto]);

  // ✅ FUNCIÓN PARA CERRAR SESIÓN
  const manejarCerrarSesion = useCallback(async () => {
    try {
      setDesplegableAbierto(false);

      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post('http://127.0.0.1:8000/api/logout');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
  }, []);

  // ✅ FUNCIÓN PARA EDITAR PERFIL
  const manejarEditarPerfil = useCallback(async (nuevosDatos) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token');

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await axios.put(
        `http://127.0.0.1:8000/api/users/${usuario.id}`,
        nuevosDatos
      );

      const usuarioActualizado = response.data.data;
      setUsuario(usuarioActualizado);
      localStorage.setItem('user', JSON.stringify(usuarioActualizado));

      return { success: true, data: usuarioActualizado };
    } catch (error) {
      console.error('Error al editar perfil:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar perfil'
      };
    }
  }, [usuario]);

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

  const abrirModalPerfil = useCallback(() => {
    setModalPerfilAbierto(true);
    setDesplegableAbierto(false);
  }, []);

  const cerrarModalPerfil = useCallback(() => {
    setModalPerfilAbierto(false);
    setCargandoPerfil(false);
  }, []);

  const alternarDesplegable = useCallback(() => {
    setDesplegableAbierto(prev => !prev);
  }, []);

  const manejarErrorImagen = useCallback((e) => {
    setImagenCargada(false);
    e.target.style.display = 'none';
  }, []);

  const manejarCargaImagen = useCallback(() => {
    setImagenCargada(true);
  }, []);

  const manejarErrorLogoRolan = useCallback((e) => {
    setLogoRolanCargado(false);
  }, []);

  const manejarCargaLogoRolan = useCallback(() => {
    setLogoRolanCargado(true);
  }, []);

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

  useEffect(() => {
    if (desplegableAbierto && responsiveData.esMovil) {
      const timer = setTimeout(() => {
        setDesplegableAbierto(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [desplegableAbierto, responsiveData.esMovil]);

  useEffect(() => {
    if (refAvatarImg.current && 'loading' in HTMLImageElement.prototype) {
      refAvatarImg.current.loading = 'lazy';
    }
    if (refLogoRolan.current && 'loading' in HTMLImageElement.prototype) {
      refLogoRolan.current.loading = 'lazy';
    }
  }, []);

  const tamañoIcono = useMemo(() => {
    if (responsiveData.ancho <= 360) return 14;
    if (responsiveData.esMovil) return 16;
    return 18;
  }, [responsiveData]);

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

  const mostrarBotonHamburguesa = responsiveData.esMovil || responsiveData.esTablet;

  return (
    <>
      <header
        className={`navbar ${sidebarAbierto && !responsiveData.esMovil && !responsiveData.esTablet ? "con-sidebar" : "ancho-completo"}`}
        role="banner"
      >
        <div className="contenedor-navbar">
          <div className="seccion-logo">
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

            {!mostrarBotonHamburguesa && (
              <div className="barras-logo" aria-hidden="true">
                <div className="barra-roja"></div>
                <div className="barra-azul"></div>
                <div className="barra-roja"></div>
                <div className="barra-azul"></div>
                <div className="barra-roja"></div>
              </div>
            )}

           
            {logoRolanCargado ? (
              <img
                ref={refLogoRolan}
                src="/assets/rolanTours.png"
                alt="Rolan Tours"
                className="logo-rolan"
                loading="lazy"
                onError={manejarErrorLogoRolan}
                onLoad={manejarCargaLogoRolan}
                style={{
                  height: responsiveData.esMovil
                    ? (responsiveData.ancho <= 480 ? '34px' : '40px')
                    : responsiveData.esTablet ? '32px' : '36px',
                  width: 'auto',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease, filter 0.3s ease'
                }}
              />
            ) : (
              !responsiveData.esMovil && !responsiveData.esTablet && (
                <h1 className="nombre-empresa">ROLAN TOURS</h1>
              )
            )}
          </div>

          <div className="seccion-usuario">
            {ComponenteNotificaciones}

            {!responsiveData.esMovil && (
              <div className="perfil-usuario" ref={refDesplegable}>
                {imagenCargada ? (
                  <img
                    ref={refAvatarImg}
                    src={usuarioInfo.avatar}
                    alt={`Avatar de ${usuarioInfo.nombre}`}
                    className="avatar-usuario"
                    onError={manejarErrorImagen}
                    onLoad={manejarCargaImagen}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="avatar-fallback"
                    aria-label={`Avatar de ${usuarioInfo.nombre}`}
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
                    {usuarioInfo.iniciales}
                  </div>
                )}

                {(!responsiveData.esMovil || responsiveData.ancho > 480) && (
                  <div>
                    <p className="nombre-usuario">{usuarioInfo.nombre}</p>
                    <span className="rol-usuario">{usuarioInfo.rol}</span>
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

                {desplegableAbierto && (
                  <div className="menu-desplegable" role="menu">
                    <button
                      onClick={abrirModalPerfil}
                      className="elemento-desplegable"
                      role="menuitem"
                    >
                      <User size={16} />
                      <span>Ver Perfil</span>
                    </button>

                    <div className="divisor" role="separator"></div>

                    <button
                      onClick={manejarCerrarSesion}
                      className="elemento-desplegable cerrar-sesion"
                      role="menuitem"
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

      <ModalPerfil
        isOpen={modalPerfilAbierto}
        onClose={cerrarModalPerfil}
        onEditProfile={manejarEditarPerfil}
        userInfo={usuario}
        cargandoPerfil={cargandoPerfil}
        setCargandoPerfil={setCargandoPerfil}
      />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;