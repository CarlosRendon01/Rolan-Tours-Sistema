import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, Home, Hotel, Plus, Users } from 'lucide-react';
import './TablaHospedaje.css';

const TablaHospedaje = ({
  hospedajes,
  onVer,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const hospedajesFiltrados = hospedajes.filter(hospedaje => {
    const busqueda = terminoBusqueda.toLowerCase();
    return (
      hospedaje.nombre_servicio.toLowerCase().includes(busqueda) ||
      hospedaje.codigo_servicio.toLowerCase().includes(busqueda) ||
      hospedaje.tipo_hospedaje.toLowerCase().includes(busqueda) ||
      hospedaje.nombre_proveedor.toLowerCase().includes(busqueda)
    );
  });

  const totalRegistros = hospedajesFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const hospedajesPaginados = hospedajesFiltrados.slice(indiceInicio, indiceFin);

  const totalHospedajes = hospedajes.length;
  const hospedajesActivos = hospedajes.filter(h => h.estado === 'Activo').length;

  const obtenerClaseTipoHospedaje = (tipo) => {
    const tipos = {
      'Hotel': 'hotel',
      'Cabaña': 'cabana',
      'Hostal': 'hostal',
      'Villa': 'villa',
      'Apartamento': 'apartamento'
    };
    return tipos[tipo] || 'hotel';
  };

  const obtenerClaseEstado = (estado) => {
    const estados = {
      'Activo': 'activo',
      'Inactivo': 'inactivo',
      'En mantenimiento': 'mantenimiento'
    };
    return estados[estado] || 'inactivo';
  };

  const formatearPrecio = (precio, moneda) => {
    const simbolos = {
      'MXN': '$',
      'USD': '$',
      'EUR': '€'
    };
    const precioNumero = parseFloat(precio) || 0; // ✅ Convertir a número
    return `${simbolos[moneda] || '$'}${precioNumero.toFixed(2)} ${moneda}`;
  };

  const obtenerIconoTipoHospedaje = (tipo) => {
    switch (tipo) {
      case 'Hotel':
        return <Hotel size={18} />;
      case 'Cabaña':
      case 'Villa':
      case 'Apartamento':
        return <Home size={18} />;
      default:
        return <Hotel size={18} />;
    }
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

  const manejarAccion = (accion, hospedaje) => {
    switch (accion) {
      case 'ver':
        onVer(hospedaje);
        break;
      case 'editar':
        onEditar(hospedaje);
        break;
      case 'eliminar':
        onEliminar(hospedaje);
        break;
      default:
        break;
    }
  };

  return (
    <div className="hospedaje-contenedor-principal">
      <div className="hospedaje-encabezado">
        <div className="hospedaje-seccion-logo">
          <div className="hospedaje-lineas-decorativas">
            <div className="hospedaje-linea hospedaje-azul"></div>
            <div className="hospedaje-linea hospedaje-verde"></div>
            <div className="hospedaje-linea hospedaje-amarilla"></div>
            <div className="hospedaje-linea hospedaje-roja"></div>
          </div>
          <h1 className="hospedaje-titulo">Gestión de Hospedaje</h1>
        </div>

        <div className="hospedaje-contenedor-estadisticas">
          <div className="hospedaje-estadistica">
            <div className="hospedaje-icono-estadistica-circular">
              <Hotel size={20} />
            </div>
            <div className="hospedaje-info-estadistica">
              <span className="hospedaje-label-estadistica">TOTAL: {totalHospedajes}</span>
            </div>
          </div>

          <div className="hospedaje-estadistica">
            <div className="hospedaje-icono-estadistica-cuadrado">
              <Home size={20} />
            </div>
            <div className="hospedaje-info-estadistica">
              <span className="hospedaje-label-estadistica">ACTIVOS: {hospedajesActivos}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hospedaje-controles">
        <div className="hospedaje-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="hospedaje-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="hospedaje-controles-derecha">
          <button
            className="hospedaje-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo servicio de hospedaje"
          >
            <Plus size={18} />
            Agregar Hospedaje
          </button>

          <div className="hospedaje-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="hospedaje-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar hospedaje..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="hospedaje-entrada-buscar"
              />
              <Search className="hospedaje-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {hospedajesPaginados.length === 0 ? (
        <div className="hospedaje-estado-vacio">
          <div className="hospedaje-icono-vacio">
            <Hotel size={80} strokeWidth={1.5} />
          </div>
          <p className="hospedaje-mensaje-vacio">No se encontraron servicios de hospedaje</p>
          <p className="hospedaje-submensaje-vacio">
            {terminoBusqueda
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando un servicio de hospedaje'}
          </p>
        </div>
      ) : (
        <>
          <div className="hospedaje-contenedor-tabla">
            <table className="hospedaje-tabla">
              <thead>
                <tr className="hospedaje-fila-encabezado">
                  <th>CÓDIGO</th>
                  <th>SERVICIO</th>
                  <th>TIPO HOSPEDAJE</th>
                  <th>HABITACIÓN</th>
                  <th>CAPACIDAD</th>
                  <th>PRECIO</th>
                  <th>PROVEEDOR</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {hospedajesPaginados.map((hospedaje, index) => {
                  return (
                    <tr
                      key={hospedaje.id}
                      className="hospedaje-fila-hospedaje"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="Código" className="hospedaje-columna-codigo">
                        <span className="hospedaje-badge-codigo">
                          {hospedaje.codigo_servicio}
                        </span>
                      </td>

                      <td data-label="Servicio" className="hospedaje-columna-servicio">
                        <div className="hospedaje-info-servicio">
                          <div className="hospedaje-icono-servicio">
                            {obtenerIconoTipoHospedaje(hospedaje.tipo_hospedaje)}
                          </div>
                          <div className="hospedaje-datos-servicio">
                            <span className="hospedaje-nombre-servicio">
                              {hospedaje.nombre_servicio}
                            </span>
                            <span className="hospedaje-subtexto">{hospedaje.tipo_paquete}</span>
                          </div>
                        </div>
                      </td>

                      <td data-label="Tipo Hospedaje" className="hospedaje-columna-tipo">
                        <span className={`hospedaje-badge-tipo ${obtenerClaseTipoHospedaje(hospedaje.tipo_hospedaje)}`}>
                          {hospedaje.tipo_hospedaje}
                        </span>
                      </td>

                      <td data-label="Habitación" className="hospedaje-columna-habitacion">
                        <span className="hospedaje-badge-habitacion">
                          {hospedaje.tipo_habitacion}
                        </span>
                      </td>

                      <td data-label="Capacidad" className="hospedaje-columna-capacidad">
                        <span className="hospedaje-badge-capacidad">
                          <Users size={14} />
                          {hospedaje.capacidad} {hospedaje.capacidad === 1 ? 'huésped' : 'huéspedes'}
                        </span>
                      </td>

                      <td data-label="Precio" className="hospedaje-columna-precio">
                        <div className="hospedaje-precio-contenedor">
                          <span className="hospedaje-precio-principal">
                            {formatearPrecio(hospedaje.precio_base, hospedaje.moneda)}
                          </span>
                          <span className="hospedaje-precio-tipo">
                            {hospedaje.tipo_paquete}
                          </span>
                        </div>
                      </td>

                      <td data-label="Proveedor" className="hospedaje-columna-proveedor">
                        <span className="hospedaje-proveedor-texto">
                          {hospedaje.nombre_proveedor}
                        </span>
                      </td>

                      <td data-label="Estado" className="hospedaje-columna-estado">
                        <span className={`hospedaje-badge-estado ${obtenerClaseEstado(hospedaje.estado)}`}>
                          {hospedaje.estado}
                        </span>
                      </td>

                      <td data-label="Acciones" className="hospedaje-columna-acciones">
                        <div className="hospedaje-botones-accion">
                          <button
                            className="hospedaje-boton-accion hospedaje-ver"
                            onClick={() => manejarAccion('ver', hospedaje)}
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="hospedaje-boton-accion hospedaje-editar"
                            onClick={() => manejarAccion('editar', hospedaje)}
                            title="Editar hospedaje"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="hospedaje-boton-accion hospedaje-eliminar"
                            onClick={() => manejarAccion('eliminar', hospedaje)}
                            title="Eliminar hospedaje"
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

          <div className="hospedaje-pie-tabla">
            <div className="hospedaje-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
                  (filtrado de {hospedajes.length} registros totales)
                </span>
              )}
            </div>

            <div className="hospedaje-controles-paginacion">
              <button
                className="hospedaje-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="hospedaje-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`hospedaje-numero-pagina ${paginaActual === numero ? 'hospedaje-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                className="hospedaje-boton-paginacion"
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

export default TablaHospedaje;