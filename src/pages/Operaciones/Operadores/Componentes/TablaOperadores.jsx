import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Edit, Eye, ChevronLeft, ChevronRight, Trash2, UserCheck, Users, Plus, Phone } from 'lucide-react';
import './TablaOperadores.css';

const TablaOperadores = ({
  operadores,        // ✅ Recibe operadores desde el padre
  setOperadores,     // ✅ Por si necesitas actualizar (opcional)
  onVer,
  onEditar,
  onEliminar,
  onAgregar
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const cargarOperadores = async () => {
    try {
      setCargando(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/operadores", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      console.log("✅ Operadores cargados:", response.data);
      setOperadores(response.data);

    } catch (error) {
      console.error("❌ Error al cargar operadores:", error);
      setError("Error al cargar operadores");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOperadores();
  }, []);

  // Filtrar operadores por búsqueda
  const operadoresFiltrados = operadores.filter(operador => {
    const busqueda = terminoBusqueda.toLowerCase();
    const nombreCompleto = `${operador.nombre} ${operador.apellidoPaterno} ${operador.apellidoMaterno}`.toLowerCase();
    return (
      nombreCompleto.includes(busqueda) ||
      operador.id.toString().includes(busqueda) ||
      operador.numeroLicencia.toLowerCase().includes(busqueda)
    );
  });

  // Calcular paginación
  const totalRegistros = operadoresFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFin = indiceInicio + registrosPorPagina;
  const operadoresPaginados = operadoresFiltrados.slice(indiceInicio, indiceFin);

  // Calcular estadísticas
  const totalOperadores = operadores.length;
  const operadoresActivos = operadores.filter(op => {
    const hoy = new Date();
    const fechaVencimiento = new Date(op.fechaVencimientoLicencia);
    return fechaVencimiento > hoy;
  }).length;

  // Función para formatear teléfono
  const formatearTelefono = (telefono) => {
    const limpio = telefono.replace(/\D/g, '');
    if (limpio.length === 10) {
      return `(${limpio.substring(0, 3)}) ${limpio.substring(3, 6)}-${limpio.substring(6)}`;
    }
    return telefono;
  };

  // Función para obtener iniciales
  const obtenerIniciales = (nombre, apellidoP, apellidoM) => {
    return `${nombre.charAt(0)}${apellidoP.charAt(0)}`;
  };

  // Función para verificar vigencia de licencia
  const obtenerEstadoVigencia = (fechaVencimiento) => {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferenciaDias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (diferenciaDias < 0) {
      return { clase: 'vencida', texto: 'Vencida' };
    } else if (diferenciaDias <= 30) {
      return { clase: 'por-vencer', texto: 'Por vencer' };
    } else {
      return { clase: 'vigente', texto: 'Vigente' };
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  const manejarAccion = (accion, operador) => {
    switch (accion) {
      case 'ver':
        onVer(operador);
        break;
      case 'editar':
        onEditar(operador);
        break;
      case 'eliminar':
        onEliminar(operador);
        break;
      default:
        break;
    }
  };

  return (
    <div className="operadores-contenedor-principal">
      {/* Header con estadísticas */}
      <div className="operadores-encabezado">
        <div className="operadores-seccion-logo">
          <div className="operadores-lineas-decorativas">
            <div className="operadores-linea operadores-azul"></div>
            <div className="operadores-linea operadores-verde"></div>
            <div className="operadores-linea operadores-amarilla"></div>
            <div className="operadores-linea operadores-roja"></div>
          </div>
          <h1 className="operadores-titulo">Gestión de Operadores</h1>
        </div>

        {/* Estadísticas */}
        <div className="operadores-contenedor-estadisticas">
          <div className="operadores-estadistica">
            <div className="operadores-icono-estadistica-circular">
              <Users size={20} />
            </div>
            <div className="operadores-info-estadistica">
              <span className="operadores-label-estadistica">TOTAL: {totalOperadores}</span>
            </div>
          </div>

          <div className="operadores-estadistica">
            <div className="operadores-icono-estadistica-cuadrado">
              <UserCheck size={20} />
            </div>
            <div className="operadores-info-estadistica">
              <span className="operadores-label-estadistica">ACTIVOS: {operadoresActivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="operadores-controles">
        <div className="operadores-control-registros">
          <label htmlFor="registros">Mostrar</label>
          <select
            id="registros"
            value={registrosPorPagina}
            onChange={manejarCambioRegistros}
            className="operadores-selector-registros"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>registros</span>
        </div>

        <div className="operadores-controles-derecha">
          <button
            className="operadores-boton-agregar"
            onClick={onAgregar}
            title="Agregar nuevo operador"
          >
            <Plus size={18} />
            Agregar Operador
          </button>

          <div className="operadores-control-busqueda">
            <label htmlFor="buscar">Buscar:</label>
            <div className="operadores-entrada-busqueda">
              <input
                type="text"
                id="buscar"
                placeholder="Buscar operador..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="operadores-entrada-buscar"
              />
              <Search className="operadores-icono-buscar" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      {operadoresPaginados.length === 0 ? (
        <div className="operadores-estado-vacio">
          <div className="operadores-icono-vacio">
            <Users size={80} strokeWidth={1.5} />
          </div>
          <p className="operadores-mensaje-vacio">No se encontraron operadores</p>
          <p className="operadores-submensaje-vacio">
            {terminoBusqueda
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando un operador a tu equipo'}
          </p>
        </div>
      ) : (
        <>
          <div className="operadores-contenedor-tabla">
            <table className="operadores-tabla">
              <thead>
                <tr className="operadores-fila-encabezado">
                  <th>ID</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EDAD</th>
                  <th>TELÉFONO</th>
                  <th>N° LICENCIA</th>
                  <th>VIGENCIA LIC.</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {operadoresPaginados.map((operador, index) => {
                  const estadoVigencia = obtenerEstadoVigencia(operador.fechaVencimientoLicencia);

                  return (
                    <tr
                      key={operador.id}
                      className="operadores-fila-operador"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td data-label="ID" className="operadores-columna-id">
                        <span className="operadores-badge-id">
                          #{operador.id.toString().padStart(3, '0')}
                        </span>
                      </td>

                      <td data-label="Nombre Completo" className="operadores-columna-nombre">
                        <div className="operadores-info-operador">
                          <div className="operadores-avatar">
                            {obtenerIniciales(operador.nombre, operador.apellidoPaterno, operador.apellidoMaterno)}
                          </div>
                          <div className="operadores-datos-operador">
                            <span className="operadores-nombre-principal">
                              {operador.nombre} {operador.apellidoPaterno} {operador.apellidoMaterno}
                            </span>
                            <span className="operadores-subtexto">{operador.correoElectronico}</span>
                          </div>
                        </div>
                      </td>

                      <td data-label="Edad" className="operadores-columna-edad">
                        <span className="operadores-badge-edad">
                          {operador.edad} años
                        </span>
                      </td>

                      <td data-label="Teléfono" className="operadores-columna-telefono">
                        <span className="operadores-valor-telefono">
                          <Phone size={14} />
                          {formatearTelefono(operador.telefonoEmergencia)}
                        </span>
                      </td>

                      <td data-label="N° Licencia" className="operadores-columna-licencia">
                        <span className="operadores-valor-licencia">
                          {operador.numeroLicencia}
                        </span>
                      </td>

                      <td data-label="Vigencia" className="operadores-columna-vigencia">
                        <span className={`operadores-badge-vigencia ${estadoVigencia.clase}`}>
                          {estadoVigencia.texto}
                        </span>
                        <div className="operadores-subtexto" style={{ marginTop: '0.25rem' }}>
                          {formatearFecha(operador.fechaVencimientoLicencia)}
                        </div>
                      </td>

                      <td data-label="Acciones" className="operadores-columna-acciones">
                        <div className="operadores-botones-accion">
                          <button
                            className="operadores-boton-accion operadores-ver"
                            onClick={() => manejarAccion('ver', operador)}
                            title="Ver operador"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="operadores-boton-accion operadores-editar"
                            onClick={() => manejarAccion('editar', operador)}
                            title="Editar operador"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="operadores-boton-accion operadores-eliminar"
                            onClick={() => manejarAccion('eliminar', operador)}
                            title="Eliminar operador"
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
          <div className="operadores-pie-tabla">
            <div className="operadores-informacion-registros">
              Mostrando registros del {indiceInicio + 1} al {Math.min(indiceFin, totalRegistros)} de un total de {totalRegistros} registros
              {terminoBusqueda && (
                <span style={{ color: '#6c757d', marginLeft: '0.5rem' }}>
                  (filtrado de {operadores.length} registros totales)
                </span>
              )}
            </div>

            <div className="operadores-controles-paginacion">
              <button
                className="operadores-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                <ChevronLeft size={18} />
                Anterior
              </button>

              <div className="operadores-numeros-paginacion">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                  <button
                    key={numero}
                    className={`operadores-numero-pagina ${paginaActual === numero ? 'operadores-activo' : ''}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
              </div>

              <button
                className="operadores-boton-paginacion"
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

export default TablaOperadores;