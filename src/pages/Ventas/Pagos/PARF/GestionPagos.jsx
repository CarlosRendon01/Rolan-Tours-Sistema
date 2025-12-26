import React, { useState, useMemo, useReducer, useEffect } from 'react';
import axios from "axios";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CreditCard,
  Plus,
  FileText,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Filter,
  RotateCcw,
  XCircle
} from 'lucide-react';
import './GestionPagos.css';
import ModalVerPago from '../Modales/ModalVerPago';
import ModalEditarPago from '../Modales/ModalEditarPago';
import ModalReactivarPago from '../Modales/ModalReactivarPago';
import ModalEliminarDefinitivo from '../Modales/ModalEliminarDefinitivo';
import { modalEliminarPago } from '../Modales/modalEliminarPago';
import ModalCrearTodosDesdePago from '../Modales/ModalCrearTodosDesdePago';

// Reducer para manejo de estado
const estadoInicial = {
  paginaActual: 1,
  registrosPorPagina: 10,
  terminoBusqueda: '',
  filtroEstado: 'todos',
  filtroVisibilidad: 'activos',
  cargando: false
};

const reductor = (estado, accion) => {
  switch (accion.tipo) {
    case 'ESTABLECER_PAGINA':
      return { ...estado, paginaActual: accion.valor };
    case 'ESTABLECER_REGISTROS_POR_PAGINA':
      return { ...estado, registrosPorPagina: accion.valor, paginaActual: 1 };
    case 'ESTABLECER_BUSQUEDA':
      return { ...estado, terminoBusqueda: accion.valor, paginaActual: 1 };
    case 'ESTABLECER_FILTRO_ESTADO':
      return { ...estado, filtroEstado: accion.valor, paginaActual: 1 };
    case 'ESTABLECER_FILTRO_VISIBILIDAD':
      return { ...estado, filtroVisibilidad: accion.valor, paginaActual: 1 };
    case 'ESTABLECER_CARGANDO':
      return { ...estado, cargando: accion.valor };
    default:
      return estado;
  }
};

const GestionPagos = ({ vistaActual, onCambiarVista }) => {
  const API_URL = "http://127.0.0.1:8000/api/pagos"; // Ajusta al dominio/backend real
  const [estado, despachar] = useReducer(reductor, estadoInicial);
  const { paginaActual, registrosPorPagina, terminoBusqueda, filtroEstado, filtroVisibilidad, cargando } = estado;

  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rol') || 'Vendedor');

  // Estados para los modales
  const [modalAbierto, establecerModalAbierto] = useState(false);
  const [modalEditarAbierto, establecerModalEditarAbierto] = useState(false);
  const [modalReactivarAbierto, establecerModalReactivarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, establecerModalEliminarDefinitivoAbierto] = useState(false);
  const [pagoSeleccionado, establecerPagoSeleccionado] = useState(null);
  const [modalTodosAbierto, setModalTodosAbierto] = useState(false);

  // Estado para los datos de pagos
  const [datosPagos, establecerDatosPagos] = useState([]);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const pagos = res.data.data || [];
      establecerDatosPagos(pagos);
      console.log("Pagos cargados y formateados:", pagos);
    } catch (error) {
      console.error("Error al cargar pagos:", error);
    }
  };

  const estadisticas = useMemo(() => {
    const pagosVisibles = rolUsuario === 'Vendedor'
      ? datosPagos.filter(p => p.activo)
      : datosPagos.filter(p => {
        if (filtroVisibilidad === 'activos') return p.activo;
        if (filtroVisibilidad === 'eliminados') return !p.activo;
        return true;
      });

    const total = pagosVisibles.length;
    const pagados = pagosVisibles.filter(pago => pago.estado === 'PAGADO').length;
    const vencidos = pagosVisibles.filter(pago => pago.estado === 'VENCIDO').length;
    return { total, pagados, vencidos };
  }, [datosPagos, rolUsuario, filtroVisibilidad]);

  const datosFiltrados = useMemo(() => {
    return datosPagos.filter(pago => {
      if (rolUsuario === 'Vendedor' && !pago.activo) return false;
      if (rolUsuario === 'admin') {
        if (filtroVisibilidad === 'activos' && !pago.activo) return false;
        if (filtroVisibilidad === 'eliminados' && pago.activo) return false;
      }

      const cumpleBusqueda =
        (pago.cliente?.nombre || '').toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        pago.id.toString().includes(terminoBusqueda) ||
        (pago.numeroContrato || '').toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        (pago.servicio?.tipo || '').toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        (pago.servicio?.descripcion || '').toLowerCase().includes(terminoBusqueda.toLowerCase());

      const cumpleFiltroEstado = filtroEstado === 'todos' ||
        (pago.estado || '').toLowerCase() === filtroEstado.toLowerCase();

      return cumpleBusqueda && cumpleFiltroEstado;
    });
  }, [terminoBusqueda, filtroEstado, filtroVisibilidad, datosPagos, rolUsuario]);

  const totalRegistros = datosFiltrados.length;
  const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);
  const indiceInicio = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = indiceInicio + registrosPorPagina;
  const datosPaginados = datosFiltrados.slice(indiceInicio, indiceFinal);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      despachar({ tipo: 'ESTABLECER_PAGINA', valor: nuevaPagina });
    }
  };

  const manejarCambioRegistros = (evento) => {
    despachar({ tipo: 'ESTABLECER_REGISTROS_POR_PAGINA', valor: parseInt(evento.target.value) });
  };

  const manejarBusqueda = (evento) => {
    despachar({ tipo: 'ESTABLECER_BUSQUEDA', valor: evento.target.value });
  };

  const manejarFiltroEstado = (evento) => {
    despachar({ tipo: 'ESTABLECER_FILTRO_ESTADO', valor: evento.target.value });
  };

  const manejarFiltroVisibilidad = (evento) => {
    despachar({ tipo: 'ESTABLECER_FILTRO_VISIBILIDAD', valor: evento.target.value });
  };

  const manejarAccion = (accion, pago) => {
    try {
      switch (accion) {
        case 'ver':
          establecerPagoSeleccionado(pago);
          establecerModalAbierto(true);
          break;
        case 'editar':
          establecerPagoSeleccionado(pago);
          establecerModalEditarAbierto(true);
          break;
        case 'eliminar':
          // Soft delete usando modalEliminarPago existente
          modalEliminarPago(pago, async () => {
            establecerDatosPagos(prevPagos =>
              prevPagos.map(p =>
                p.id === pago.id ? { ...p, activo: false } : p
              )
            );
            console.log('Pago eliminado visualmente:', pago);
          });
          break;
        case 'regenerar':
          // Abrir modal de reactivación
          establecerPagoSeleccionado(pago);
          establecerModalReactivarAbierto(true);
          break;
        case 'eliminarDefinitivo':
          // Abrir modal de eliminación definitiva
          establecerPagoSeleccionado(pago);
          establecerModalEliminarDefinitivoAbierto(true);
          break;
        case 'crearTodos':
          establecerPagoSeleccionado(pago);
          setModalTodosAbierto(true);
          break;
        default:
          console.warn('Acción no reconocida:', accion);
      }
    } catch (error) {
      console.error('Error al procesar la acción:', error);
      alert('Ocurrió un error al procesar la acción. Por favor, intente nuevamente.');
    }
  };

  const abrirModalAgregar = () => {
    console.log('Abriendo modal para agregar nuevo pago');
    alert('Se abrirá el modal para agregar un nuevo pago.');
  };

  const manejarGuardarEdicion = (pagoActualizado) => {
    establecerDatosPagos(prevPagos =>
      prevPagos.map(p => p.id === pagoActualizado.id ? pagoActualizado : p)
    );
  };

  const manejarReactivarPago = async (pago) => {
    establecerDatosPagos(prevPagos =>
      prevPagos.map(p =>
        p.id === pago.id ? { ...p, activo: true } : p
      )
    );
    console.log('Pago reactivado:', pago);
  };

  const manejarEliminarDefinitivo = async (pago) => {
    establecerDatosPagos(prevPagos =>
      prevPagos.filter(p => p.id !== pago.id)
    );
    console.log('Pago eliminado definitivamente:', pago);
  };

  const obtenerClaseEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pagado':
        return 'pagos-estado-pagado';
      case 'vencido':
        return 'pagos-estado-vencido';
      default:
        return 'pagos-estado-vencido';
    }
  };

  const generarNumerosPaginacion = () => {
    const numeros = [];
    const maximoVisibles = 5;

    if (totalPaginas <= maximoVisibles) {
      for (let i = 1; i <= totalPaginas; i++) {
        numeros.push(i);
      }
    } else {
      if (paginaActual <= 3) {
        for (let i = 1; i <= 4; i++) {
          numeros.push(i);
        }
        numeros.push('...');
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) {
          numeros.push(i);
        }
      } else {
        numeros.push(1);
        numeros.push('...');
        numeros.push(paginaActual - 1);
        numeros.push(paginaActual);
        numeros.push(paginaActual + 1);
        numeros.push('...');
        numeros.push(totalPaginas);
      }
    }

    return numeros;
  };

  const puedeCrearOrden = (pago) => {
    const porcentajePagado = (pago.planPago?.montoPagado / pago.planPago?.montoTotal) * 100;
    return porcentajePagado >= 50;
  };

  return (
    <>
      <div className={`pagos-contenedor-principal ${cargando ? 'pagos-cargando' : ''}`}>
        <div className="pagos-encabezado">
          <div className="pagos-seccion-logo">
            <div className="pagos-icono-principal">
              <CreditCard size={24} />
            </div>
            <div>
              <h1 className="pagos-titulo">Gestión de Pagos</h1>
              <p className="pagos-subtitulo">Control de pagos completados y vencidos</p>
            </div>
          </div>

          <div className="pagos-estadisticas-header">
            <div className="pagos-tarjeta-estadistica total">
              <BarChart3 className="pagos-icono-estadistica" size={20} />
              <span className="pagos-valor-estadistica">{estadisticas.total}</span>
              <span className="pagos-etiqueta-estadistica">Total</span>
            </div>
            <div className="pagos-tarjeta-estadistica pagados">
              <CheckCircle className="pagos-icono-estadistica" size={20} />
              <span className="pagos-valor-estadistica">{estadisticas.pagados}</span>
              <span className="pagos-etiqueta-estadistica">Pagados</span>
            </div>
            <div className="pagos-tarjeta-estadistica vencidos">
              <AlertCircle className="pagos-icono-estadistica" size={20} />
              <span className="pagos-valor-estadistica">{estadisticas.vencidos}</span>
              <span className="pagos-etiqueta-estadistica">Vencidos</span>
            </div>
          </div>
        </div>

        <div className="pagos-controles">
          <div className="pagos-seccion-izquierda">
            <div className="pagos-control-registros">
              <label htmlFor="registros">Mostrar</label>
              <select
                id="registros"
                value={registrosPorPagina}
                onChange={manejarCambioRegistros}
                className="pagos-selector-registros"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>registros</span>
            </div>

            <div className="pagos-filtro-estado">
              <Filter size={16} />
              <label htmlFor="filtro-vista">Vista:</label>
              <select
                id="filtro-vista"
                value={vistaActual}
                onChange={onCambiarVista}
                className="pagos-selector-filtro"
              >
                <option value="pagos">Gestión de Pagos</option>
                <option value="abonos">Pagos por Abonos</option>
                <option value="recibos">Gestión de Recibos</option>
                <option value="facturas">Gestión de Facturas</option>
              </select>
            </div>

            {rolUsuario === 'admin' && (
              <div className="pagos-filtro-estado">
                <Eye size={16} />
                <label htmlFor="filtro-visibilidad">Estado:</label>
                <select
                  id="filtro-visibilidad"
                  value={filtroVisibilidad}
                  onChange={manejarFiltroVisibilidad}
                  className="pagos-selector-filtro"
                >
                  <option value="activos">Activos</option>
                  <option value="eliminados">Eliminados</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
            )}
          </div>

          <div className="pagos-seccion-derecha">
            <div className="pagos-control-busqueda">
              <input
                type="text"
                placeholder="Buscar cliente, ..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="pagos-entrada-buscar"
              />
              <Search className="pagos-icono-buscar" size={18} />
            </div>
          </div>
        </div>

        <div className="pagos-contenedor-tabla">
          {datosPaginados.length === 0 ? (
            <div className="pagos-estado-vacio">
              <div className="pagos-icono-vacio">
                <FileText size={64} />
              </div>
              <h3 className="pagos-mensaje-vacio">No se encontraron pagos</h3>
              <p className="pagos-submensaje-vacio">
                {terminoBusqueda || filtroEstado !== 'todos'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay pagos registrados en el sistema'}
              </p>
            </div>
          ) : (
            <table className="pagos-tabla">
              <thead>
                <tr className="pagos-fila-encabezado">
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Fecha Pago</th>
                  <th>Método Pago</th>
                  <th>Estado</th>
                  {rolUsuario === 'admin' && <th>Visible</th>}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosPaginados.map((pago, indice) => (
                  <tr
                    key={pago.id}
                    className="pagos-fila-pago"
                    style={{
                      animationDelay: `${indice * 0.05}s`,
                      background: !pago.activo ? '#fee2e2' : 'white'
                    }}
                  >
                    <td className="pagos-columna-id">#{pago.id.toString().padStart(3, '0')}</td>
                    <td className="pagos-columna-cliente">{pago.cliente?.nombre}</td>
                    <td className="pagos-columna-monto">{pago.planPago?.montoTotal}</td>
                    <td>
                      {pago.fechaInicio ? (
                        <span>{pago.fechaInicio}</span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin fecha</span>
                      )}
                    </td>
                    <td>
                      {pago.metodoPago ? (
                        <span>{pago.metodoPago}</span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Sin método</span>
                      )}
                    </td>
                    <td>
                      <span className={`pagos-badge-estado ${obtenerClaseEstado(pago.estado)}`}>
                        <span className="pagos-indicador-estado"></span>
                        {pago.estado}
                      </span>
                    </td>
                    {rolUsuario === 'admin' && (
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: pago.activo ? '#d1fae5' : '#e5e7eb',
                          color: pago.activo ? '#065f46' : '#374151'
                        }}>
                          {pago.activo ? '✓ Sí' : '✗ No'}
                        </span>
                      </td>
                    )}
                    <td className="pagos-columna-acciones">
                      <div className="pagos-botones-accion">
                        <button
                          className="pagos-boton-accion pagos-ver"
                          onClick={() => manejarAccion('ver', pago)}
                          title="Ver detalles"
                          disabled={cargando}
                        >
                          <Eye size={14} />
                        </button>

                        {pago.estado === 'VENCIDO' && pago.activo && (
                          <button
                            className="pagos-boton-accion pagos-editar"
                            onClick={() => manejarAccion('editar', pago)}
                            title="Editar"
                            disabled={cargando}
                          >
                            <Edit size={14} />
                          </button>
                        )}

                        {rolUsuario === 'Vendedor' && pago.activo && (
                          <button
                            className="pagos-boton-accion pagos-eliminar"
                            onClick={() => manejarAccion('eliminar', pago)}
                            title="Eliminar de mi vista"
                            disabled={cargando}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        {rolUsuario === 'admin' && (
                          <>
                            {!pago.activo && (
                              <button
                                className="pagos-boton-accion"
                                onClick={() => manejarAccion('regenerar', pago)}
                                title="Reactivar pago"
                                disabled={cargando}
                                style={{
                                  background: '#10b981',
                                  color: 'white',
                                  border: '1px solid #a7f3d0'
                                }}
                              >
                                <RotateCcw size={14} />
                              </button>
                            )}
                            <button
                              className="pagos-boton-accion pagos-eliminar"
                              onClick={() => manejarAccion('eliminarDefinitivo', pago)}
                              title={pago.activo ? "Eliminar definitivamente" : "Eliminar de raíz"}
                              disabled={cargando}
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        {pago.activo && (
                          <button
                            className="pagos-boton-accion"
                            onClick={() => manejarAccion('crearTodos', pago)}
                            title={
                              puedeCrearOrden(pago)
                                ? "Crear Orden + Contrato + Reserva"
                                : "Requiere al menos 50% pagado"
                            }
                            disabled={cargando || !puedeCrearOrden(pago)}  // ✅ Deshabilitar si no cumple
                            style={{
                              background: puedeCrearOrden(pago) ? '#8b5cf6' : '#9ca3af',  // ✅ Color gris si deshabilitado
                              color: 'white',
                              border: puedeCrearOrden(pago) ? '1px solid #c4b5fd' : '1px solid #d1d5db',
                              cursor: puedeCrearOrden(pago) ? 'pointer' : 'not-allowed',
                              opacity: puedeCrearOrden(pago) ? 1 : 0.5
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {datosPaginados.length > 0 && (
          <div className="pagos-pie-tabla">
            <div className="pagos-informacion-registros">
              Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
              {(terminoBusqueda || filtroEstado !== 'todos') && (
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                  (filtrado de {datosPagos.length} registros totales)
                </span>
              )}
            </div>

            <div className="pagos-controles-paginacion">
              <button
                className="pagos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1 || cargando}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div className="pagos-numeros-paginacion">
                {generarNumerosPaginacion().map((numero, indice) => (
                  numero === '...' ? (
                    <span key={`ellipsis-${indice}`} style={{ padding: '0.5rem', color: '#9ca3af' }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={numero}
                      className={`pagos-numero-pagina ${paginaActual === numero ? 'pagos-activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                      disabled={cargando}
                    >
                      {numero}
                    </button>
                  )
                ))}
              </div>

              <button
                className="pagos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || cargando}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ModalVerPago
        estaAbierto={modalAbierto}
        alCerrar={() => establecerModalAbierto(false)}
        pago={pagoSeleccionado}
      />

      <ModalEditarPago
        estaAbierto={modalEditarAbierto}
        alCerrar={() => establecerModalEditarAbierto(false)}
        pago={pagoSeleccionado}
        alGuardar={manejarGuardarEdicion}
      />

      <ModalReactivarPago
        estaAbierto={modalReactivarAbierto}
        alCerrar={() => establecerModalReactivarAbierto(false)}
        pago={pagoSeleccionado}
        alReactivar={manejarReactivarPago}
      />

      <ModalEliminarDefinitivo
        estaAbierto={modalEliminarDefinitivoAbierto}
        alCerrar={() => establecerModalEliminarDefinitivoAbierto(false)}
        pago={pagoSeleccionado}
        alEliminar={manejarEliminarDefinitivo}
      />

      <ModalCrearTodosDesdePago
        estaAbierto={modalTodosAbierto}
        alCerrar={() => setModalTodosAbierto(false)}
        pago={pagoSeleccionado}
      />
    </>
  );
};

export default GestionPagos;