import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Home, ShoppingCart, FileText, Settings, Truck, Users, LogOut,
  ChevronDown, ChevronUp, User, FileCheck, CreditCard, FileSignature,
  Receipt, FileBarChart, ClipboardList, Calendar, UserCheck, Car,
  Map, Building, UserCog, Plane, UtensilsCrossed, MapPin, Bed,
  Wrench, X, Moon, Sun
} from "lucide-react";
import { useResponsive } from "../../../utils/useResponsive";
import "./Sidebar.css";
import { API_CONFIG } from "../../../config/api";

const Sidebar = ({ estaAbierto, setEstaAbierto }) => {
  const [elementoActivo, setElementoActivo] = useState("Principal");
  const [ventasAbierto, setVentasAbierto] = useState(false);
  const [documentosAbierto, setDocumentosAbierto] = useState(false);
  const [operacionesAbierto, setOperacionesAbierto] = useState(false);
  const [serviciosAbierto, setServiciosAbierto] = useState(false);
  const [mantenimientoAbierto, setMantenimientoAbierto] = useState(false);
  const [administracionAbierto, setAdministracionAbierto] = useState(false);
  // FIX 4: eliminado viajesAbierto — "Viajes" es un item directo sin submenú
  const [tooltipAbierto, setTooltipAbierto] = useState(null);
  // FIX 5: modoOscuro era una constante que sobreescribía el estado; ahora es solo estado
  const [modoOscuro, setModoOscuro] = useState(false);
  const [hoverExpandido, setHoverExpandido] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const responsive = useResponsive();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const permisos = user.permisos || [];

  const tienePermiso = (permiso) => {
    if (!permiso) return true;
    return permisos.includes(permiso);
  };

  useEffect(() => {
    const rutaActual = location.pathname;
    switch (rutaActual) {
      case '/':
        setElementoActivo('Principal');
        break;

      case '/clientes':
        setElementoActivo('Clientes');
        setVentasAbierto(true);
        break;
      case '/cotizaciones':
        setElementoActivo('Cotizaciones');
        setVentasAbierto(true);
        break;
      case '/pagos':
        setElementoActivo('Pagos');
        setVentasAbierto(true);
        break;

      case '/contratos':
        setElementoActivo('Contratos');
        setDocumentosAbierto(true);
        break;
      case '/orden-servicio':
        setElementoActivo('OrdenServicio');
        setDocumentosAbierto(true);
        break;
      case '/reservas':
        setElementoActivo('Reservas');
        setDocumentosAbierto(true);
        break;

      case '/operadores':
        setElementoActivo('Operadores');
        setOperacionesAbierto(true);
        break;
      case '/vehiculos':
        setElementoActivo('Vehiculos');
        setOperacionesAbierto(true);
        break;
      case '/guias':
        setElementoActivo('Guias');
        setOperacionesAbierto(true);
        break;
      case '/proveedores':
        setElementoActivo('Proveedores');
        setOperacionesAbierto(true);
        break;
      case '/coordinadores':
        setElementoActivo('Coordinadores');
        setOperacionesAbierto(true);
        break;

      case '/transporte':
        setElementoActivo('Transporte');
        setServiciosAbierto(true);
        break;
      case '/restaurantes':
        setElementoActivo('Restaurantes');
        setServiciosAbierto(true);
        break;
      case '/tours':
        setElementoActivo('Tours');
        setServiciosAbierto(true);
        break;
      case '/hospedaje':
        setElementoActivo('Hospedaje');
        setServiciosAbierto(true);
        break;

      case '/mantenimiento-vehiculos':
        setElementoActivo('MantenimientoVehiculos');
        setMantenimientoAbierto(true);
        break;

      case '/administracion':
        setElementoActivo("Administracion");
        break;
      case '/roles':
        setElementoActivo("Roles");
        setAdministracionAbierto(true);
        break;
      case '/usuarios':
        setElementoActivo("Usuarios");
        setAdministracionAbierto(true);
        break;

      // FIX 4: Viajes no abre submenú, solo marca el activo
      case '/viajes':
        setElementoActivo('Viajes');
        break;

      default:
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!estaAbierto) {
      setVentasAbierto(false);
      setDocumentosAbierto(false);
      setOperacionesAbierto(false);
      setServiciosAbierto(false);
      setMantenimientoAbierto(false);
      setAdministracionAbierto(false);
    }
  }, [estaAbierto]);

  useEffect(() => {
    const cerrarTooltip = (event) => {
      if (!event.target.closest('.tooltip-submenu') &&
        !event.target.closest('.elemento-con-tooltip')) {
        setTooltipAbierto(null);
      }
    };
    const cerrarTooltipScroll = () => setTooltipAbierto(null);

    window.addEventListener('scroll', cerrarTooltipScroll);
    window.addEventListener('resize', cerrarTooltipScroll);
    document.addEventListener('click', cerrarTooltip);

    return () => {
      window.removeEventListener('scroll', cerrarTooltipScroll);
      window.removeEventListener('resize', cerrarTooltipScroll);
      document.removeEventListener('click', cerrarTooltip);
    };
  }, []);

  const alternarVentas = () => setVentasAbierto(v => !v);
  const alternarDocumentos = () => setDocumentosAbierto(v => !v);
  const alternarOperaciones = () => setOperacionesAbierto(v => !v);
  const alternarServicios = () => setServiciosAbierto(v => !v);
  const alternarMantenimiento = () => setMantenimientoAbierto(v => !v);
  const alternarAdministracion = () => setAdministracionAbierto(v => !v);
  const alternarModoOscuro = () => setModoOscuro(v => !v);

  const manejarCerrarSesion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post(`${API_CONFIG.BASE_URL}/logout`);
      }
    } catch (_) {
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/';
    }
  };

  const manejarTooltip = (elementoId, event) => {
    if (responsive.esMovil || !estaAbierto) {
      event.preventDefault();
      event.stopPropagation();
      setTooltipAbierto(tooltipAbierto === elementoId ? null : elementoId);
    }
  };

  const cerrarTooltip = (event) => {
    if (!event.target.closest('.tooltip-submenu')) {
      setTooltipAbierto(null);
    }
  };

  const manejarMouseEnter = () => {
    if (!responsive.esMovil && !responsive.esTablet) {
      setHoverExpandido(true);
    }
  };

  const manejarMouseLeave = () => {
    if (!responsive.esMovil && !responsive.esTablet) {
      setHoverExpandido(false);
      setVentasAbierto(false);
      setDocumentosAbierto(false);
      setOperacionesAbierto(false);
      setServiciosAbierto(false);
      setMantenimientoAbierto(false);
      setAdministracionAbierto(false);
    }
  };

  const elementosMenu = [
    {
      id: 'Principal',
      icono: Home,
      etiqueta: 'Dashboard',
      permiso: 'dashboard.ver'
    },
    {
      id: 'Ventas',
      icono: ShoppingCart,
      etiqueta: 'Ventas',
      tieneSubmenu: true,
      submenu: [
        { id: 'Clientes', icono: User, etiqueta: 'Clientes', permiso: 'ventas.clientes.ver' },
        { id: 'Cotizaciones', icono: FileCheck, etiqueta: 'Cotizaciones', permiso: 'ventas.cotizaciones.ver' },
        { id: 'Pagos', icono: CreditCard, etiqueta: 'Pagos', permiso: 'ventas.pagos.ver' },
      ]
    },
    {
      id: 'Documentos',
      icono: FileText,
      etiqueta: 'Documentos',
      tieneSubmenu: true,
      submenu: [
        { id: 'Contratos', icono: FileSignature, etiqueta: 'Contratos', permiso: 'documentos.contratos.ver' },
        { id: 'OrdenServicio', icono: ClipboardList, etiqueta: 'Órdenes de Servicio', permiso: 'documentos.ordenes.ver' },
        { id: 'Reservas', icono: Calendar, etiqueta: 'Reservas', permiso: 'documentos.reservas.ver' },
      ]
    },
    {
      id: 'Operaciones',
      icono: Settings,
      etiqueta: 'Operaciones',
      tieneSubmenu: true,
      submenu: [
        { id: 'Operadores', icono: UserCheck, etiqueta: 'Operadores', permiso: 'operaciones.operadores.ver' },
        { id: 'Vehiculos', icono: Car, etiqueta: 'Vehículos', permiso: 'operaciones.vehiculos.ver' },
        { id: 'Guias', icono: Map, etiqueta: 'Guías', permiso: 'operaciones.guias.ver' },
        { id: 'Proveedores', icono: Building, etiqueta: 'Proveedores', permiso: 'operaciones.proveedores.ver' },
        { id: 'Coordinadores', icono: UserCog, etiqueta: 'Coordinadores', permiso: 'operaciones.coordinadores.ver' },
      ]
    },
    {
      id: 'Servicios',
      icono: Truck,
      etiqueta: 'Servicios',
      tieneSubmenu: true,
      submenu: [
        { id: 'Transporte', icono: Plane, etiqueta: 'Transporte', permiso: 'servicios.transporte.ver' },
        { id: 'Restaurantes', icono: UtensilsCrossed, etiqueta: 'Restaurantes', permiso: 'servicios.restaurantes.ver' },
        { id: 'Tours', icono: MapPin, etiqueta: 'Tours', permiso: 'servicios.tours.ver' },
        { id: 'Hospedaje', icono: Bed, etiqueta: 'Hospedaje', permiso: 'servicios.hospedaje.ver' },
      ]
    },
    {
      id: 'Mantenimiento',
      icono: Wrench,
      etiqueta: 'Mantenimiento',
      tieneSubmenu: true,
      submenu: [
        { id: 'MantenimientoVehiculos', icono: Car, etiqueta: 'Mantenimiento de Vehículos', permiso: 'mantenimiento.ver' },
      ]
    },
    {
      id: "Administracion",
      icono: Users,
      etiqueta: "Administración",
      tieneSubmenu: true,
      submenu: [
        { id: "Roles", icono: UserCog, etiqueta: "Roles", permiso: 'administracion.roles.ver' },
        { id: "Usuarios", icono: User, etiqueta: "Usuarios", permiso: 'administracion.usuarios.ver' },
      ],
    },
    // FIX 4: Viajes sin tieneSubmenu ni submenu — es navegación directa
    {
      id: "Viajes",
      icono: MapPin,
      etiqueta: "Viajes",
      // permiso: "appmovil.viajes.ver",
    },
  ];

  const elementosMenuFiltrados = elementosMenu.map(elemento => {
    if (elemento.tieneSubmenu) {
      const submenuFiltrado = elemento.submenu.filter(sub => tienePermiso(sub.permiso));
      if (submenuFiltrado.length > 0) {
        return { ...elemento, submenu: submenuFiltrado };
      }
      return null;
    }
    return tienePermiso(elemento.permiso) ? elemento : null;
  }).filter(Boolean);

  const manejarNavegacion = (elementoId) => {
    const rutas = {
      Principal: '/',
      Clientes: '/clientes',
      Cotizaciones: '/cotizaciones',
      Pagos: '/pagos',
      Contratos: '/contratos',
      OrdenServicio: '/orden-servicio',
      Reservas: '/reservas',
      Operadores: '/operadores',
      Vehiculos: '/vehiculos',
      Guias: '/guias',
      Proveedores: '/proveedores',
      Coordinadores: '/coordinadores',
      Transporte: '/transporte',
      Restaurantes: '/restaurantes',
      Tours: '/tours',
      Hospedaje: '/hospedaje',
      MantenimientoVehiculos: '/mantenimiento-vehiculos',
      Administracion: '/administracion',
      Roles: '/roles',
      Usuarios: '/usuarios',
      Viajes: '/viajes',
    };
    if (rutas[elementoId]) navigate(rutas[elementoId]);
  };

  const alternarSubmenu = (elementoId) => {
    switch (elementoId) {
      case 'Ventas': alternarVentas(); break;
      case 'Documentos': alternarDocumentos(); break;
      case 'Operaciones': alternarOperaciones(); break;
      case 'Servicios': alternarServicios(); break;
      case 'Mantenimiento': alternarMantenimiento(); break;
      case 'Administracion': alternarAdministracion(); break;
      default: break;
    }
  };

  const estaSubmenuAbierto = (elementoId) => {
    switch (elementoId) {
      case 'Ventas': return ventasAbierto;
      case 'Documentos': return documentosAbierto;
      case 'Operaciones': return operacionesAbierto;
      case 'Servicios': return serviciosAbierto;
      case 'Mantenimiento': return mantenimientoAbierto;
      case 'Administracion': return administracionAbierto;
      default: return false;
    }
  };

  const expandido =
    (responsive.esMovil || responsive.esTablet) ? estaAbierto : hoverExpandido;

  const renderElementoSubmenu = (subElemento, esTooltip = false) => {
    const ComponenteSubIcono = subElemento.icono;
    const estaSubActivo = elementoActivo === subElemento.id;
    return (
      <li key={subElemento.id}>
        <button
          onClick={() => {
            setElementoActivo(subElemento.id);
            manejarNavegacion(subElemento.id);
            if (esTooltip) setTooltipAbierto(null);
          }}
          className={`elemento-submenu ${estaSubActivo ? 'activo' : ''}`}
          data-submenu={subElemento.id}
        >
          <div className="contenedor-icono-submenu">
            <ComponenteSubIcono className="icono-submenu" />
          </div>
          <span className="texto-submenu">{subElemento.etiqueta}</span>
        </button>
      </li>
    );
  };

  const renderTooltipSubmenu = (elemento) => {
    if (!elemento.tieneSubmenu) return null;
    const estaTooltipAbierto = tooltipAbierto === elemento.id;
    return (
      <div
        className={`tooltip-submenu ${estaTooltipAbierto ? 'abierto' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cabecera-tooltip">
          <h3 className="titulo-tooltip">{elemento.etiqueta}</h3>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTooltipAbierto(null); }}
            className="btn-cerrar-tooltip"
            aria-label="Cerrar"
          >
            <X />
          </button>
        </div>
        <ul>
          {elemento.submenu.map(sub => renderElementoSubmenu(sub, true))}
        </ul>
      </div>
    );
  };

  return (
    <div className="contenedor-sidebar" onClick={cerrarTooltip}>
      {estaAbierto && responsive.esMovil && (
        <div className="superposicion-sidebar" onClick={() => setEstaAbierto(false)} />
      )}

      {tooltipAbierto && responsive.esMovil && (
        <div className="superposicion-tooltip" onClick={() => setTooltipAbierto(null)} />
      )}

      {!responsive.esMovil && !responsive.esTablet && (
        <div className="area-activacion-hover" onMouseEnter={manejarMouseEnter} />
      )}

      <aside
        className={`sidebar ${responsive.esMovil || responsive.esTablet ? (estaAbierto ? 'abierto' : '') : ''} ${modoOscuro ? 'modo-oscuro' : ''} ${hoverExpandido ? 'hover-expandido' : ''}`}
        onMouseEnter={manejarMouseEnter}
        onMouseLeave={manejarMouseLeave}
      >
        <nav className="navegacion-sidebar">
          <ul className="lista-navegacion">
            {elementosMenuFiltrados.map((elemento) => {
              const ComponenteIcono = elemento.icono;
              const estaActivo = elementoActivo === elemento.id;
              const submenuAbierto = estaSubmenuAbierto(elemento.id);

              return (
                <li
                  key={elemento.id}
                  className={!estaAbierto && elemento.tieneSubmenu ? "elemento-navegacion-colapsado" : ""}
                >
                  <button
                    onClick={(e) => {
                      if (elemento.tieneSubmenu) {
                        if (expandido) {
                          alternarSubmenu(elemento.id);
                        } else if (responsive.esMovil || responsive.esTablet) {
                          manejarTooltip(elemento.id, e);
                        }
                      } else {
                        setElementoActivo(elemento.id);
                        manejarNavegacion(elemento.id);
                      }
                    }}
                    className={`elemento-navegacion elemento-con-tooltip ${estaActivo ? 'activo' : ''}`}
                    data-menu={elemento.id}
                    aria-label={elemento.etiqueta}
                  >
                    <div className="contenedor-icono-navegacion">
                      <ComponenteIcono className="icono-navegacion" />
                    </div>

                    <span className={`texto-navegacion ${expandido ? 'visible' : 'oculto'}`}>
                      {elemento.etiqueta}
                    </span>

                    {elemento.tieneSubmenu && (
                      <div className="flecha-submenu">
                        {submenuAbierto
                          ? <ChevronDown className="icono-flecha" />
                          : <ChevronUp className="icono-flecha" />
                        }
                      </div>
                    )}
                  </button>

                  {(responsive.esMovil || responsive.esTablet) && !estaAbierto &&
                    renderTooltipSubmenu(elemento)}

                  {elemento.tieneSubmenu && expandido && submenuAbierto && (
                    <ul className="submenu">
                      {elemento.submenu.map(sub => renderElementoSubmenu(sub))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          {responsive.esMovil && (
            <div className="seccion-ver-perfil">
              <button className="btn-ver-perfil" aria-label="Ver perfil">
                <User className="icono-ver-perfil" />
                <span className={`texto-ver-perfil ${estaAbierto ? 'visible' : 'oculto'}`}>
                  Ver Perfil
                </span>
              </button>
            </div>
          )}

          <div className="seccion-cerrar-sesion">
            <button
              className="btn-cerrar-sesion"
              aria-label="Cerrar sesión"
              onClick={manejarCerrarSesion}
            >
              <LogOut className="icono-cerrar-sesion" />
              <span className={`texto-cerrar-sesion ${expandido ? 'visible' : 'oculto'}`}>
                Cerrar Sesión
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;