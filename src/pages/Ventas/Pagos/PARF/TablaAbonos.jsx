import React, { useState, useMemo, useReducer, useEffect } from 'react';
import axios from "axios";
import {
  Search,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Coins,
  Plus,
  Receipt,
  BarChart3,
  Clock,
  AlertCircle,
  FileText,
  Filter,
  RotateCcw,
  XCircle
} from 'lucide-react';
import './TablaAbonos.css';
import ModalNuevoPago from '../ModalesAbonos/ModalNuevoPago';
import ModalAgregarAbono from '../ModalesAbonos/ModalAgregarAbono';
import ModalVerAbono from '../ModalesAbonos/ModalVerAbono';
import ModalEditarAbono from '../ModalesAbonos/ModalEditarAbono';
import ModalReciboAbono from '../ModalesAbonos/ModalReciboAbono';
import ModalFacturaAbono from '../ModalesAbonos/ModalFacturaAbono';

// ===== REDUCER PARA MANEJO DE ESTADO =====
const estadoInicial = {
  paginaActual: 1,
  registrosPorPagina: 10,
  terminoBusqueda: '',
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
    case 'ESTABLECER_FILTRO_VISIBILIDAD':
      return { ...estado, filtroVisibilidad: accion.valor, paginaActual: 1 };
    case 'ESTABLECER_CARGANDO':
      return { ...estado, cargando: accion.valor };
    default:
      return estado;
  }
};

const TablaAbonos = ({ vistaActual, onCambiarVista }) => {
  const API_URL = "http://127.0.0.1:8000/api/pagos"; // Ajusta al dominio/backend real
  const [estado, despachar] = useReducer(reductor, estadoInicial);
  const { paginaActual, registrosPorPagina, terminoBusqueda, filtroVisibilidad, cargando } = estado;

  const [rolUsuario, setRolUsuario] = useState(localStorage.getItem('rol') || 'vendedor');

  // ===== ESTADOS PARA MODALES =====
  const [modalNuevoPagoAbierto, setModalNuevoPagoAbierto] = useState(false);
  const [modalAgregarAbonoAbierto, setModalAgregarAbonoAbierto] = useState(false);
  const [modalVerPagoAbierto, setModalVerPagoAbierto] = useState(false);
  const [modalEditarPagoAbierto, setModalEditarPagoAbierto] = useState(false);
  const [modalReciboAbierto, setModalReciboAbierto] = useState(false);
  const [modalFacturaAbierto, setModalFacturaAbierto] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);

  // ===== DATOS DE ABONOS CON CAMPO "activo" =====
  const [datosAbonos, setDatosAbonos] = useState([]);

  useEffect(() => {
    cargarAbonos();
  }, []);

  const cargarAbonos = async () => {

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      const abonos = res.data.data || [];
      setDatosAbonos(abonos);
      if (pagoSeleccionado && modalVerPagoAbierto) {
        const pagoActualizado = abonos.find(p => p.id === pagoSeleccionado.id);
        if (pagoActualizado) {
          setPagoSeleccionado(pagoActualizado);
        }
      }
    } catch (error) {
      console.error("Error al cargar abonos:", error);
    }
  };

  const estadisticas = useMemo(() => {
    const abonosVisibles = rolUsuario === 'vendedor'
      ? datosAbonos.filter(a => a.activo)
      : datosAbonos.filter(a => {
        if (filtroVisibilidad === 'activos') return a.activo;
        if (filtroVisibilidad === 'eliminados') return !a.activo;
        return true;
      });

    const totalClientes = abonosVisibles.length;
    const proximosVencer = abonosVisibles.filter(abono => {
      if (abono.estado === 'FINALIZADO') return false;
      const fechaVencimiento = new Date(abono.proximoVencimiento);
      const hoy = new Date();
      const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      return diferenciaEnDias <= 7 && diferenciaEnDias >= 0;
    }).length;
    const enProceso = abonosVisibles.filter(abono => abono.estado === 'EN_PROCESO').length;
    const finalizados = abonosVisibles.filter(abono => abono.estado === 'FINALIZADO').length;

    return { totalClientes, proximosVencer, enProceso, finalizados };
  }, [datosAbonos, rolUsuario, filtroVisibilidad]);

  // ===== FILTRAR DATOS SEGÚN ROL Y BÚSQUEDA =====
  const datosFiltrados = useMemo(() => {
    return datosAbonos.filter(abono => {
      // Filtro por rol
      if (rolUsuario === 'vendedor' && !abono.activo) return false;
      if (rolUsuario === 'admin') {
        if (filtroVisibilidad === 'activos' && !abono.activo) return false;
        if (filtroVisibilidad === 'eliminados' && abono.activo) return false;
      }

      // Filtro por búsqueda
      const cumpleBusqueda =
        abono.cliente.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.id.toString().includes(terminoBusqueda) ||
        abono.numeroContrato.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        abono.servicio.tipo.toLowerCase().includes(terminoBusqueda.toLowerCase());

      return cumpleBusqueda;
    });
  }, [terminoBusqueda, datosAbonos, rolUsuario, filtroVisibilidad]);

  // ===== PAGINACIÓN =====
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

  const manejarFiltroVisibilidad = (evento) => {
    despachar({ tipo: 'ESTABLECER_FILTRO_VISIBILIDAD', valor: evento.target.value });
  };

  // ===== FUNCIÓN PARA FACTURAR ABONO INDIVIDUAL =====
  const facturarAbono = async () => {
    await cargarAbonos();
    console.log('✅ Facturas recargadas');
  };

  // ===== FUNCIÓN PARA GUARDAR NUEVO PAGO =====
  const guardarNuevoPago = async () => {
    await cargarAbonos();
    console.log('✅ Pagos recargados después de crear');
  };

  // ===== FUNCIÓN PARA AGREGAR ABONO =====
  const guardarAbono = async () => {
    await cargarAbonos();
    console.log('✅ Abonos recargados después de agregar');
  };

  // ===== FUNCIÓN PARA EDITAR PAGO =====
  const guardarEdicionPago = async () => {
    await cargarAbonos();
    console.log('✅ Pagos recargados después de editar');
  };

  // ===== MANEJO DE ACCIONES =====
  const manejarAccion = (accion, pago) => {
    try {
      switch (accion) {
        case 'ver':
          setPagoSeleccionado(pago);
          setModalVerPagoAbierto(true);
          break;
        case 'agregarAbono':
          setPagoSeleccionado(pago);
          setModalAgregarAbonoAbierto(true);
          break;
        case 'editar':
          setPagoSeleccionado(pago);
          setModalEditarPagoAbierto(true);
          break;
        case 'generarRecibo':
          setPagoSeleccionado(pago);
          setModalReciboAbierto(true);
          break;
        case 'generarFactura':
          setPagoSeleccionado(pago);
          setModalFacturaAbierto(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error al procesar la acción:', error);
    }
  };

  // ===== UTILIDADES =====
  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoContrato = (pago) => {
    if (pago.estado === 'FINALIZADO') {
      return { texto: 'Finalizado', clase: 'abonos-estado-pagado' };
    }
    const fechaVencimiento = new Date(pago.proximoVencimiento);
    const hoy = new Date();
    const diferenciaEnDias = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    if (diferenciaEnDias < 0) {
      return { texto: 'Vencido', clase: 'abonos-estado-vencido' };
    } else if (diferenciaEnDias <= 7) {
      return { texto: 'Próximo Vencer', clase: 'abonos-estado-pendiente' };
    } else {
      return { texto: 'En Proceso', clase: 'abonos-estado-pendiente' };
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
        for (let i = 1; i <= 4; i++) numeros.push(i);
        numeros.push('...');
        numeros.push(totalPaginas);
      } else if (paginaActual >= totalPaginas - 2) {
        numeros.push(1);
        numeros.push('...');
        for (let i = totalPaginas - 3; i <= totalPaginas; i++) numeros.push(i);
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

  return (
    <>
      <div className={`abonos-contenedor-principal ${cargando ? 'abonos-cargando' : ''}`}>
        {/* ===== HEADER ===== */}
        <div className="abonos-encabezado">
          <div className="abonos-seccion-logo">
            <div className="abonos-icono-principal">
              <Coins size={24} />
            </div>
            <div>
              <h1 className="abonos-titulo">Pagos por Abonos</h1>
              <p className="abonos-subtitulo">Gestión de pagos parciales para servicios de tours</p>
            </div>
          </div>

          <div className="abonos-estadisticas-header">
            <div className="abonos-tarjeta-estadistica total">
              <BarChart3 className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">{estadisticas.totalClientes}</span>
              <span className="abonos-etiqueta-estadistica">Clientes</span>
            </div>
            <div className="abonos-tarjeta-estadistica pendientes">
              <Clock className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">{estadisticas.enProceso}</span>
              <span className="abonos-etiqueta-estadistica">En Proceso</span>
            </div>
            <div className="abonos-tarjeta-estadistica vencidos">
              <AlertCircle className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">{estadisticas.proximosVencer}</span>
              <span className="abonos-etiqueta-estadistica">Próximos Vencer</span>
            </div>
            <div className="abonos-tarjeta-estadistica pagados">
              <Coins className="abonos-icono-estadistica" size={20} />
              <span className="abonos-valor-estadistica">{estadisticas.finalizados}</span>
              <span className="abonos-etiqueta-estadistica">Finalizados</span>
            </div>
          </div>
        </div>

        {/* ===== CONTROLES ===== */}
        <div className="abonos-controles">
          <div className="abonos-seccion-izquierda">
            <div className="abonos-control-registros">
              <label htmlFor="registros">Mostrar</label>
              <select
                id="registros"
                value={registrosPorPagina}
                onChange={manejarCambioRegistros}
                className="abonos-selector-registros"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>registros</span>
            </div>

            <div className="abonos-filtro-estado">
              <Filter size={16} />
              <label htmlFor="filtro-vista">Vista:</label>
              <select
                id="filtro-vista"
                value={vistaActual}
                onChange={onCambiarVista}
                className="abonos-selector-filtro"
              >
                <option value="pagos">Gestión de Pagos</option>
                <option value="abonos">Pagos por Abonos</option>
                <option value="recibos">Gestión de Recibos</option>
                <option value="facturas">Gestión de Facturas</option>
              </select>
            </div>

            {/* ✅ FILTRO DE VISIBILIDAD SOLO PARA admin */}
            {rolUsuario === 'admin' && (
              <div className="abonos-filtro-estado">
                <Eye size={16} />
                <label htmlFor="filtro-visibilidad">Estado:</label>
                <select
                  id="filtro-visibilidad"
                  value={filtroVisibilidad}
                  onChange={manejarFiltroVisibilidad}
                  className="abonos-selector-filtro"
                >
                  <option value="activos">Activos</option>
                  <option value="eliminados">Eliminados</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
            )}
          </div>

          <div className="abonos-seccion-derecha">
            <button
              className="abonos-boton-agregar"
              onClick={() => setModalNuevoPagoAbierto(true)}
              title="Registrar nuevo pago por abonos"
              disabled={cargando}
            >
              <Plus size={18} />
              <span>Nuevo Pago</span>
            </button>

            <div className="abonos-control-busqueda">
              <input
                type="text"
                placeholder="Buscar cliente, contrato, servicio..."
                value={terminoBusqueda}
                onChange={manejarBusqueda}
                className="abonos-entrada-buscar"
              />
              <Search className="abonos-icono-buscar" size={18} />
            </div>
          </div>
        </div>

        {/* ===== TABLA ===== */}
        <div className="abonos-contenedor-tabla">
          {datosPaginados.length === 0 ? (
            <div className="abonos-estado-vacio">
              <div className="abonos-icono-vacio">
                <FileText size={64} />
              </div>
              <h3 className="abonos-mensaje-vacio">No se encontraron pagos</h3>
              <p className="abonos-submensaje-vacio">
                {terminoBusqueda
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay pagos por abonos registrados en el sistema'}
              </p>
            </div>
          ) : (
            <table className="abonos-tabla">
              <thead>
                <tr className="abonos-fila-encabezado">
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Servicio</th>
                  <th>Progreso</th>
                  <th>Último Abono</th>
                  <th>Próximo Venc.</th>
                  <th>Contrato</th>
                  <th>Estado</th>
                  {/* ✅ COLUMNA "VISIBLE" SOLO PARA admin */}
                  {rolUsuario === 'admin' && <th>Visible</th>}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {datosPaginados.map((pago, indice) => {
                  const progreso = calcularProgreso(pago.planPago.montoPagado, pago.planPago.montoTotal);
                  const estadoContrato = obtenerEstadoContrato(pago);
                  const ultimoAbono = pago.historialAbonos?.[pago.historialAbonos.length - 1] || null;

                  return (
                    <tr
                      key={pago.id}
                      className="abonos-fila-pago"
                      style={{
                        animationDelay: `${indice * 0.05}s`,
                        background: !pago.activo ? '#fee2e2' : 'white' // ✅ Fondo rojo si está eliminado
                      }}
                    >
                      <td data-label="ID" className="abonos-columna-id">#{pago.id.toString().padStart(3, '0')}</td>
                      <td data-label="Cliente" className="abonos-columna-cliente">{pago.cliente.nombre}</td>
                      <td data-label="Servicio">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{pago.servicio.tipo}</span>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{pago.servicio.descripcion}</span>
                        </div>
                      </td>
                      <td data-label="Progreso">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '80px',
                              height: '8px',
                              background: '#f3f4f6',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${progreso}%`,
                                height: '100%',
                                background: progreso === 100 ? '#10b981' : '#3b82f6',
                                transition: 'width 0.3s'
                              }}></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{progreso}%</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            ${pago.planPago.montoPagado.toLocaleString()} / ${pago.planPago.montoTotal.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {pago.planPago.abonosRealizados} de {pago.planPago.abonosPlaneados} abonos
                          </div>
                        </div>
                      </td>
                      <td data-label="Último Abono">
                        {ultimoAbono ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <span className="abonos-columna-monto">${ultimoAbono.monto.toLocaleString()}</span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{ultimoAbono.fecha}</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sin abonos</span>
                        )}
                      </td>
                      <td data-label="Próximo Venc.">
                        {pago.proximoVencimiento === 'Finalizado' ? (
                          <span style={{ color: '#10b981', fontWeight: '600' }}>Finalizado</span>
                        ) : (
                          <span>{pago.proximoVencimiento}</span>
                        )}
                      </td>
                      <td data-label="Contrato" className="abonos-columna-factura">{pago.numeroContrato}</td>
                      <td data-label="Estado">
                        <span className={`abonos-badge-estado ${estadoContrato.clase}`}>
                          <span className="abonos-indicador-estado"></span>
                          {estadoContrato.texto}
                        </span>
                      </td>
                      {/* ✅ COLUMNA "VISIBLE" SOLO PARA admin */}
                      {rolUsuario === 'admin' && (
                        <td data-label="Visible">
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
                      <td data-label="Acciones" className="abonos-columna-acciones">
                        <div className="abonos-botones-accion">
                          {/* ✅ BOTÓN VER (TODOS) */}
                          <button
                            className="abonos-boton-accion abonos-ver"
                            onClick={() => manejarAccion('ver', pago)}
                            title="Ver historial de abonos"
                            disabled={cargando}
                          >
                            <Eye size={14} />
                          </button>
                          {/* ✅ BOTÓN AGREGAR ABONO (SOLO SI ACTIVO Y NO FINALIZADO) */}
                          {pago.estado !== 'FINALIZADO' && pago.activo && (
                            <button
                              className="abonos-boton-accion abonos-agregar"
                              onClick={() => manejarAccion('agregarAbono', pago)}
                              title="Agregar nuevo abono"
                              disabled={cargando}
                            >
                              <Plus size={14} />
                            </button>
                          )}

                          {/* ✅ BOTONES COMUNES (SOLO SI ACTIVO) */}
                          {pago.activo && (
                            <>
                              <button
                                className="abonos-boton-accion abonos-editar"
                                onClick={() => manejarAccion('editar', pago)}
                                title={pago.estado === 'FINALIZADO' ? 'No se puede editar (finalizado)' : 'Editar pago'}
                                disabled={cargando || pago.estado === 'FINALIZADO'}
                              >
                                <Edit size={14} />
                              </button>

                              <button
                                className="abonos-boton-accion abonos-recibo"
                                onClick={() => manejarAccion('generarRecibo', pago)}
                                title="Generar recibo de pago"
                                disabled={cargando}
                              >
                                <Receipt size={14} />
                              </button>

                              <button
                                className="abonos-boton-accion abonos-factura"
                                onClick={() => manejarAccion('generarFactura', pago)}
                                title="Gestionar facturas por abono"
                                disabled={cargando}
                              >
                                <FileText size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ===== PIE DE TABLA ===== */}
        {datosPaginados.length > 0 && (
          <div className="abonos-pie-tabla">
            <div className="abonos-informacion-registros">
              Mostrando <strong>{indiceInicio + 1}</strong> a <strong>{Math.min(indiceFinal, totalRegistros)}</strong> de <strong>{totalRegistros}</strong> registros
              {terminoBusqueda && (
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>
                  (filtrado de {datosAbonos.length} registros totales)
                </span>
              )}
            </div>

            <div className="abonos-controles-paginacion">
              <button
                className="abonos-boton-paginacion"
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1 || cargando}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div className="abonos-numeros-paginacion">
                {generarNumerosPaginacion().map((numero, indice) => (
                  numero === '...' ? (
                    <span key={`ellipsis-${indice}`} style={{ padding: '0.5rem', color: '#9ca3af' }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={numero}
                      className={`abonos-numero-pagina ${paginaActual === numero ? 'abonos-activo' : ''}`}
                      onClick={() => cambiarPagina(numero)}
                      disabled={cargando}
                    >
                      {numero}
                    </button>
                  )
                ))}
              </div>

              <button
                className="abonos-boton-paginacion"
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

      {/* ===== MODALES ===== */}
      <ModalNuevoPago
        abierto={modalNuevoPagoAbierto}
        onCerrar={() => setModalNuevoPagoAbierto(false)}
        onGuardar={guardarNuevoPago}
      />

      <ModalAgregarAbono
        abierto={modalAgregarAbonoAbierto}
        onCerrar={() => setModalAgregarAbonoAbierto(false)}
        onGuardar={guardarAbono}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalVerAbono
        abierto={modalVerPagoAbierto}
        onCerrar={() => setModalVerPagoAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
        onActualizar={cargarAbonos}
      />

      <ModalEditarAbono
        abierto={modalEditarPagoAbierto}
        onCerrar={() => setModalEditarPagoAbierto(false)}
        onGuardar={guardarEdicionPago}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalReciboAbono
        abierto={modalReciboAbierto}
        onCerrar={() => setModalReciboAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
      />

      <ModalFacturaAbono
        abierto={modalFacturaAbierto}
        onCerrar={() => setModalFacturaAbierto(false)}
        pagoSeleccionado={pagoSeleccionado}
        onFacturar={facturarAbono}
      />
    </>
  );
};

export default TablaAbonos;