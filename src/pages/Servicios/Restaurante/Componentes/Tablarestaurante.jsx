import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, UtensilsCrossed, ChefHat, Plus, DollarSign } from 'lucide-react';
import './TablaRestaurante.css';

const TablaRestaurante = ({ 
  restaurantes,
  setRestaurantes,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  // Estados locales para UI
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar restaurantes por búsqueda
  const restaurantesFiltrados = restaurantes.filter(restaurante => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      restaurante.nombre_servicio.toLowerCase().includes(busqueda) ||
      restaurante.tipo_servicio.toLowerCase().includes(busqueda) ||
      restaurante.codigo_servicio.toLowerCase().includes(busqueda) ||
      restaurante.nombre_proveedor.toLowerCase().includes(busqueda) ||
      restaurante.categoria.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = restaurantesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const restaurantesPaginados = restaurantesFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalRestaurantes = restaurantes.length;
  const restaurantesActivos = restaurantes.filter(r => r.disponibilidad && r.estado === 'Activo').length;

  // Función para formatear precio
  const formatearPrecio = (precio, moneda) => {
    const simbolo = moneda === 'USD' ? '$' : '$';
    return `${simbolo}${precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${moneda}`;
  };

  // Función para obtener iniciales del tipo de servicio
  const obtenerInicialesServicio = (tipo) => {
    const palabras = tipo.split(' ');
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return tipo.substring(0, 2).toUpperCase();
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

  const manejarAccion = (accion, restaurante) => {
    switch (accion) {
      case 'ver':
        onVer(restaurante);
        break;
      case 'editar':
        onEditar(restaurante);
        break;
      case 'eliminar':
        onEliminar(restaurante);
        break;
      default:
        break;
    }
  };

  return (
    <div className="resto-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="resto-encabezado">
        <div className="resto-seccion-logo">
          <div className="resto-lineas-decorativas">
            <div className="resto-linea resto-naranja"></div>
            <div className="resto-linea resto-roja"></div>
            <div className="resto-linea resto-amarilla"></div>
            <div className="resto-linea resto-verde"></div>
          </div>
          <h1 className="resto-titulo">Gestión de Restaurante</h1>
        </div>
        
        {/* Estadísticas */}
        <div className="resto-contenedor-estadisticas">
          <div className="resto-estadistica">
            <div className="resto-icono-estadistica-circular">
              <UtensilsCrossed size={20} />
            </div>
            <div className="resto-info-estadistica">
              <span className="resto-label-estadistica">TOTAL: {totalRestaurantes}</span>
            </div>
          </div>
          
          <div className="resto-estadistica">
            <div className="resto-icono-estadistica-cuadrado">
              <ChefHat size={20} />
            </div>
            <div className="resto-info-estadistica">
              <span className="resto-label-estadistica">ACTIVOS: {restaurantesActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="resto-controles">
        <div className="resto-control-registros">
          <label htmlFor="resto-registros">Mostrar</label>
          <select 
            id="resto-registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="resto-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="resto-controles-derecha">
          <button 
            className="resto-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo servicio de restaurante"
          >
            <Plus size={18} />
            Agregar Servicio
          </button>

          <div className="resto-control-busqueda">
            <label htmlFor="resto-buscar">Buscar:</label>
            <div className="resto-entrada-busqueda">
              <input
                type="text"
                id="resto-buscar"
                placeholder="Buscar servicio..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="resto-entrada-buscar"
              />
              <Search className="resto-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {restaurantesPaginados.length === 0 ? (
        <div className="resto-estado-vacio">
          <div className="resto-icono-vacio">
            <UtensilsCrossed size={80} strokeWidth={1.5} />
          </div>
          <p className="resto-mensaje-vacio">No se encontraron servicios de restaurante</p>
          <p className="resto-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un servicio de restaurante'}
          </p>
        </div>
      ) : (
        <>
          <div className="resto-contenedor-tabla">
            <table className="resto-tabla">
              <thead>
                <tr className="resto-fila-encabezado">
                  <th>CÓDIGO</th>
                  <th>SERVICIO</th>
                  <th>TIPO SERVICIO</th>
                  <th>CATEGORÍA</th>
                  <th>PAQUETE</th>
                  <th>PRECIO</th>
                  <th>RESTAURANTE</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {restaurantesPaginados.map((restaurante, index) => {
                  return (
                    <tr 
                      key={restaurante.id} 
                      className="resto-fila-restaurante"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="Código" className="resto-columna-codigo">
                        <span className="resto-badge-codigo">
                          {restaurante.codigo_servicio}
                        </span>
                      </td>
                      
                      <td data-label="Servicio" className="resto-columna-servicio">
                        <div className="resto-info-servicio">
                          <div className="resto-avatar">
                            {obtenerInicialesServicio(restaurante.tipo_servicio)}
                          </div>
                          <div className="resto-datos-servicio">
                            <span className="resto-nombre-principal">
                              {restaurante.nombre_servicio}
                            </span>
                            <span className="resto-subtexto">{restaurante.ubicacion_restaurante}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td data-label="Tipo Servicio" className="resto-columna-tipo">
                        <span className="resto-badge-tipo">
                          {restaurante.tipo_servicio}
                        </span>
                      </td>
                      
                      <td data-label="Categoría" className="resto-columna-categoria">
                        <span className="resto-badge-categoria">
                          {restaurante.categoria}
                        </span>
                      </td>
                      
                      <td data-label="Paquete" className="resto-columna-paquete">
                        <span className="resto-valor-paquete">
                          {restaurante.tipo_paquete}
                        </span>
                        {restaurante.duracion_paquete && (
                          <div className="resto-subtexto" style={{ marginTop: '0.25rem' }}>
                            {restaurante.duracion_paquete}
                          </div>
                        )}
                      </td>
                      
                      <td data-label="Precio" className="resto-columna-precio">
                        <span className="resto-valor-precio">
                          <DollarSign size={14} />
                          {formatearPrecio(restaurante.precio_base, restaurante.moneda)}
                        </span>
                      </td>
                      
                      <td data-label="Restaurante" className="resto-columna-proveedor">
                        <span className="resto-valor-proveedor">
                          {restaurante.nombre_proveedor}
                        </span>
                      </td>
                      
                      <td data-label="Estado" className="resto-columna-estado">
                        <span className={`resto-badge-estado ${restaurante.estado.toLowerCase()} ${!restaurante.disponibilidad ? 'no-disponible' : ''}`}>
                          {restaurante.disponibilidad ? restaurante.estado : 'No disponible'}
                        </span>
                      </td>
                      
                      <td data-label="Acciones" className="resto-columna-acciones">
                        <div className="resto-botones-accion">
                          <button 
                            className="resto-boton-accion resto-ver"
                            onClick={() => manejarAccion('ver', restaurante)}
                            title="Ver servicio"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="resto-boton-accion resto-editar"
                            onClick={() => manejarAccion('editar', restaurante)}
                            title="Editar servicio"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="resto-boton-accion resto-eliminar"
                            onClick={() => manejarAccion('eliminar', restaurante)}
                            title="Eliminar servicio"
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
          <div className="resto-pie-tabla">
            <div className="resto-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {restaurantes.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="resto-controles-paginacion">
              <button 
                className="resto-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="resto-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`resto-numero-pagina ${paginaActual === numero ? 'resto-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="resto-boton-paginacion"
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

export default TablaRestaurante;