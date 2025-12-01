import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Building2, Store, Plus, Phone, CreditCard } from 'lucide-react';
import './TablaProveedores.css';

const TablaProveedores = ({ 
  proveedores = [],
  setProveedores,
  onVer, 
  onEditar, 
  onEliminar,
  onAgregar 
}) => {
  // Estados locales para UI (paginación, búsqueda)
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrar proveedores por búsqueda
  const proveedoresFiltrados = proveedores.filter(proveedor => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      proveedor.nombre_razon_social?.toLowerCase().includes(busqueda) ||
      proveedor.id_proveedor?.toString().includes(busqueda) ||
      proveedor.rfc?.toLowerCase().includes(busqueda) ||
      proveedor.nombre_contacto?.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = proveedoresFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const proveedoresPaginados = proveedoresFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalProveedores = proveedores.length;
  const proveedoresActivos = proveedores.filter(p => p.estado === 'activo' || !p.estado).length;

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    if (!telefono) return 'N/A';
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  // Función para obtener iniciales o primera letra
  const obtenerIniciales = (razonSocial) => {
    if (!razonSocial) return '?';
    const palabras = razonSocial.trim().split(' ');
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return razonSocial.substring(0, 2).toUpperCase();
  };

  // Función para obtener color según tipo de proveedor
  const obtenerColorTipo = (tipo) => {
    const colores = {
      'Transporte': { bg: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
      'Hospedaje': { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      'Restaurante': { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      'Otro': { bg: '#f3e8ff', color: '#6b21a8', border: '#e9d5ff' }
    };
    return colores[tipo] || colores['Otro'];
  };

  // Función para obtener color según método de pago
  const obtenerColorMetodoPago = (metodo) => {
    const colores = {
      'Transferencia': { bg: '#d1fae5', color: '#065f46' },
      'Efectivo': { bg: '#fed7aa', color: '#9a3412' },
      'Otro': { bg: '#e0e7ff', color: '#3730a3' }
    };
    return colores[metodo] || colores['Otro'];
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

  const manejarAccion = (accion, proveedor) => {
    switch (accion) {
      case 'ver':
        onVer(proveedor);
        break;
      case 'editar':
        onEditar(proveedor);
        break;
      case 'eliminar':
        onEliminar(proveedor);
        break;
      default:
        break;
    }
  };

  return (
    <div className="proveedores-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="proveedores-encabezado">
        <div className="proveedores-seccion-logo">
          <div className="proveedores-lineas-decorativas">
            <div className="proveedores-linea proveedores-morado"></div>
            <div className="proveedores-linea proveedores-azul"></div>
            <div className="proveedores-linea proveedores-verde"></div>
            <div className="proveedores-linea proveedores-naranja"></div>
          </div>
          <h1 className="proveedores-titulo">Gestión de Proveedores</h1>
        </div>
        
        {/* Estadísticas */}
        <div className="proveedores-contenedor-estadisticas">
          <div className="proveedores-estadistica">
            <div className="proveedores-icono-estadistica-circular">
              <Store size={20} />
            </div>
            <div className="proveedores-info-estadistica">
              <span className="proveedores-label-estadistica">TOTAL: {totalProveedores}</span>
            </div>
          </div>
          
          <div className="proveedores-estadistica">
            <div className="proveedores-icono-estadistica-cuadrado">
              <Building2 size={20} />
            </div>
            <div className="proveedores-info-estadistica">
              <span className="proveedores-label-estadistica">ACTIVOS: {proveedoresActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="proveedores-controles">
        <div className="proveedores-control-registros">
          <label htmlFor="proveedores-registros">Mostrar</label>
          <select 
            id="proveedores-registros"
            value={registrosPorPagina} 
            onChange={manejarCambioRegistros}
            className="proveedores-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="proveedores-controles-derecha">
          <button 
            className="proveedores-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo proveedor"
          >
            <Plus size={18} />
            Agregar Proveedor
          </button>

          <div className="proveedores-control-busqueda">
            <label htmlFor="proveedores-buscar">Buscar:</label>
            <div className="proveedores-entrada-busqueda">
              <input
                type="text"
                id="proveedores-buscar"
                placeholder="Buscar proveedor..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="proveedores-entrada-buscar"
              />
              <Search className="proveedores-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {proveedoresPaginados.length === 0 ? (
        <div className="proveedores-estado-vacio">
          <div className="proveedores-icono-vacio">
            <Store size={80} strokeWidth={1.5} />
          </div>
          <p className="proveedores-mensaje-vacio">No se encontraron proveedores</p>
          <p className="proveedores-submensaje-vacio">
            {terminoBusqueda 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza agregando un proveedor'}
          </p>
        </div>
      ) : (
        <>
          <div className="proveedores-contenedor-tabla">
            <table className="proveedores-tabla">
              <thead>
                <tr className="proveedores-fila-encabezado">
                  <th>ID</th>
                  <th>RAZÓN SOCIAL</th>
                  <th>TIPO</th>
                  <th>RFC</th>
                  <th>TELÉFONO</th>
                  <th>MÉTODO PAGO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {proveedoresPaginados.map((proveedor, index) => {
                  const colorTipo = obtenerColorTipo(proveedor.tipo_proveedor);
                  const colorMetodoPago = obtenerColorMetodoPago(proveedor.metodo_pago);
                  
                  return (
                    <tr 
                      key={proveedor.id_proveedor} 
                      className="proveedores-fila-proveedor"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="ID" className="proveedores-columna-id">
                        <span className="proveedores-badge-id">
                          #{proveedor.id_proveedor?.toString().padStart(3, '0')}
                        </span>
                      </td>
                      
                      <td data-label="Razón Social" className="proveedores-columna-nombre">
                        <div className="proveedores-info-proveedor">
                          <div className="proveedores-logo">
                            {proveedor.foto_proveedor ? (
                              <img 
                                src={proveedor.foto_proveedor} 
                                alt={proveedor.nombre_razon_social}
                                className="proveedores-imagen-logo"
                              />
                            ) : (
                              <span>{obtenerIniciales(proveedor.nombre_razon_social)}</span>
                            )}
                          </div>
                          <div className="proveedores-datos-proveedor">
                            <span className="proveedores-nombre-principal">
                              {proveedor.nombre_razon_social}
                            </span>
                            <span className="proveedores-subtexto">
                              {proveedor.nombre_contacto || 'Sin contacto'}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td data-label="Tipo" className="proveedores-columna-tipo">
                        <span 
                          className="proveedores-badge-tipo"
                          style={{
                            background: colorTipo.bg,
                            color: colorTipo.color,
                            border: `1px solid ${colorTipo.border}`
                          }}
                        >
                          {proveedor.tipo_proveedor || 'N/A'}
                        </span>
                      </td>
                      
                      <td data-label="RFC" className="proveedores-columna-rfc">
                        <span className="proveedores-valor-rfc">
                          {proveedor.rfc || 'N/A'}
                        </span>
                      </td>
                      
                      <td data-label="Teléfono" className="proveedores-columna-telefono">
                        <span className="proveedores-valor-telefono">
                          <Phone size={14} />
                          {formatearTelefono(proveedor.telefono)}
                        </span>
                      </td>
                      
                      <td data-label="Método de Pago" className="proveedores-columna-pago">
                        <span 
                          className="proveedores-badge-pago"
                          style={{
                            background: colorMetodoPago.bg,
                            color: colorMetodoPago.color
                          }}
                        >
                          <CreditCard size={14} />
                          {proveedor.metodo_pago || 'N/A'}
                        </span>
                      </td>
                      
                      <td data-label="Acciones" className="proveedores-columna-acciones">
                        <div className="proveedores-botones-accion">
                          <button 
                            className="proveedores-boton-accion proveedores-ver"
                            onClick={() => manejarAccion('ver', proveedor)}
                            title="Ver proveedor"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="proveedores-boton-accion proveedores-editar"
                            onClick={() => manejarAccion('editar', proveedor)}
                            title="Editar proveedor"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="proveedores-boton-accion proveedores-eliminar"
                            onClick={() => manejarAccion('eliminar', proveedor)}
                            title="Eliminar proveedor"
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
          <div className="proveedores-pie-tabla">
            <div className="proveedores-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{color: '#6c757d', marginLeft: '0.5rem'}}>
                  (filtrado de {proveedores.length} registros totales)
                </span>
              )}
            </div>
            
            <div className="proveedores-controles-paginacion">
              <button 
                className="proveedores-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>
              
              <div className="proveedores-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`proveedores-numero-pagina ${paginaActual === numero ? 'proveedores-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>
              
              <button 
                className="proveedores-boton-paginacion"
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

export default TablaProveedores;