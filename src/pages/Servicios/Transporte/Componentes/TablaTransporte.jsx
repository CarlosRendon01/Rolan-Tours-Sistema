import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Truck, Package, Plus, DollarSign } from 'lucide-react';
import './TablaTransporte.css';

const TablaTransporte = ({ 
  transportes,
  setTransportes,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  // Estados locales para UI
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar transportes por búsqueda
  const transportesFiltrados = transportes.filter(transporte => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      transporte.nombre_servicio.toLowerCase().includes(busqueda) ||
      transporte.tipo_transporte.toLowerCase().includes(busqueda) ||
      transporte.codigo_servicio.toLowerCase().includes(busqueda) ||
      transporte.nombre_proveedor.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = transportesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const transportesPaginados = transportesFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalTransportes = transportes.length;
  const transportesActivos = transportes.filter(t => t.disponibilidad && t.estado === 'Activo').length;

  // Función para formatear precio
  const formatearPrecio = (precio, moneda) => {
    const simbolo = moneda === 'USD' ? '$' : '$';
    return `${simbolo}${precio.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${moneda}`;
  };

  // Función para obtener iniciales del tipo de transporte
  const obtenerInicialesTransporte = (tipo) => {
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

  const manejarAccion = (accion, transporte) => {
    switch (accion) {
      case 'ver':
        onVer(transporte);
        break;
      case 'editar':
        onEditar(transporte);
        break;
      case 'eliminar':
        onEliminar(transporte);
        break;
      default:
        break;
    }
  };

  return (
    <div className="transporte-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="transporte-encabezado">
        <div className="transporte-seccion-logo">
          <div className="transporte-lineas-decorativas">
            <div className="transporte-linea transporte-azul"></div>
            <div className="transporte-linea transporte-verde"></div>
            <div className="transporte-linea transporte-amarilla"></div>
            <div className="transporte-linea transporte-roja"></div>
          </div>
          <h1 className="transporte-titulo">Gestión de Transporte</h1>
        </div>
        
        {/* Estadísticas */}
        <div className="transporte-contenedor-estadisticas">
          <div className="transporte-estadistica">
            <div className="transporte-icono-estadistica-circular">
              <Truck size={20} />
            </div>
            <div className="transporte-info-estadistica">
              <span className="transporte-label-estadistica">TOTAL: {totalTransportes}</span>
            </div>
          </div>
          
          <div className="transporte-estadistica">
            <div className="transporte-icono-estadistica-cuadrado">
              <Package size={20} />
            </div>
            <div className="transporte-info-estadistica">
              <span className="transporte-label-estadistica">ACTIVOS: {transportesActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="transporte-controles">
        <div className="transporte-control-registros">
          <label htmlFor="transporte-registros">Mostrar</label>
          <select 
            id="transporte-registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="transporte-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="transporte-controles-derecha">
          <button 
            className="transporte-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo servicio de transporte"
          >
            <Plus size={18} />
            Agregar Servicio
          </button>

          <div className="transporte-control-busqueda">
            <label htmlFor="transporte-buscar">Buscar:</label>
            <div className="transporte-entrada-busqueda">
              <input
                type="text"
                id="transporte-buscar"
                placeholder="Buscar servicio..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="transporte-entrada-buscar"
              />
              <Search className="transporte-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {transportesPaginados.length === 0 ? (
        <div className="transporte-estado-vacio">
          <div className="transporte-icono-vacio">
            <Truck size={80} strokeWidth={1.5} />
          </div>
          <p className="transporte-mensaje-vacio">No se encontraron servicios de transporte</p>
          <p className="transporte-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un servicio de transporte'}
          </p>
        </div>
      ) : (
        <>
          <div className="transporte-contenedor-tabla">
            <table className="transporte-tabla">
              <thead>
                <tr className="transporte-fila-encabezado">
                  <th>CÓDIGO</th>
                  <th>SERVICIO</th>
                  <th>TIPO TRANSPORTE</th>
                  <th>CAPACIDAD</th>
                  <th>PAQUETE</th>
                  <th>PRECIO</th>
                  <th>PROVEEDOR</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {transportesPaginados.map((transporte, index) => {
                  return (
                    <tr 
                      key={transporte.id} 
                      className="transporte-fila-transporte"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="Código" className="transporte-columna-codigo">
                        <span className="transporte-badge-codigo">
                          {transporte.codigo_servicio}
                        </span>
                      </td>
                      
                      <td data-label="Servicio" className="transporte-columna-servicio">
                        <div className="transporte-info-servicio">
                          <div className="transporte-avatar">
                            {obtenerInicialesTransporte(transporte.tipo_transporte)}
                          </div>
                          <div className="transporte-datos-servicio">
                            <span className="transporte-nombre-principal">
                              {transporte.nombre_servicio}
                            </span>
                            <span className="transporte-subtexto">{transporte.ubicacion_salida} → {transporte.ubicacion_destino}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td data-label="Tipo Transporte" className="transporte-columna-tipo">
                        <span className="transporte-badge-tipo">
                          {transporte.tipo_transporte}
                        </span>
                      </td>
                      
                      <td data-label="Capacidad" className="transporte-columna-capacidad">
                        <span className="transporte-valor-capacidad">
                          {transporte.capacidad} pasajeros
                        </span>
                      </td>
                      
                      <td data-label="Paquete" className="transporte-columna-paquete">
                        <span className="transporte-valor-paquete">
                          {transporte.tipo_paquete}
                        </span>
                        {transporte.duracion_paquete && (
                          <div className="transporte-subtexto" style={{ marginTop: '0.25rem' }}>
                            {transporte.duracion_paquete}
                          </div>
                        )}
                      </td>
                      
                      <td data-label="Precio" className="transporte-columna-precio">
                        <span className="transporte-valor-precio">
                          <DollarSign size={14} />
                          {formatearPrecio(transporte.precio_base, transporte.moneda)}
                        </span>
                      </td>
                      
                      <td data-label="Proveedor" className="transporte-columna-proveedor">
                        <span className="transporte-valor-proveedor">
                          {transporte.nombre_proveedor}
                        </span>
                      </td>
                      
                      <td data-label="Estado" className="transporte-columna-estado">
                        <span className={`transporte-badge-estado ${transporte.estado.toLowerCase()} ${!transporte.disponibilidad ? 'no-disponible' : ''}`}>
                          {transporte.disponibilidad ? transporte.estado : 'No disponible'}
                        </span>
                      </td>
                      
                      <td data-label="Acciones" className="transporte-columna-acciones">
                        <div className="transporte-botones-accion">
                          <button 
                            className="transporte-boton-accion transporte-ver"
                            onClick={() => manejarAccion('ver', transporte)}
                            title="Ver servicio"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="transporte-boton-accion transporte-editar"
                            onClick={() => manejarAccion('editar', transporte)}
                            title="Editar servicio"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="transporte-boton-accion transporte-eliminar"
                            onClick={() => manejarAccion('eliminar', transporte)}
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
          <div className="transporte-pie-tabla">
            <div className="transporte-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {transportes.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="transporte-controles-paginacion">
              <button 
                className="transporte-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="transporte-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`transporte-numero-pagina ${paginaActual === numero ? 'transporte-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="transporte-boton-paginacion"
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

export default TablaTransporte;