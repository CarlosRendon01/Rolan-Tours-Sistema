import React, { useState } from 'react';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, UserCheck, Users, Plus, Phone } from 'lucide-react';
import './TablaReservas.css';

const TablaReservas = ({
  reservas = [],
  setReservas,
  onVer,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const reservasFiltradas = reservas.filter(reserva => {
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCompleto = `${reserva.nombre} ${reserva.apellidoPaterno} ${reserva.apellidoMaterno}`.toLowerCase();
    return (
      nombreCompleto.includes(busqueda) ||
      reserva.id.toString().includes(busqueda) ||
      reserva.correoElectronico.toLowerCase().includes(busqueda)
    );
  });

  const totalRegistros = reservasFiltradas.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const reservasPaginadas = reservasFiltradas.slice(indiceInicio, indiceFin);

  const totalReservas = reservas.length;
  const reservasActivas = reservas.filter(g => g.activo !== false).length;

  const formatearTelefono = (telefono) => {
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  const obtenerIniciales = (nombre, apellidoP) => {
    return `${nombre.charAt(0)}${apellidoP.charAt(0)}`;
  };

  const obtenerClaseGenero = (genero) => {
    const generoLower = genero.toLowerCase();
    if (generoLower === 'masculino' || generoLower === 'm') return 'masculino';
    if (generoLower === 'femenino' || generoLower === 'f') return 'femenino';
    return 'otro';
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

  const manejarAccion = (accion, reserva) => {
    switch (accion) {
      case 'ver':
        onVer(reserva);
        break;
      case 'editar':
        onEditar(reserva);
        break;
      case 'eliminar':
        onEliminar(reserva);
        break;
      default:
        break;
    }
  };

  return (
    <div className="reservas-contenedor-principal">
      <div className="reservas-encabezado">
        <div className="reservas-seccion-logo">
          <div className="reservas-lineas-decorativas">
            <div className="reservas-linea reservas-azul"></div>
            <div className="reservas-linea reservas-verde"></div>
            <div className="reservas-linea reservas-amarilla"></div>
            <div className="reservas-linea reservas-morada"></div>
          </div>
          <h1 className="reservas-titulo">Gestión de Guías Turísticos</h1>
        </div>

        <div className="reservas-contenedor-estadisticas">
          <div className="reservas-estadistica">
            <div className="reservas-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="reservas-info-estadistica">
              <span className="reservas-label-estadistica">TOTAL: {totalReservas}</span>
            </div>
          </div>

          <div className="reservas-estadistica">
            <div className="reservas-icono-estadistica-cuadrado">
              <UserCheck size={20} />
            </div>
            <div className="reservas-info-estadistica">
              <span className="reservas-label-estadistica">ACTIVOS: {reservasActivas}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reservas-controles">
        <div className="reservas-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="reservas-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="reservas-controles-derecha">
          <button
            className="reservas-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo guía"
          >
            <Plus size={18} />
            Agregar Guía
          </button>

          <div className="reservas-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="reservas-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar guía..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="reservas-entrada-buscar"
              />
              <Search className="reservas-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {reservasPaginadas.length === 0 ? (
        <div className="reservas-estado-vacio">
          <div className="reservas-icono-vacio">
            <Users size={80} strokeWidth={1.5} />
          </div>
          <p className="reservas-mensaje-vacio">No se encontraron guías turísticos</p>
          <p className="reservas-submensaje-vacio">
            {terminoBusqueda
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando un guía turístico a tu equipo'}
          </p>
        </div>
      ) : (
        <>
          <div className="reservas-contenedor-tabla">
            <table className="reservas-tabla">
              <thead>
                <tr className="reservas-fila-encabezado">
                  <th>ID</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EDAD</th>
                  <th>GÉNERO</th>
                  <th>TELÉFONO</th>
                  <th>IDIOMAS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {reservasPaginadas.map((reserva, index) => (
                  <tr
                    key={reserva.id}
                    className="reservas-fila-reserva"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td data-label="ID" className="reservas-columna-id">
                      <span className="reservas-badge-id">
                        #{reserva.id.toString().padStart(3, '0')}
                      </span>
                    </td>

                    <td data-label="Nombre Completo" className="reservas-columna-nombre">
                      <div className="reservas-info-reserva">
                        <div className="reservas-avatar">
                          {obtenerIniciales(reserva.nombre, reserva.apellidoPaterno)}
                        </div>
                        <div className="reservas-datos-reserva">
                          <span className="reservas-nombre-principal">
                            {reserva.nombre} {reserva.apellidoPaterno} {reserva.apellidoMaterno}
                          </span>
                          <span className="reservas-subtexto">{reserva.correoElectronico}</span>
                        </div>
                      </div>
                    </td>

                    <td data-label="Edad" className="reservas-columna-edad">
                      <span className="reservas-badge-edad">
                        {reserva.edad} años
                      </span>
                    </td>

                    <td data-label="Género" className="reservas-columna-genero">
                      <span className={`reservas-badge-genero ${obtenerClaseGenero(reserva.genero)}`}>
                        {reserva.genero}
                      </span>
                    </td>

                    <td data-label="Teléfono" className="reservas-columna-telefono">
                      <span className="reservas-valor-telefono">
                        <Phone size={14} />
                        {formatearTelefono(reserva.telefonoPersonal)}
                      </span>
                    </td>

                    <td data-label="Idiomas" className="reservas-columna-idiomas">
                      <div className="reservas-badge-idiomas">
                        {reserva.idiomas && reserva.idiomas.map((idioma, idx) => (
                          <span key={idx} className="reservas-idioma-tag">
                            {idioma}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td data-label="Acciones" className="reservas-columna-acciones">
                      <div className="reservas-botones-accion">
                        <button
                          className="reservas-boton-accion reservas-ver"
                          onClick={() => manejarAccion('ver', reserva)}
                          title="Ver guía"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="reservas-boton-accion reservas-editar"
                          onClick={() => manejarAccion('editar', reserva)}
                          title="Editar guía"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="reservas-boton-accion reservas-eliminar"
                          onClick={() => manejarAccion('eliminar', reserva)}
                          title="Eliminar guía"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="reservas-pie-tabla">
            <div className="reservas-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
                  (filtrado de {reservas.length} registros totales)
                </span>
              )}
            </div>

            <div className="reservas-controles-paginacion">
              <button
                className="reservas-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="reservas-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`reservas-numero-pagina ${paginaActual === numero ? 'reservas-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                className="reservas-boton-paginacion"
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

export default TablaReservas;