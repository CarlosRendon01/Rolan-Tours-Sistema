import React, { useState, useEffect } from "react";
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

const Sidebar = ({ estaAbierto, setEstaAbierto }) => {
  const [elementoActivo, setElementoActivo] = useState("Principal");
  const [ventasAbierto, setVentasAbierto] = useState(false);
  const [documentosAbierto, setDocumentosAbierto] = useState(false);
  const [operacionesAbierto, setOperacionesAbierto] = useState(false);
  const [serviciosAbierto, setServiciosAbierto] = useState(false);
  const [mantenimientoAbierto, setMantenimientoAbierto] = useState(false);
  const [administracionAbierto, setAdministracionAbierto] = useState(false);
  const [tooltipAbierto, setTooltipAbierto] = useState(null);
  /*const [modoOscuro, setModoOscuro] = useState(() => {
    const modoGuardado = localStorage.getItem('modoOscuro');
    return modoGuardado === 'true';
  });/*/
  const modoOscuro = false;
  const [hoverExpandido, setHoverExpandido] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const responsive = useResponsive();

  useEffect(() => {
    const rutaActual = location.pathname;
    switch (rutaActual) {
      case '/':
        setElementoActivo('Principal');
        break;

      // Ventas
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

      // Documentos
      case '/contratos':
        setElementoActivo('Contratos');
        setDocumentosAbierto(true);
        break;
      case '/facturas':
        setElementoActivo('Facturas');
        setDocumentosAbierto(true);
        break;
      case '/recibos':
        setElementoActivo('Recibos');
        setDocumentosAbierto(true);
        break;

      // Operaciones
      case '/orden-servicio':
        setElementoActivo('OrdenServicio');
        setOperacionesAbierto(true);
        break;
      case '/reservas':
        setElementoActivo('Reservas');
        setOperacionesAbierto(true);
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

      // Servicios
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

      // Mantenimiento
      case '/mantenimiento-vehiculos':
        setElementoActivo('MantenimientoVehiculos');
        setMantenimientoAbierto(true);
        break;

      // Administración
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

      default:
        break;
    }
  }, [location.pathname]);

  /*useEffect(() => {
    localStorage.setItem('modoOscuro', modoOscuro.toString());

    if (modoOscuro) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }

    return () => {
      document.body.classList.remove('modo-oscuro');
    };
  }, [modoOscuro]);*/

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

  const alternarVentas = () => setVentasAbierto(!ventasAbierto);
  const alternarDocumentos = () => setDocumentosAbierto(!documentosAbierto);
  const alternarOperaciones = () => setOperacionesAbierto(!operacionesAbierto);
  const alternarServicios = () => setServiciosAbierto(!serviciosAbierto);
  const alternarMantenimiento = () => setMantenimientoAbierto(!mantenimientoAbierto);
  const alternarAdministracion = () => setAdministracionAbierto(!administracionAbierto);
  const alternarModoOscuro = () => setModoOscuro(!modoOscuro);

  // ✅ FUNCIÓN PARA CERRAR SESIÓN - INTEGRADA AQUÍ
  const manejarCerrarSesion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post('http://127.0.0.1:8000/api/logout');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar todo
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rol');
      delete axios.defaults.headers.common['Authorization'];

      // Recargar la página para volver al login
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
    { id: 'Principal', icono: Home, etiqueta: 'Dashboard' },
    {
      id: 'Ventas',
      icono: ShoppingCart,
      etiqueta: 'Ventas',
      tieneSubmenu: true,
      submenu: [
        { id: 'Clientes', icono: User, etiqueta: 'Clientes' },
        { id: 'Cotizaciones', icono: FileCheck, etiqueta: 'Cotizaciones' },
        { id: 'Pagos', icono: CreditCard, etiqueta: 'Pagos' }
      ]
    },
    {
      id: 'Documentos',
      icono: FileText,
      etiqueta: 'Documentos',
      tieneSubmenu: true,
      submenu: [
        { id: 'Contratos', icono: FileSignature, etiqueta: 'Contratos' },
        { id: 'OrdenServicio', icono: ClipboardList, etiqueta: 'Órdenes de Servicio' },
        { id: 'Reservas', icono: Calendar, etiqueta: 'Reservas' }
      ]
    },
    {
      id: 'Operaciones',
      icono: Settings,
      etiqueta: 'Operaciones',
      tieneSubmenu: true,
      submenu: [
        { id: 'Operadores', icono: UserCheck, etiqueta: 'Operadores' },
        { id: 'Vehiculos', icono: Car, etiqueta: 'Vehículos' },
        { id: 'Guias', icono: Map, etiqueta: 'Guías' },
        { id: 'Proveedores', icono: Building, etiqueta: 'Proveedores' },
        { id: 'Coordinadores', icono: UserCog, etiqueta: 'Coordinadores' }
      ]
    },
    {
      id: 'Servicios',
      icono: Truck,
      etiqueta: 'Servicios',
      tieneSubmenu: true,
      submenu: [
        { id: 'Transporte', icono: Plane, etiqueta: 'Transporte' },
        { id: 'Restaurantes', icono: UtensilsCrossed, etiqueta: 'Restaurantes' },
        { id: 'Tours', icono: MapPin, etiqueta: 'Tours' },
        { id: 'Hospedaje', icono: Bed, etiqueta: 'Hospedaje' }
      ]
    },
    {
      id: 'Mantenimiento',
      icono: Wrench,
      etiqueta: 'Mantenimiento',
      tieneSubmenu: true,
      submenu: [
        { id: 'MantenimientoVehiculos', icono: Car, etiqueta: 'Mantenimiento de Vehículos' }
      ]
    },
    {
      id: "Administracion",
      icono: Users,
      etiqueta: "Administración",
      tieneSubmenu: true,
      submenu: [
        { id: "Roles", icono: UserCog, etiqueta: "Roles" },
        { id: "Usuarios", icono: User, etiqueta: "Usuarios" },
      ],
    },
  ];

  const manejarNavegacion = (elementoId) => {
    switch (elementoId) {
      // Dashboard
      case 'Principal':
        navigate('/');
        break;

      // Ventas
      case 'Clientes':
        navigate('/clientes');
        break;
      case 'Cotizaciones':
        navigate('/cotizaciones');
        break;
      case 'Pagos':
        navigate('/pagos');
        break;

      // Documentos
      case 'Contratos':
        navigate('/contratos');
        break;
      case 'Facturas':
        navigate('/facturas');
        break;
      case 'Recibos':
        navigate('/recibos');
        break;

      // Operaciones
      case 'OrdenServicio':
        navigate('/orden-servicio');
        break;
      case 'Reservas':
        navigate('/reservas');
        break;
      case 'Operadores':
        navigate('/operadores');
        break;
      case 'Vehiculos':
        navigate('/vehiculos');
        break;
      case 'Guias':
        navigate('/guias');
        break;
      case 'Proveedores':
        navigate('/proveedores');
        break;
      case 'Coordinadores':
        navigate('/coordinadores');
        break;

      // Servicios
      case 'Transporte':
        navigate('/transporte');
        break;
      case 'Restaurantes':
        navigate('/restaurantes');
        break;
      case 'Tours':
        navigate('/tours');
        break;
      case 'Hospedaje':
        navigate('/hospedaje');
        break;

      // Mantenimiento
      case 'MantenimientoVehiculos':
        navigate('/mantenimiento-vehiculos');
        break;

      // Administración
      case "Administracion":
        navigate("/administracion");
        break;
      case "Roles":
        navigate("/roles");
        break;
      case "Usuarios":
        navigate("/usuarios");
        break;

      default:
        console.log(`Navegación para ${elementoId} no implementada aún`);
        break;
    }
  };

  const renderElementoSubmenu = (subElemento, esTooltip = false) => {
    const ComponenteSubIcono = subElemento.icono;
    const estaSubActivo = elementoActivo === subElemento.id;

    return (
      <li key={subElemento.id}>
        <button
          onClick={() => {
            setElementoActivo(subElemento.id);
            manejarNavegacion(subElemento.id);
            if (esTooltip) {
              setTooltipAbierto(null);
            }
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setTooltipAbierto(null);
            }}
            className="btn-cerrar-tooltip"
            aria-label="Cerrar"
          >
            <X />
          </button>
        </div>
        <ul>
          {elemento.submenu.map(subElemento => renderElementoSubmenu(subElemento, true))}
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
            {elementosMenu.map((elemento) => {
              const ComponenteIcono = elemento.icono;
              const estaActivo = elementoActivo === elemento.id;

              return (
                <li key={elemento.id} className={!estaAbierto && elemento.tieneSubmenu ? "elemento-navegacion-colapsado" : ""}>
                  <button
                    onClick={(e) => {
                      if (elemento.tieneSubmenu) {
                        if ((responsive.esMovil || responsive.esTablet) && estaAbierto) {
                          if (elemento.id === 'Ventas') alternarVentas();
                          else if (elemento.id === 'Documentos') alternarDocumentos();
                          else if (elemento.id === 'Operaciones') alternarOperaciones();
                          else if (elemento.id === 'Servicios') alternarServicios();
                          else if (elemento.id === 'Mantenimiento') alternarMantenimiento();
                          else if (elemento.id === "Administracion") alternarAdministracion();
                        } else if (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) {
                          if (elemento.id === 'Ventas') alternarVentas();
                          else if (elemento.id === 'Documentos') alternarDocumentos();
                          else if (elemento.id === 'Operaciones') alternarOperaciones();
                          else if (elemento.id === 'Servicios') alternarServicios();
                          else if (elemento.id === 'Mantenimiento') alternarMantenimiento();
                          else if (elemento.id === "Administracion") alternarAdministracion();
                        } else if ((responsive.esMovil || responsive.esTablet) && !estaAbierto) {
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

                    <span className={`texto-navegacion ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                      {elemento.etiqueta}
                    </span>

                    {elemento.tieneSubmenu && (
                      <div className="flecha-submenu">
                        {((elemento.id === 'Ventas' && ventasAbierto) ||
                          (elemento.id === 'Documentos' && documentosAbierto) ||
                          (elemento.id === 'Operaciones' && operacionesAbierto) ||
                          (elemento.id === 'Servicios' && serviciosAbierto) ||
                          (elemento.id === 'Mantenimiento' && mantenimientoAbierto) ||
                          (elemento.id === "Administracion" && administracionAbierto)) ? (
                          <ChevronDown className="icono-flecha" />
                        ) : (
                          <ChevronUp className="icono-flecha" />
                        )}
                      </div>
                    )}
                  </button>

                  {(responsive.esMovil || responsive.esTablet) && !estaAbierto && renderTooltipSubmenu(elemento)}

                  {
                    elemento.tieneSubmenu && (((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido)) && (
                      ((elemento.id === 'Ventas' && ventasAbierto) ||
                        (elemento.id === 'Documentos' && documentosAbierto) ||
                        (elemento.id === 'Operaciones' && operacionesAbierto) ||
                        (elemento.id === 'Servicios' && serviciosAbierto) ||
                        (elemento.id === 'Mantenimiento' && mantenimientoAbierto) ||
                        (elemento.id === "Administracion" && administracionAbierto))
                    ) && (
                      <ul className="submenu">
                        {elemento.submenu.map(subElemento => renderElementoSubmenu(subElemento))}
                      </ul>
                    )
                  }
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

          {/* ✅ BOTÓN DE CERRAR SESIÓN CON FUNCIÓN */}
          <div className="seccion-cerrar-sesion">
            <button
              className="btn-cerrar-sesion"
              aria-label="Cerrar sesión"
              onClick={manejarCerrarSesion}
            >
              <LogOut className="icono-cerrar-sesion" />
              <span className={`texto-cerrar-sesion ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                Cerrar Sesión
              </span>
            </button>
          </div>


          
          {/* SECCIÓN MODO OSCURO */}
          {/*<div className="seccion-modo-oscuro">
            <button
              className="btn-modo-oscuro"
              onClick={alternarModoOscuro}
              aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {modoOscuro ? <Sun className="icono-modo-oscuro" /> : <Moon className="icono-modo-oscuro" />}
              <span className={`texto-modo-oscuro ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
              {(((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido)) && <div className="toggle-modo-oscuro"></div>}
            </button>
          </div> */} 
        </nav>
      </aside>
    </div >
  );
};

export default Sidebar;