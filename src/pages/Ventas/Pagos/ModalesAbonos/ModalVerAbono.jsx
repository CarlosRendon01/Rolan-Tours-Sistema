import React, { useState, useEffect } from 'react'; // ✅ Agregar useEffect
import {
  X, User, Mail, Phone, Calendar, MapPin, FileText, DollarSign,
  CreditCard, Clock, CheckCircle, AlertCircle, TrendingUp, Receipt, Info,
  Trash2, XCircle, RotateCcw
} from 'lucide-react';
import Swal from 'sweetalert2';
import './ModalVerAbono.css';
import { modalEliminarPago } from '../ModalesAbonos/ModalEliminarAbono';
import ModalReactivarAbono from '../ModalesAbonos/ModalReactivarAbono';
import ModalEliminarDefinitivoAbono from '../ModalesAbonos/ModalEliminarDefinitivoAbono';

const ModalVerAbono = ({ abierto, onCerrar, pagoSeleccionado, onActualizar }) => {
  // ✅ TODOS LOS HOOKS AL INICIO (antes del if)
  const [tabActiva, setTabActiva] = useState(1);
  const [modalReactivarAbierto, setModalReactivarAbierto] = useState(false);
  const [modalEliminarDefinitivoAbierto, setModalEliminarDefinitivoAbierto] = useState(false);
  const [abonoSeleccionado, setAbonoSeleccionado] = useState(null);
  const [datosActualizados, setDatosActualizados] = useState(pagoSeleccionado);

  const rolUsuario = localStorage.getItem('rol') || 'vendedor';

  // ✅ Actualizar datos cuando cambie pagoSeleccionado
  useEffect(() => {
    if (pagoSeleccionado) {
      setDatosActualizados(pagoSeleccionado);
    }
  }, [pagoSeleccionado]);

  // ✅ AHORA SÍ el return condicional
  if (!abierto || !datosActualizados) return null;

  const calcularProgreso = (montoPagado, montoTotal) => {
    return Math.round((montoPagado / montoTotal) * 100);
  };

  const obtenerEstadoClase = (estado) => {
    switch (estado) {
      case 'FINALIZADO': return 'estado-finalizado';
      case 'EN_PROCESO': return 'estado-en-proceso';
      case 'VENCIDO': return 'estado-vencido';
      default: return 'estado-en-proceso';
    }
  };

  const progreso = calcularProgreso(
    datosActualizados.planPago.montoPagado,
    datosActualizados.planPago.montoTotal
  );

  // Filtrar abonos según visibilidad
  const abonosFiltrados = datosActualizados.historialAbonos?.filter(abono => {
    if (rolUsuario === 'vendedor') {
      return abono.activo !== false;
    }
    return true;
  }) || [];

  const cantidadAbonos = abonosFiltrados.length;

  // ===== USAR MODAL EXISTENTE PARA ELIMINAR SOFT =====
  const eliminarAbonoSoft = async (abono) => {
    const abonoConFormato = {
      id: abono.id,
      cliente: { nombre: datosActualizados.cliente.nombre },
      planPago: {
        montoTotal: abono.monto,
        abonosRealizados: 0
      }
    };

    const confirmado = await modalEliminarPago(abonoConFormato, async () => {
      if (onActualizar) {
        await onActualizar();
      }
    });

    if (confirmado) {
      await Swal.fire({
        title: '¡Eliminado!',
        text: 'El abono ha sido eliminado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      if (onActualizar) {
        await onActualizar();
      }
    }
  };

  // ===== ABRIR MODALES EXISTENTES =====
  const abrirModalReactivar = (abono) => {
    setAbonoSeleccionado({
      id: abono.id,
      cliente: datosActualizados.cliente,
      servicio: datosActualizados.servicio,
      planPago: {
        ...datosActualizados.planPago,
        montoTotal: abono.monto
      }
    });
    setModalReactivarAbierto(true);
  };

  const abrirModalEliminarDefinitivo = (abono) => {
    setAbonoSeleccionado({
      id: abono.id,
      cliente: datosActualizados.cliente,
      servicio: datosActualizados.servicio,
      planPago: {
        ...datosActualizados.planPago,
        montoTotal: abono.monto
      }
    });
    setModalEliminarDefinitivoAbierto(true);
  };

  const manejarReactivar = async () => {
    if (onActualizar) {
      await onActualizar();
    }
    setModalReactivarAbierto(false);
  };

  const manejarEliminarDefinitivo = async () => {
    if (onActualizar) {
      await onActualizar();
    }
    setModalEliminarDefinitivoAbierto(false);
  };

  return (
    <>
      <div className="modal-ver-abono-overlay" onClick={onCerrar}>
        <div className="modal-ver-abono-contenedor" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="modal-ver-abono-header">
            <button className="modal-ver-abono-boton-cerrar" onClick={onCerrar}>
              <X size={20} />
            </button>
            <div className="modal-ver-abono-header-contenido">
              <FileText size={24} />
              <div>
                <h2 className="modal-ver-abono-titulo">Detalle del Pago</h2>
                <p className="modal-ver-abono-subtitulo">
                  Contrato: {datosActualizados.numeroContrato}
                </p>
              </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="modal-ver-abono-tabs">
              <button
                className={`modal-ver-abono-tab ${tabActiva === 1 ? 'activa' : ''}`}
                onClick={() => setTabActiva(1)}
              >
                <Info size={16} />
                Información General
              </button>
              <button
                className={`modal-ver-abono-tab ${tabActiva === 2 ? 'activa' : ''}`}
                onClick={() => setTabActiva(2)}
              >
                <Receipt size={16} />
                Historial
                <span className="modal-ver-abono-tab-badge">{cantidadAbonos}</span>
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="modal-ver-abono-contenido">
            {tabActiva === 1 && (
              <div className="modal-ver-abono-tab-contenido">
                {/* Estado del Pago */}
                <div className="modal-ver-abono-seccion-estado">
                  <div className={`modal-ver-abono-badge-estado ${obtenerEstadoClase(datosActualizados.estado)}`}>
                    {datosActualizados.estado === 'FINALIZADO' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                    <span>
                      {datosActualizados.estado === 'FINALIZADO' ? 'Pago Completado' : 'En Proceso'}
                    </span>
                  </div>
                  <div className="modal-ver-abono-fecha-creacion">
                    Registrado el {datosActualizados.fechaCreacion}
                  </div>
                </div>

                {/* Información del Cliente */}
                <div className="modal-ver-abono-seccion">
                  <h3 className="modal-ver-abono-titulo-seccion">
                    <User size={16} />
                    Cliente
                  </h3>
                  <div className="modal-ver-abono-grid">
                    <div className="modal-ver-abono-campo">
                      <label><User size={14} /> Nombre</label>
                      <div className="modal-ver-abono-valor">
                        {datosActualizados.cliente.nombre}
                      </div>
                    </div>
                    <div className="modal-ver-abono-campo">
                      <label><Mail size={14} /> Email</label>
                      <div className="modal-ver-abono-valor">
                        {datosActualizados.cliente.email}
                      </div>
                    </div>
                    {datosActualizados.cliente.telefono && (
                      <div className="modal-ver-abono-campo">
                        <label><Phone size={14} /> Teléfono</label>
                        <div className="modal-ver-abono-valor">
                          {datosActualizados.cliente.telefono}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Información del Servicio */}
                <div className="modal-ver-abono-seccion">
                  <h3 className="modal-ver-abono-titulo-seccion">
                    <MapPin size={16} />
                    Servicio
                  </h3>
                  <div className="modal-ver-abono-grid">
                    <div className="modal-ver-abono-campo">
                      <label>Tipo de Tour</label>
                      <div className="modal-ver-abono-valor-destacado">
                        {datosActualizados.servicio.tipo}
                      </div>
                    </div>
                    <div className="modal-ver-abono-campo">
                      <label>Descripción</label>
                      <div className="modal-ver-abono-valor">
                        {datosActualizados.servicio.descripcion}
                      </div>
                    </div>
                    <div className="modal-ver-abono-campo">
                      <label><Calendar size={14} /> Fecha del Tour</label>
                      <div className="modal-ver-abono-valor">
                        {datosActualizados.servicio.fechaTour}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan de Pago */}
                <div className="modal-ver-abono-seccion">
                  <h3 className="modal-ver-abono-titulo-seccion">
                    <DollarSign size={16} />
                    Plan de Pago
                  </h3>

                  {/* Progreso */}
                  <div className="modal-ver-abono-progreso-contenedor">
                    <div className="modal-ver-abono-progreso-info">
                      <span className="modal-ver-abono-progreso-texto">Progreso</span>
                      <span className="modal-ver-abono-progreso-porcentaje">{progreso}%</span>
                    </div>
                    <div className="modal-ver-abono-barra-progreso">
                      <div
                        className="modal-ver-abono-barra-progreso-relleno"
                        style={{
                          width: `${progreso}%`,
                          backgroundColor: progreso === 100 ? '#10b981' : '#3b82f6'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="modal-ver-abono-estadisticas-grid">
                    <div className="modal-ver-abono-tarjeta-stat destacado">
                      <div className="modal-ver-abono-stat-contenido">
                        <span className="modal-ver-abono-stat-label">
                          <DollarSign size={16} />
                          Total
                        </span>
                        <span className="modal-ver-abono-stat-valor">
                          ${datosActualizados.planPago.montoTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="modal-ver-abono-tarjeta-stat">
                      <div className="modal-ver-abono-stat-contenido">
                        <span className="modal-ver-abono-stat-label">
                          <CheckCircle size={16} />
                          Pagado
                        </span>
                        <span className="modal-ver-abono-stat-valor">
                          ${datosActualizados.planPago.montoPagado.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="modal-ver-abono-tarjeta-stat">
                      <div className="modal-ver-abono-stat-contenido">
                        <span className="modal-ver-abono-stat-label">
                          <AlertCircle size={16} />
                          Pendiente
                        </span>
                        <span className="modal-ver-abono-stat-valor">
                          ${datosActualizados.planPago.saldoPendiente.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="modal-ver-abono-tarjeta-stat">
                      <div className="modal-ver-abono-stat-contenido">
                        <span className="modal-ver-abono-stat-label">
                          <TrendingUp size={16} />
                          Abonos
                        </span>
                        <span className="modal-ver-abono-stat-valor">
                          {datosActualizados.planPago.abonosRealizados} / {datosActualizados.planPago.abonosPlaneados}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Información Adicional */}
                  <div className="modal-ver-abono-info-adicional">
                    <div className="modal-ver-abono-info-item">
                      <span className="modal-ver-abono-info-label">Abono Mínimo:</span>
                      <span className="modal-ver-abono-info-valor">
                        ${datosActualizados.planPago.abonoMinimo.toLocaleString()}
                      </span>
                    </div>
                    {datosActualizados.estado !== 'FINALIZADO' && (
                      <div className="modal-ver-abono-info-item">
                        <span className="modal-ver-abono-info-label">Próximo Vencimiento:</span>
                        <span className="modal-ver-abono-info-valor destacado">
                          <Clock size={12} />
                          {datosActualizados.proximoVencimiento}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observaciones Generales */}
                {datosActualizados.observaciones && (
                  <div className="modal-ver-abono-seccion">
                    <h3 className="modal-ver-abono-titulo-seccion">
                      <FileText size={16} />
                      Observaciones
                    </h3>
                    <div className="modal-ver-abono-observaciones-contenido">
                      {datosActualizados.observaciones}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tabActiva === 2 && (
              <div className="modal-ver-abono-tab-contenido">
                {/* Historial de Abonos */}
                <div className="modal-ver-abono-seccion">
                  <h3 className="modal-ver-abono-titulo-seccion">
                    <Receipt size={16} />
                    Historial de Abonos ({cantidadAbonos})
                  </h3>

                  {cantidadAbonos === 0 ? (
                    <div className="modal-ver-abono-sin-abonos">
                      <AlertCircle size={40} />
                      <p>No hay abonos {rolUsuario === 'admin' ? 'registrados' : 'visibles'}</p>
                    </div>
                  ) : (
                    <div className="modal-ver-abono-historial">
                      {abonosFiltrados.map((abono, indice) => {
                        const estaEliminado = abono.activo === false;

                        return (
                          <div
                            key={indice}
                            className={`modal-ver-abono-item-historial ${estaEliminado ? 'eliminado' : ''}`}
                            style={{
                              background: estaEliminado ? '#fee2e2' : 'white',
                              border: estaEliminado ? '2px solid #fca5a5' : '1px solid #e5e7eb'
                            }}
                          >
                            <div className="modal-ver-abono-historial-header">
                              <div className="modal-ver-abono-historial-numero">
                                #{abono.numeroAbono}
                                {estaEliminado && (
                                  <span style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.125rem 0.5rem',
                                    background: '#dc2626',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                  }}>
                                    Eliminado
                                  </span>
                                )}
                              </div>
                              <span className="modal-ver-abono-historial-monto">
                                ${abono.monto.toLocaleString()}
                              </span>
                              <span className="modal-ver-abono-historial-fecha">
                                <Calendar size={12} />
                                {abono.fecha}
                              </span>
                            </div>

                            <div className="modal-ver-abono-historial-contenido">
                              <div className="modal-ver-abono-historial-info">
                                <span className="modal-ver-abono-historial-metodo">
                                  <CreditCard size={12} />
                                  {abono.metodoPago}
                                </span>
                                {abono.referencia && (
                                  <span className="modal-ver-abono-referencia">
                                    Ref: {abono.referencia}
                                  </span>
                                )}
                                {abono.facturaGenerada && (
                                  <span style={{
                                    padding: '0.25rem 0.5rem',
                                    background: '#d1fae5',
                                    color: '#065f46',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                  }}>
                                    ✓ Facturado
                                  </span>
                                )}
                              </div>

                              {abono.observaciones && (
                                <div className="modal-ver-abono-historial-observaciones">
                                  {abono.observaciones}
                                </div>
                              )}

                              {/* ✅ BOTONES DE ACCIÓN POR ABONO */}
                              <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginTop: '0.75rem',
                                paddingTop: '0.75rem',
                                borderTop: '1px solid #e5e7eb'
                              }}>
                                {!estaEliminado ? (
                                  <>
                                    <button
                                      onClick={() => eliminarAbonoSoft(abono)}
                                      style={{
                                        padding: '0.5rem 1rem',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        transition: 'all 0.2s'
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                                      onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
                                    >
                                      <Trash2 size={14} />
                                      Eliminar
                                    </button>

                                    {rolUsuario === 'admin' && (
                                      <button
                                        onClick={() => abrirModalEliminarDefinitivo(abono)}
                                        style={{
                                          padding: '0.5rem 1rem',
                                          background: '#dc2626',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '6px',
                                          fontSize: '0.875rem',
                                          fontWeight: '600',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.5rem',
                                          transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#991b1b'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
                                      >
                                        <XCircle size={14} />
                                        Eliminar Definitivo
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {rolUsuario === 'admin' && (
                                      <>
                                        <button
                                          onClick={() => abrirModalReactivar(abono)}
                                          style={{
                                            padding: '0.5rem 1rem',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                                          onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                                        >
                                          <RotateCcw size={14} />
                                          Restaurar
                                        </button>

                                        <button
                                          onClick={() => abrirModalEliminarDefinitivo(abono)}
                                          style={{
                                            padding: '0.5rem 1rem',
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s'
                                          }}
                                          onMouseEnter={e => e.currentTarget.style.background = '#991b1b'}
                                          onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
                                        >
                                          <XCircle size={14} />
                                          Eliminar de Raíz
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-ver-abono-footer">
            <button className="modal-ver-abono-boton-secundario" onClick={onCerrar}>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* ✅ MODALES REUTILIZADOS */}
      <ModalReactivarAbono
        estaAbierto={modalReactivarAbierto}
        alCerrar={() => setModalReactivarAbierto(false)}
        abono={abonoSeleccionado}
        alReactivar={manejarReactivar}
      />

      <ModalEliminarDefinitivoAbono
        estaAbierto={modalEliminarDefinitivoAbierto}
        alCerrar={() => setModalEliminarDefinitivoAbierto(false)}
        abono={abonoSeleccionado}
        alEliminar={manejarEliminarDefinitivo}
      />
    </>
  );
};

export default ModalVerAbono;