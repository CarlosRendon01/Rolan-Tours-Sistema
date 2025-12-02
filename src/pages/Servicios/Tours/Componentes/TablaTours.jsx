import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, MapPin, Map, Plus, Clock, Users, DollarSign } from 'lucide-react';
import './TablaTours.css';

const TablaTours = ({ 
  tours,
  setTours,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  // Estados locales para UI (paginación, búsqueda)
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar tours por búsqueda
  const toursFiltrados = tours.filter(tour => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      tour.nombre_tour.toLowerCase().includes(busqueda) ||
      tour.codigo_tour.toLowerCase().includes(busqueda) ||
      tour.tipo_tour.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = toursFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const toursPaginados = toursFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalTours = tours.length;
  const toursActivos = tours.filter(tour => tour.estado === 'activo').length;

  // Función para formatear precio
  const formatearPrecio = (precio, moneda = 'MXN') => {
    const simbolos = {
      'MXN': '$',
      'USD': '$',
      'EUR': '€'
    };
    return `${simbolos[moneda] || '$'}${precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Función para obtener iniciales
  const obtenerIniciales = (nombreTour) => {
    const palabras = nombreTour.split(' ');
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`;
    }
    return nombreTour.substring(0, 2).toUpperCase();
  };

  // Función para obtener clase de estado
  const obtenerClaseEstado = (estado) => {
    const estados = {
      'Activo': 'activo',
      'Inactivo': 'inactivo',
      'Mantenimiento': 'mantenimiento'
    };
    return estados[estado.toLowerCase()] || 'inactivo';
  };

  // Función para formatear duración
  const formatearDuracion = (duracion) => {
    if (duracion.includes('hora')) {
      return duracion;
    }
    return `${duracion} hrs`;
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const manejarCambioRegistros = (evento) => {
    setRegistrosPorPagina(parseInt(evento.target.value));
    setPaginaActual(1);
  };

  const manejarBusqueda = (evento) => {
    setTerminoBusqueda(evento.target.value);
    setPaginaActual(1);
  };

  const manejarAccion = (accion, tour) => {
    switch (accion) {
      case 'ver':
        onVer(tour);
        break;
      case 'editar':
        onEditar(tour);
        break;
      case 'eliminar':
        onEliminar(tour);
        break;
      default:
        break;
    }
  };

  return (
    <div className="tours-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="tours-encabezado">
        <div className="tours-seccion-logo">
          <div className="tours-lineas-decorativas">
            <div className="tours-linea tours-azul"></div>
            <div className="tours-linea tours-verde"></div>
            <div className="tours-linea tours-amarilla"></div>
            <div className="tours-linea tours-roja"></div>
          </div>
          <h1 className="tours-titulo">Gestión de Tours</h1>
        </div>
        
        {/* Estadísticas */}
        <div className="tours-contenedor-estadisticas">
          <div className="tours-estadistica">
            <div className="tours-icono-estadistica-circular">
              <Map size={20} />
            </div>
            <div className="tours-info-estadistica">
              <span className="tours-label-estadistica">TOTAL: {totalTours}</span>
            </div>
          </div>
          
          <div className="tours-estadistica">
            <div className="tours-icono-estadistica-cuadrado">
              <MapPin size={20} />
            </div>
            <div className="tours-info-estadistica">
              <span className="tours-label-estadistica">ACTIVOS: {toursActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="tours-controles">
        <div className="tours-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select 
            id="registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="tours-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="tours-controles-derecha">
          <button 
            className="tours-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo tour"
          >
            <Plus size={18} />
            Agregar Tour
          </button>

          <div className="tours-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="tours-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar tour..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="tours-entrada-buscar"
              />
              <Search className="tours-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {toursPaginados.length === 0 ? (
        <div className="tours-estado-vacio">
          <div className="tours-icono-vacio">
            <Map size={80} strokeWidth={1.5} />
          </div>
          <p className="tours-mensaje-vacio">No se encontraron tours</p>
          <p className="tours-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un tour a tu catálogo'}
          </p>
        </div>
      ) : (
        <>
          <div className="tours-contenedor-tabla">
            <table className="tours-tabla">
              <thead>
                <tr className="tours-fila-encabezado">
                  <th>CÓDIGO</th>
                  <th>NOMBRE TOUR</th>
                  <th>TIPO</th>
                  <th>DURACIÓN</th>
                  <th>CAPACIDAD</th>
                  <th>PRECIO</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {toursPaginados.map((tour, index) => {
                  return (
                    <tr 
                      key={tour.codigo_tour} 
                      className="tours-fila-tour"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="Código" className="tours-columna-codigo">
                        <span className="tours-badge-codigo">
                          {tour.codigo_tour}
                        </span>
                      </td>
                      
                      <td data-label="Nombre Tour" className="tours-columna-nombre">
                        <div className="tours-info-tour">
                          <div className="tours-icono-tour">
                            {obtenerIniciales(tour.nombre_tour)}
                          </div>
                          <div className="tours-datos-tour">
                            <span className="tours-nombre-principal">
                              {tour.nombre_tour}
                            </span>
                            <span className="tours-subtexto">{tour.operado_por}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td data-label="Tipo" className="tours-columna-tipo">
                        <span className="tours-badge-tipo">
                          {tour.tipo_tour}
                        </span>
                      </td>
                      
                      <td data-label="Duración" className="tours-columna-duracion">
                        <span className="tours-valor-duracion">
                          <Clock size={14} />
                          {formatearDuracion(tour.duracion_tour)}
                        </span>
                      </td>
                      
                      <td data-label="Capacidad" className="tours-columna-capacidad">
                        <span className="tours-valor-capacidad">
                          <Users size={14} />
                          {tour.capacidad_maxima} pax
                        </span>
                      </td>
                      
                      <td data-label="Precio" className="tours-columna-precio">
                        <span className="tours-valor-precio">
                          <DollarSign size={14} />
                          {formatearPrecio(tour.precio_base, tour.moneda)}
                        </span>
                      </td>
                      
                      <td data-label="Estado" className="tours-columna-estado">
                        <span className={`tours-badge-estado ${obtenerClaseEstado(tour.estado)}`}>
                          {tour.estado}
                        </span>
                      </td>
                      
                      <td data-label="Acciones" className="tours-columna-acciones">
                        <div className="tours-botones-accion">
                          <button 
                            className="tours-boton-accion tours-ver"
                            onClick={() => manejarAccion('ver', tour)}
                            title="Ver tour"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="tours-boton-accion tours-editar"
                            onClick={() => manejarAccion('editar', tour)}
                            title="Editar tour"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="tours-boton-accion tours-eliminar"
                            onClick={() => manejarAccion('eliminar', tour)}
                            title="Eliminar tour"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Información de paginación y controles */}
          <div className="tours-pie-tabla">
            <div className="tours-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {tours.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="tours-controles-paginacion">
              <button 
                className="tours-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="tours-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`tours-numero-pagina ${paginaActual === numero ? 'tours-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="tours-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TablaTours;