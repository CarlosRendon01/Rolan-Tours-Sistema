import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,            // Inicio/casa
  ShoppingCart,    // Carrito de compras
  FileText,        // Archivo de texto/documento
  Settings,        // Configuraciones/ajustes
  Truck,           // Camión/envío
  Users,           // Usuarios/personas
  LogOut,          // Cerrar sesión
  ChevronDown,     // Flecha hacia abajo
  ChevronUp,       // Flecha hacia arriba
  User,            // Usuario
  FileCheck,       // Archivo verificado/aprobado
  CreditCard,      // Tarjeta de crédito
  FileSignature,   // Archivo con firma/contrato
  Receipt,         // Recibo/factura
  FileBarChart,    // Archivo con gráfico de barras
  ClipboardList,   // Lista en portapapeles
  Calendar,        // Calendario
  UserCheck,       // Usuario verificado
  Car,             // Carro/automóvil
  Map,             // Mapa
  Building,        // Edificio
  UserCog,         // Usuario con configuración
  Plane,           // Avión
  UtensilsCrossed, // Utensilios cruzados/comida
  MapPin,          // Pin de ubicación
  Bed,             // Cama/hotel
  Wrench,          // Llave inglesa/mantenimiento
  X,               // X para cerrar
  Moon,            // Luna para modo oscuro
  Sun              // Sol para modo claro
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
  const [tooltipAbierto, setTooltipAbierto] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(() => {
    // Leer el modo oscuro desde localStorage al inicializar
    const modoGuardado = localStorage.getItem('modoOscuro');
    return modoGuardado === 'true';
  });
  const [hoverExpandido, setHoverExpandido] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const responsive = useResponsive();

  // Actualizar elemento activo basado en la ruta actual
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
      default:
        break;
    }
  }, [location.pathname]);

  // Efecto para manejar el modo oscuro
  useEffect(() => {
    // Guardar en localStorage
    localStorage.setItem('modoOscuro', modoOscuro.toString());

    // Aplicar clase al body para afectar toda la aplicación
    if (modoOscuro) {
      document.body.classList.add('modo-oscuro');
    } else {
      document.body.classList.remove('modo-oscuro');
    }

    // Cleanup al desmontar el componente
    return () => {
      document.body.classList.remove('modo-oscuro');
    };
  }, [modoOscuro]);

  // No cerrar automáticamente el sidebar en móvil al seleccionar elementos
  // El usuario debe cerrar manualmente con el botón hamburguesa o haciendo click fuera

  // Cerrar submenús cuando se colapsa el sidebar
  useEffect(() => {
    if (!estaAbierto) {
      setVentasAbierto(false);
      setDocumentosAbierto(false);
      setOperacionesAbierto(false);
      setServiciosAbierto(false);
      setMantenimientoAbierto(false);
    }
  }, [estaAbierto]);

  // Cerrar tooltip al hacer scroll, redimensionar o click fuera
  useEffect(() => {
    const cerrarTooltip = (event) => {
      // Solo cerrar si el click no es dentro del tooltip o del botón que lo activa
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
  const alternarModoOscuro = () => setModoOscuro(!modoOscuro);

  // Manejar tooltip para móvil y desktop
  const manejarTooltip = (elementoId, event) => {
    if (responsive.esMovil || !estaAbierto) {
      event.preventDefault();
      event.stopPropagation();
      setTooltipAbierto(tooltipAbierto === elementoId ? null : elementoId);
    }
  };

  // Cerrar tooltip específicamente
  const cerrarTooltip = (event) => {
    if (!event.target.closest('.tooltip-submenu')) {
      setTooltipAbierto(null);
    }
  };

  // Manejar hover para mostrar/ocultar sidebar (solo en desktop)
  const manejarMouseEnter = () => {
    if (!responsive.esMovil && !responsive.esTablet) {
      setHoverExpandido(true);
    }
  };

  const manejarMouseLeave = () => {
    if (!responsive.esMovil && !responsive.esTablet) {
      setHoverExpandido(false);
      // Cerrar todos los submenús cuando se quita el hover
      setVentasAbierto(false);
      setDocumentosAbierto(false);
      setOperacionesAbierto(false);
      setServiciosAbierto(false);
      setMantenimientoAbierto(false);
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
    { id: 'Administracion', icono: Users, etiqueta: 'Administración' }
  ];

  // Función para manejar navegación
  const manejarNavegacion = (elementoId) => {
    switch (elementoId) {
      case 'Principal':
        navigate('/');
        break;
      case 'Clientes':
        navigate('/clientes');
        break;
      case 'Cotizaciones':
        navigate('/cotizaciones');
        break;
      case 'Pagos':
        navigate('/pagos');
        break;
      // Agregar más rutas según sea necesario
      default:
        console.log(`Navegación para ${elementoId} no implementada aún`);
        break;
    }
  };

  // Renderizar elemento de submenú
  const renderElementoSubmenu = (subElemento, esTooltip = false) => {
    const ComponenteSubIcono = subElemento.icono;
    const estaSubActivo = elementoActivo === subElemento.id;

    return (
      <li key={subElemento.id}>
        <button
          onClick={() => {
            setElementoActivo(subElemento.id);
            manejarNavegacion(subElemento.id);

            // Solo cerrar tooltip si es un tooltip flotante, no si es móvil
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

  // Renderizar tooltip flotante para sidebar colapsado
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
      {/* Superposición para móviles */}
      {estaAbierto && responsive.esMovil && (
        <div className="superposicion-sidebar" onClick={() => setEstaAbierto(false)} />
      )}

      {/* Superposición específica para tooltips en móvil */}
      {tooltipAbierto && responsive.esMovil && (
        <div className="superposicion-tooltip" onClick={() => setTooltipAbierto(null)} />
      )}

      {/* Área de activación del hover (solo en desktop) */}
      {!responsive.esMovil && !responsive.esTablet && (
        <div
          className="area-activacion-hover"
          onMouseEnter={manejarMouseEnter}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${responsive.esMovil || responsive.esTablet ? (estaAbierto ? 'abierto' : '') : ''} ${modoOscuro ? 'modo-oscuro' : ''} ${hoverExpandido ? 'hover-expandido' : ''}`}
        onMouseEnter={manejarMouseEnter}
        onMouseLeave={manejarMouseLeave}
      >

        {/* Menú de Navegación */}
        <nav className="navegacion-sidebar">
          <ul className="lista-navegacion">
            {elementosMenu.map((elemento, index) => {
              const ComponenteIcono = elemento.icono;
              const estaActivo = elementoActivo === elemento.id;

              return (
                <li key={elemento.id} className={!estaAbierto && elemento.tieneSubmenu ? "elemento-navegacion-colapsado" : ""}>
                  <button
                    onClick={(e) => {
                      if (elemento.tieneSubmenu) {
                        // En desktop con hover o móvil/tablet abierto, expandir submenús
                        if ((responsive.esMovil || responsive.esTablet) && estaAbierto) {
                          // Móvil/tablet: expandir submenús cuando está abierto
                          if (elemento.id === 'Ventas') {
                            alternarVentas();
                          } else if (elemento.id === 'Documentos') {
                            alternarDocumentos();
                          } else if (elemento.id === 'Operaciones') {
                            alternarOperaciones();
                          } else if (elemento.id === 'Servicios') {
                            alternarServicios();
                          } else if (elemento.id === 'Mantenimiento') {
                            alternarMantenimiento();
                          }
                        } else if (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) {
                          // Desktop: expandir submenús cuando hay hover
                          if (elemento.id === 'Ventas') {
                            alternarVentas();
                          } else if (elemento.id === 'Documentos') {
                            alternarDocumentos();
                          } else if (elemento.id === 'Operaciones') {
                            alternarOperaciones();
                          } else if (elemento.id === 'Servicios') {
                            alternarServicios();
                          } else if (elemento.id === 'Mantenimiento') {
                            alternarMantenimiento();
                          }
                        } else if ((responsive.esMovil || responsive.esTablet) && !estaAbierto) {
                          // Móvil/tablet: mostrar tooltip si está cerrado
                          manejarTooltip(elemento.id, e);
                        }
                        // Si no hay hover en desktop, no hacer nada (mantener solo iconos)
                      } else {
                        // Elemento sin submenú: navegación directa
                        setElementoActivo(elemento.id);
                        manejarNavegacion(elemento.id);
                      }
                    }}
                    className={`elemento-navegacion elemento-con-tooltip ${estaActivo ? 'activo' : ''}`}
                    data-menu={elemento.id}
                    aria-label={elemento.etiqueta}
                    aria-expanded={elemento.tieneSubmenu ? (
                      (elemento.id === 'Ventas' && ventasAbierto) ||
                      (elemento.id === 'Documentos' && documentosAbierto) ||
                      (elemento.id === 'Operaciones' && operacionesAbierto) ||
                      (elemento.id === 'Servicios' && serviciosAbierto) ||
                      (elemento.id === 'Mantenimiento' && mantenimientoAbierto)
                    ) : undefined}
                  >
                    {/* Contenedor de icono */}
                    <div className="contenedor-icono-navegacion">
                      <ComponenteIcono className="icono-navegacion" />
                    </div>

                    {/* Texto */}
                    <span className={`texto-navegacion ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                      {elemento.etiqueta}
                    </span>

                    {/* Flecha del submenú */}
                    {elemento.tieneSubmenu && (
                      <div className="flecha-submenu">
                        {(elemento.id === 'Ventas' && ventasAbierto) ||
                          (elemento.id === 'Documentos' && documentosAbierto) ||
                          (elemento.id === 'Operaciones' && operacionesAbierto) ||
                          (elemento.id === 'Servicios' && serviciosAbierto) ||
                          (elemento.id === 'Mantenimiento' && mantenimientoAbierto) ? (
                          <ChevronUp className="icono-flecha" />
                        ) : (
                          <ChevronDown className="icono-flecha" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Tooltip flotante para sidebar colapsado - Solo en móvil cuando está cerrado */}
                  {(responsive.esMovil || responsive.esTablet) && !estaAbierto && renderTooltipSubmenu(elemento)}

                  {/* Submenú expandido */}
                  {elemento.tieneSubmenu && (((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido)) && (
                    ((elemento.id === 'Ventas' && ventasAbierto) ||
                      (elemento.id === 'Documentos' && documentosAbierto) ||
                      (elemento.id === 'Operaciones' && operacionesAbierto) ||
                      (elemento.id === 'Servicios' && serviciosAbierto) ||
                      (elemento.id === 'Mantenimiento' && mantenimientoAbierto))
                  ) && (
                      <ul className="submenu">
                        {elemento.submenu.map(subElemento => renderElementoSubmenu(subElemento))}
                      </ul>
                    )}
                </li>
              );
            })}
          </ul>

          {/* Botón de Ver Perfil - PRIMERO (solo en móvil) */}
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

          {/* Botón de Cerrar Sesión - SEGUNDO */}
          <div className="seccion-cerrar-sesion">
            <button className="btn-cerrar-sesion" aria-label="Cerrar sesión">
              <LogOut className="icono-cerrar-sesion" />
              <span className={`texto-cerrar-sesion ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                Cerrar Sesión
              </span>
            </button>
          </div>

          {/* Sección de Modo Oscuro - SEGUNDO */}
          <div className="seccion-modo-oscuro">
            <button
              className="btn-modo-oscuro"
              onClick={alternarModoOscuro}
              aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {modoOscuro ? (
                <Sun className="icono-modo-oscuro" />
              ) : (
                <Moon className="icono-modo-oscuro" />
              )}
              <span className={`texto-modo-oscuro ${((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido) ? 'visible' : 'oculto'}`}>
                {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
              </span>
              {(((responsive.esMovil || responsive.esTablet) && estaAbierto) || (!(responsive.esMovil || responsive.esTablet) && hoverExpandido)) && <div className="toggle-modo-oscuro"></div>}
            </button>
          </div>


        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;